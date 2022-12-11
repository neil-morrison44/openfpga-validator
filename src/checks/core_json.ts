import { StreamZipAsync } from "node-stream-zip"
import { CheckFn, CoreJSON } from "../types"
import {
  checkForRequiredType,
  dirExistsInZip,
  fileExistsInZip,
  findMatchingFiles,
  getJSONFromZip,
} from "../utils"

export const checkCoreFolderName: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
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

export const checkCoreJSONParamTypes: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    let json = await getJSONFromZip(zip, coreFile)

    if (!json.core) {
      reporter.error(
        `Missing / incorrect \`core\` nesting in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
      )
    }

    if (json.core.magic !== "APF_VER_1") {
      reporter.error(
        `Missing / incorrect \`core.magic\` in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#json-definition"
      )
    }

    if (
      !(
        json.core.metadata.platform_ids &&
        Array.isArray(json.core.metadata.platform_ids)
      )
    ) {
      reporter.error(
        `Missing / incorrect \`metadata.platform_ids\` in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
      )
    }

    const expectedToBeStrings = [
      "shortname",
      "description",
      "author",
      "url",
      "version",
      "date_release",
    ]

    expectedToBeStrings.forEach((key) => {
      if (!checkForRequiredType(json.core.metadata, key, "string")) {
        reporter.error(
          `Missing / incorrect \`${key}\` in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
        )
      }
    })

    // framework

    if (json.core.framework.target_product !== "Analogue Pocket") {
      reporter.error(
        `framework.target_product must be set to "Analogue Pocket" in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (
      !checkForRequiredType(json.core.framework, "version_required", "string")
    ) {
      // this could probably be expanded to check for known versions
      reporter.error(
        `missing / incorrect framework.version_required in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (
      !checkForRequiredType(json.core.framework, "sleep_supported", "boolean")
    ) {
      // this could probably be expanded to check for known versions
      reporter.error(
        `missing / incorrect framework.sleep_supported in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (
      json.core.framework.chip32_vm &&
      !checkForRequiredType(json.core.framework, "chip32_vm", "string")
    ) {
      // optional, but must be a string if specified
      // will add another check to see that the file specified exists
      reporter.error(
        `Incorrect framework.chip32_vm in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    // dock

    if (
      !checkForRequiredType(json.core.framework.dock, "supported", "boolean")
    ) {
      reporter.error(
        `missing / incorrect dock.supported in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#dock"
      )
    }

    if (
      !checkForRequiredType(
        json.core.framework.dock,
        "analog_output",
        "boolean"
      )
    ) {
      reporter.error(
        `missing / incorrect dock.analog_output in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#dock"
      )
    }

    // hardware

    if (
      !checkForRequiredType(
        json.core.framework.hardware,
        "link_port",
        "boolean"
      )
    ) {
      reporter.error(
        `missing / incorrect hardware.link_port in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#hardware"
      )
    }

    if (![0, -1].includes(json.core.framework.hardware.cartridge_adapter)) {
      reporter.error(
        `missing / incorrect hardware.cartridge_adapter in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#hardware"
      )
    }

    // cores

    if (!Array.isArray(json.core.cores) || json.core.cores.length === 0) {
      reporter.error(
        `missing / incorrect / empty / too many cores in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
      )
    }

    json.core.cores.forEach((core: any, index: number) => {
      if (!checkForRequiredType(core, "name", "string")) {
        reporter.error(
          `core ${index} missing / incorrect name value in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }

      if (
        !(
          checkForRequiredType(core, "id", "string") ||
          checkForRequiredType(core, "id", "number")
        )
      ) {
        reporter.error(
          `core ${index} missing / incorrect id value in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }

      if (!checkForRequiredType(core, "filename", "string")) {
        reporter.error(
          `core ${index} missing / incorrect filename value in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }
    })
  }
}

export const checkLengthOfThings: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)

    const paramLengths = [
      ["shortname", 31],
      ["description", 63],
      ["author", 31],
      ["url", 63],
      ["version", 31],
      ["date_release", 10],
    ] as const

    paramLengths.forEach(([key, length]) => {
      if (json.core.metadata[key].length > length) {
        reporter.error(
          `param ${key} too long (${json.core.metadata[key].length} > ${length}) in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }
    })
  }
}

export const checkAllMentionedFilesExist: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)

    if (json.core.framework.chip32_vm) {
      const chip32vmPath = coreFile.replace(
        "core.json",
        json.core.framework.chip32_vm
      )

      if (!fileExistsInZip(zip, chip32vmPath)) {
        reporter.error(
          `missing ${chip32vmPath} file`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
        )
      }
    }

    json.core.cores.forEach(({ filename }) => {
      const coreFileName = coreFile.replace("core.json", filename)

      if (!fileExistsInZip(zip, coreFileName)) {
        reporter.error(
          `missing ${coreFileName} file`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
        )
      }
    })
  }
}

export const checkForSemver: CheckFn = async (zip, reporter) => {
  const coreFiles = await coresList(zip)
  const semverRegex = /[0-9]*\.[0-9]*\.[0-9]*/

  for (const coreFile of coreFiles) {
    const json = await getJSONFromZip<CoreJSON>(zip, coreFile)
    if (!semverRegex.test(json.core.metadata.version)) {
      reporter.recommend(
        `SemVer versioning is highly encouraged - \`${json.core.metadata.version}\` in ${coreFile}`,
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
    const platformIds = json.core.metadata.platform_ids

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
