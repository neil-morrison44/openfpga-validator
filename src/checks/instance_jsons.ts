import { instanceJsonSchema } from "../schemas/instance_json"
import { CheckFn } from "../types"
import { findMatchingFiles, getJSONFromZip } from "../utils"

export const checkInstanceJSONSchema: CheckFn = async (zip, reporter) => {
  const instanceJsonFiles = await findMatchingFiles(zip, /Assets\/.*\.json/g)
  for (const instanceFile of instanceJsonFiles) {
    const json = await getJSONFromZip(zip, instanceFile)
    if (!json) continue
    const result = await instanceJsonSchema.safeParseAsync(json)
    if (!result.success) {
      reporter.error(
        `${instanceFile} invalid:`,
        "\n\nhttps://www.analogue.co/developer/docs/core-definition-files/core-json\n"
      )
      result.error.issues.forEach((issue) => {
        reporter.error(`${issue.path.join(".")}`, issue.message)
      })
    }
  }
}
