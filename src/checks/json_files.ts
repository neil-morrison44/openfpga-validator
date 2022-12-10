import { CheckFn } from "../types"

export const checkForInvalidJSON: CheckFn = async (zip, reporter) => {
  const entries = await zip.entries()

  for (const entry of Object.values(entries)) {
    if (!entry.isDirectory && entry.name.endsWith(".json")) {
      const data = await zip.entryData(entry.name)
      const string = data.toString("utf-8")
      try {
        const json = JSON.parse(string)
      } catch (err) {
        reporter.error(`Unparsable JSON file: ${entry.name}`, err)
      }
    }
  }
}
