import { StreamZipAsync } from "node-stream-zip"
import { Reporter } from "../report"
import { coreJsonSchema } from "../schemas/core_json"
import { CheckFn, CoreJSON } from "../types"
import { fileExistsInZip, findMatchingFiles, getJSONFromZip } from "../utils"

export const checkCoreFolderName: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    if (!json) continue
    const { success } = await coreJsonSchema.safeParseAsync(json)
    if (!success) return

    const name = `${json.core.metadata.author}.${json.core.metadata.shortname}`
    if (!coreFile.startsWith(`Cores/${name}`)) {
      reporter.error(
        `Core folder ${coreFile.replace(
          "/core.json",
          ""
        )} should be Cores/${name} to match`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files#folder-naming-convention"
      )
    }
  }
}

export const checkCoreJSONSchema: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    const result = await coreJsonSchema.safeParseAsync(json)
    if (!result.success) {
      reporter.error(
        `${coreFile} invalid:`,
        "\n\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json\n"
      )
      result.error.issues.forEach((issue) => {
        reporter.error(`${issue.path.join(".")}`, issue.message)
      })
    }
  }
}

export const checkAllMentionedFilesExist: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    if (!json) continue
    const { success } = await coreJsonSchema.safeParseAsync(json)
    if (!success) continue
    if (json.core.framework.chip32_vm) {
      const chip32vmPath = coreFile.replace(
        "core.json",
        json.core.framework.chip32_vm
      )

      const exists = await fileExistsInZip(zip, chip32vmPath)
      if (!exists) {
        reporter.error(
          `missing ${chip32vmPath} file`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
        )
      }
    }

    for (const core of json.core?.cores || []) {
      const coreFileName = coreFile.replace("core.json", core.filename)
      const exists = await fileExistsInZip(zip, coreFileName)
      if (!exists) {
        reporter.error(
          `missing ${coreFileName} file`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }
    }
  }
}

export const checkForSemver: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)
  const semverRegex = /[0-9]*\.[0-9]*\.[0-9]*/

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    if (!json) continue
    const { success } = await coreJsonSchema.safeParseAsync(json)
    if (!success) continue

    if (!semverRegex.test(json.core.metadata.version)) {
      reporter.recommend(
        `SemVer versioning is highly encouraged - \`${json.core?.metadata?.version}\` in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
      )
    }
  }
}

export const countCoresInZip: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  if (coreFiles.length === 0) {
    reporter.error(`No Cores found in zip!`)
  }

  if (coreFiles.length > 1) {
    reporter.recommend(
      "it's easier for users to install what they want when each zip contains 1 core"
    )
  }
}

export const checkSpecifiedPlatformsExist: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    if (!json) continue

    const { success } = await coreJsonSchema.safeParseAsync(json)
    if (!success) continue

    const platformIds = json.core.metadata.platform_ids
    const atLeastOnePlatformExists = (
      await Promise.all(
        platformIds.map(
          async (p) => await fileExistsInZip(zip, `Platforms/${p}.json`)
        )
      )
    ).some((e) => e)

    if (!atLeastOnePlatformExists) {
      reporter.error(
        `Core ${coreFile} should specify at least 1 platform with a matching platform.json file`,
        "\n https://www.analogue.co/developer/docs/platform-metadata#platform.json:~:text=All%20cores%20that%20specify%20a%20platform%20but%20no%20matching%20file%20is%20found%20for%20that%20platform%20will%20not%20display%20any%20additional%20information%20about%20the%20platform%20nor%20be%20able%20to%20access%20future%20features%20in%20Analogue%20OS."
      )
    }

    for (const platformId of platformIds) {
      const platformPath = `Platforms/${platformId}.json`
      const platformExists = await fileExistsInZip(zip, platformPath)

      if (!platformExists && !atLeastOnePlatformExists) {
        reporter.recommend(
          `Specified platform ${platformId} is missing, ${platformPath} should exist`,
          "\n https://www.analogue.co/developer/docs/platform-metadata#platform.json"
        )
      }

      if (!platformExists) continue

      const platformImagePath = `Platforms/_images/${platformId}.bin`
      const platformImageExists = await fileExistsInZip(zip, platformImagePath)

      if (!platformImageExists) {
        reporter.recommend(
          `${platformId} is missing an image`,
          "\n https://www.analogue.co/developer/docs/platform-metadata#platform-image"
        )
      }
    }
  }
}

const coresList = async (zip: StreamZipAsync) =>
  findMatchingFiles(
    zip,
    /Cores\/[a-zA-Z0-9_.-\s]*\.[a-zA-Z0-9_.-\s]*\/core.json/g
  )
