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
    const json = await getJSONFromZip(zip, coreFile)

    if (!(json.platform_ids && Array.isArray(json.platform_ids))) {
      reporter.error(
        `Missing / incorrect \`platform_ids\` in ${coreFile}`,
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
      if (!checkForRequiredType(json, key, "string")) {
        reporter.error(
          `Missing / incorrect \`${key}\` in ${coreFile}`,
          "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#metadata"
        )
      }
    })

    // framework

    if (json.framework.target_product !== "Analogue Pocket") {
      reporter.error(
        `framework.target_product must be set to "Analogue Pocket" in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (!checkForRequiredType(json.framework, "version_required", "string")) {
      // this could probably be expanded to check for known versions
      reporter.error(
        `missing / incorrect framework.version_required in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (!checkForRequiredType(json.framework, "sleep_supported", "boolean")) {
      // this could probably be expanded to check for known versions
      reporter.error(
        `missing / incorrect framework.sleep_supported in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    if (
      json.framework.chip32_vm &&
      !checkForRequiredType(json.framework, "chip32_vm", "string")
    ) {
      // optional, but must be a string if specified
      // will add another check to see that the file specified exists
      reporter.error(
        `Incorrect framework.chip32_vm in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#framework"
      )
    }

    // dock

    if (!checkForRequiredType(json.dock, "supported", "boolean")) {
      reporter.error(
        `missing / incorrect dock.supported in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#dock"
      )
    }

    if (!checkForRequiredType(json.dock, "analog_output", "boolean")) {
      reporter.error(
        `missing / incorrect dock.analog_output in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#dock"
      )
    }

    // hardware

    if (!checkForRequiredType(json.hardware, "link_port", "boolean")) {
      reporter.error(
        `missing / incorrect hardware.link_port in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#hardware"
      )
    }

    if (![0, -1].includes(json.hardware.cartridge_adapter)) {
      reporter.error(
        `missing / incorrect hardware.cartridge_adapter in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#hardware"
      )
    }

    // cores

    if (!Array.isArray(json.cores) || json.cores.length === 0) {
      reporter.error(
        `missing / incorrect / empty cores in ${coreFile}`,
        "\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json#cores"
      )
    }

    json.cores.forEach((core: any, index: number) => {
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
