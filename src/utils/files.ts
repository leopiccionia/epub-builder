import { readFile } from 'node:fs/promises'

/**
 * Reads the content of a binary file
 * @param path The file path
 * @returns The file content
 */
export async function readBinaryFile (path: string): Promise<Blob> {
  const buffer = await readFile(path)
  return new Blob([buffer])
}
