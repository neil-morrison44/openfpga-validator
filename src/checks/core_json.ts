import { StreamZipAsync } from "node-stream-zip"
import { CheckFn, CoreJSON } from "../types"
import { dirExistsInZip, findMatchingFiles, getJSONFromZip } from "../utils"

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
      const platformExists = await dirExistsInZip(zip, platformPath)

      if (!platformExists) {
        reporter.error(
          `Specified platform ${platformId} is missing, ${platformPath} should exist`,
          "\n https://www.analogue.co/developer/docs/platform-metadata#platform.json"
        )
      }

      const platformImagePath = `Platforms/_images/${platformId}.bin`
      const platformImageExists = await dirExistsInZip(zip, platformImagePath)

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
