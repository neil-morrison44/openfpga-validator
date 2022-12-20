import { inputJsonSchema } from "../schemas/input_json"
import { CheckFn } from "../types"
import { findMatchingFiles, getJSONFromZip } from "../utils"

export const checkInputsAgainstSchema: CheckFn = async (zip, reporter) => {
  const coreFiles = await findMatchingFiles(zip, /Cores\/.*\/input\.json/g)
  const presetFiles = await findMatchingFiles(
    zip,
    /Presets\/.*\/\/Input\/.*\.json/g
  )

  const files = [...coreFiles, ...presetFiles]

  for (const inputFile of files) {
    const json = await getJSONFromZip(zip, inputFile)
    const result = await inputJsonSchema.safeParseAsync(json)
    if (!result.success) {
      reporter.error(
        `${inputFile} invalid:`,
        "\n\nhttps://www.analogue.co/developer/docs/core-definition-files/input-json\n"
      )
      result.error.issues.forEach((issue) => {
        reporter.error(`${issue.path.join(".")}`, issue.message)
      })
    }
  }
}
