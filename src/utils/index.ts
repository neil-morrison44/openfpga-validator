import { StreamZipAsync } from "node-stream-zip"

export const getJSONFromZip = async <T = {}>(
  zip: StreamZipAsync,
  filePath: string
): Promise<T | null> => {
  const data = await zip.entryData(filePath)
  const string = data.toString("utf-8")
  try {
    const parsed = JSON.parse(string)
    return parsed
  } catch (e) {
    return null
  }
}

export const fileExistsInZip = async (
  zip: StreamZipAsync,
  filePath: string
) => {
  const entries = await zip.entries()
  return Object.values(entries).some(
    ({ name, isDirectory }) => name === filePath && !isDirectory
  )
}

export const dirExistsInZip = async (zip: StreamZipAsync, dirPath: string) => {
  const entries = await zip.entries()
  return Object.values(entries).some(({ name }) =>
    name.startsWith(`${dirPath}/`)
  )
}

export const findMatchingFiles = async (zip: StreamZipAsync, regex: RegExp) => {
  const entries = await zip.entries()
  const files = Object.values(entries)
    .filter(({ name, isDirectory }) => regex.test(name) && !isDirectory)
    .map(({ name }) => name)
  files.sort((a, b) => a.localeCompare(b))
  return files
}
