import { Command } from "commander"
import StreamZip from "node-stream-zip"
import { checkForInvalidJSON } from "./checks/json_files"
import { checkForRootFiles } from "./checks/folders"
import { Reporter } from "./report"
import {
  checkAllMentionedFilesExist,
  checkAllSpecifiedPlatformsExist,
  checkCoreFolderName,
  checkForSemver,
  checkCoreJSONSchema,
  countCoresInZip,
} from "./checks/core_json"
import { checkInputsAgainstSchema } from "./checks/input_json"

export const runCLI = () => {
  const program = new Command()

  program
    .name("openfpga-validator")
    .description("Script which validates OpenFPGA core zips")
    .version(require("../package.json").version)

  program
    .command("check")
    .description(
      "Check a zip file & report errors, warnings, & recommendations"
    )
    .argument("<path_to_zip>", "path to zip file")
    .option("-w, --fail-on-warnings", "Fail on errors & warnings")
    .option(
      "-r, --fail-on-recommendations",
      "Fail on errors, warnings, & recommendations"
    )
    .action(async (zipPath, options) => {
      const exitCode = await processZip(zipPath, options, true)
      process.exit(exitCode)
    })

  program.parse()
}

export const processZip = async (
  zipPath: string,
  options: { failOnWarnings: boolean; failOnRecommendations: boolean },
  chalk = false
) => {
  const reporter = new Reporter({ chalk })

  const zip = new StreamZip.async({ file: zipPath })

  // general

  await checkForInvalidJSON(zip, reporter)
  await checkForRootFiles(zip, reporter)

  // core

  await checkCoreFolderName(zip, reporter)
  await checkAllMentionedFilesExist(zip, reporter)
  await checkCoreJSONSchema(zip, reporter)
  await countCoresInZip(zip, reporter)
  await checkForSemver(zip, reporter)
  await checkAllSpecifiedPlatformsExist(zip, reporter)

  // input

  await checkInputsAgainstSchema(zip, reporter)

  await zip.close()

  let exitCode = reporter.errorCount
  if (options.failOnWarnings || options.failOnRecommendations)
    exitCode += reporter.warningCount

  if (options.failOnWarnings) exitCode += reporter.recommendationCount

  console.log(`Exit code ${exitCode}`)
  return exitCode
}
