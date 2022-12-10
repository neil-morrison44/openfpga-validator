import { Command } from "commander"
import StreamZip from "node-stream-zip"
import { checkForInvalidJSON } from "./checks/json_files"
import { checkForRootFiles } from "./checks/folders"
import { Reporter } from "./report"
import {
  checkAllSpecifiedPlatformsExist,
  checkCoreFolderName,
} from "./checks/core_json"

const program = new Command()

program
  .name("openfpga-validator")
  .description("Script which validates OpenFPGA core zips")
  .version("1.0.0")

program
  .command("check")
  .description("Check a zip file & report errors, warnings, & recommendations")
  .argument("<path_to_zip>", "path to zip file")
  .option("-w, --fail-on-warnings", "Fail on errors & warnings")
  .option(
    "-r, --fail-on-recommendations",
    "Fail on errors, warnings, & recommendations"
  )
  .action(async (zipPath, options) => {
    const reporter = new Reporter()

    const zip = new StreamZip.async({ file: zipPath })

    await checkForInvalidJSON(zip, reporter)
    await checkForRootFiles(zip, reporter)
    await checkCoreFolderName(zip, reporter)
    await checkAllSpecifiedPlatformsExist(zip, reporter)

    zip.close()

    let exitCode = reporter.errorCount
    if (options.failOnWarnings || options.failOnRecommendations)
      exitCode += reporter.warningCount

    if (options.failOnWarnings) exitCode += reporter.recommendationCount

    console.log(`Exit code ${exitCode}`)
    process.exit(exitCode)
  })

program.parse()
