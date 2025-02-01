import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import type { ZipWriterAddDataOptions } from '@zip.js/zip.js'

/**
 * The EPUB ZIP container
 */
export class ZipContainer {
  #zip: ZipWriter<Blob>

  /**
   * The private constructor
   */
  private constructor () {
    const writer = new BlobWriter('application/epub+zip')
    this.#zip = new ZipWriter(writer)
  }

  /**
   * Adds a binary file to the container
   * @param path The path to the file inside the container
   * @param blob The binary data
   * @param options Options passed to `zip.js`
   */
  async addBinaryFile (path: string, blob: Blob, options: ZipWriterAddDataOptions = {}): Promise<void> {
    const reader = new BlobReader(blob)
    await this.#zip.add(path, reader, options)
  }

  /**
   * Adds a text file to the container
   * @param path The path to the file inside the container
   * @param text The textual data
   * @param options Options passed to `zip.js`
   */
  async addTextFile (path: string, text: string, options: ZipWriterAddDataOptions = {}): Promise<void> {
    const reader = new TextReader(text)
    await this.#zip.add(path, reader, options)
  }

  /**
   * Returns an empty `ZipContainer`
   */
  static async init (): Promise<ZipContainer> {
    const container = new ZipContainer()

    await container.addTextFile('mimetype', 'application/epub+zip', { compressionMethod: 0, extendedTimestamp: false })

    return container
  }

  /**
   * Closes the container, returning its content
   * @returns The EPUB binary data
   */
  async seal (): Promise<Blob> {
    return this.#zip.close()
  }
}
