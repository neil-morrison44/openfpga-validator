import { dirExistsInZip } from "../utils"
import { CheckFn } from "../types"

export const checkForRootFiles: CheckFn = async (zip, reporter) => {
  const hasAssets = await dirExistsInZip(zip, "Assets")
  if (!hasAssets) reporter.warn("Missing `Assets` directory")

  const hasCores = await dirExistsInZip(zip, "Cores")
  if (!hasCores) reporter.warn("Missing `Cores` directory")

  const hasPlatforms = await dirExistsInZip(zip, "Platforms")
  if (!hasPlatforms) reporter.recommend("Missing `Platforms` directory")
}
