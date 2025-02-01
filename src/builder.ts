import { readBinaryFile } from './files'
import { BinaryResource, TextResource } from './resources'
import type { Resource, ResourceProperty } from './resources'
import { ZipContainer } from './zip'

/**
 * A non-opinionated EPUB builder
 */
export class EpubBuilder {
  /**
   * The list of registered EPUB resources
   */
  private resources: Resource[]
  /**
   * The EPUB ZIP container
   */
  private zip!: ZipContainer

  /**
   * The private constructor
   */
  private constructor () {
    this.resources = []
  }

  /**
   * Registers a binary-encoded file
   * @param href The resource's path inside the EPUB container
   * @param content The resource's binary-encoded property
   * @param property The resource's manifest property
   * @returns The registered resource
   */
  async addBinaryFile (href: string, content: Blob, property: ResourceProperty | undefined = undefined): Promise<BinaryResource> {
    const resource = new BinaryResource(href, content, property)
    this.resources.push(resource)
    await this.zip.addBinaryFile(href, content)
    return resource
  }

  /**
   * Reads a file and registers it as a resource
   * @param href The resource's path inside the EPUB container
   * @param path The file's physical path
   * @param property The resource's manifest property
   * @returns The registered resource
   */
  async addFile (href: string, path: string, property: ResourceProperty | undefined = undefined): Promise<BinaryResource> {
    const blob = await readBinaryFile(path)
    return this.addBinaryFile(href, blob, property)
  }

  /**
   * Registers a text-encoded file
   * @param href The resource's path inside the EPUB container
   * @param content The resource's text-encoded content
   * @param property The resource's manifest property
   * @returns The registered resource
   */
  async addTextFile (href: string, content: string, property: ResourceProperty | undefined = undefined): Promise<TextResource> {
    const resource = new TextResource(href, content, property)
    this.resources.push(resource)
    await this.zip.addTextFile(href, content)
    return resource
  }

  /**
   * Returns an empty `EpubBuilder`
   */
  static async init (): Promise<EpubBuilder> {
    const builder = new EpubBuilder()

    builder.zip = await ZipContainer.init()

    return builder
  }

  /**
   * Closes the ZIP container, returning its content
   * @returns The EPUB binary data
   */
  async seal (): Promise<Blob> {
    return this.zip.seal()
  }
}
