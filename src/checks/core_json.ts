import { StreamZipAsync } from "node-stream-zip"
import { coreJsonSchema } from "../schemas/core_json"
import { CheckFn, CoreJSON } from "../types"
import { fileExistsInZip, findMatchingFiles, getJSONFromZip } from "../utils"

export const checkCoreFolderName: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    const name = `${json?.core?.metadata?.author}.${json?.core?.metadata?.shortname}`
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
    const result = coreJsonSchema.safeParse(json)
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

    if (json.core?.framework?.chip32_vm) {
      const chip32vmPath = coreFile.replace(
        "core.json",
        json.core.framework.chip32_vm
      )

      const exists = fileExistsInZip(zip, chip32vmPath)
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
    if (!semverRegex.test(json.core?.metadata?.version)) {
      reporter.recommend(
        `SemVer versioning is highly encouraged - \`${json.core?.metadata?.version}\` in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
      )
    }
  }
}

export const checkAllSpecifiedPlatformsExist: CheckFn = async (
  zip,
  reporter
) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    const platformIds = json.core?.metadata?.platform_ids || []

    for (const platformId of platformIds) {
      const platformPath = `Platforms/${platformId}.json`
      const platformExists = await fileExistsInZip(zip, platformPath)

      if (!platformExists) {
        reporter.error(
          `Specified platform ${platformId} is missing, ${platformPath} should exist`,
          "\n https://www.analogue.co/developer/docs/platform-metadata#platform.json"
        )
      }

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
  findMatchingFiles(zip, /Cores\/[a-zA-Z0-9_.-]*\.[a-zA-Z0-9_.-]*\/core.json/g)
