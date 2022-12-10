import { StreamZipAsync } from "node-stream-zip"

export const getJSONFromZip = async <T = any>(
  zip: StreamZipAsync,
  filePath: string
): Promise<T> => {
  const data = await zip.entryData(filePath)
  const string = data.toString("utf-8")
  return JSON.parse(string)
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
  return Object.values(entries).some(
    ({ name, isDirectory }) => name === `${dirPath}/` && isDirectory
  )
}

export const findMatchingFiles = async (zip: StreamZipAsync, regex: RegExp) => {
  const entries = await zip.entries()
  return Object.values(entries)
    .filter(({ name, isDirectory }) => regex.test(name) && !isDirectory)
    .map(({ name }) => name)
}

export const checkForRequiredType = (json: any, key: string, type: string) => {
  return typeof json[key] === type
}
