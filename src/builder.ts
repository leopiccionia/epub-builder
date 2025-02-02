import { generateAppleDisplayOptionsXml } from './apple-display-options-xml'
import { populateConfig } from './config'
import type { EpubBuilderConfig, EpubBuilderPartialConfig } from './config'
import { generateContainerXml } from './container-xml'
import { generateContentOpf } from './content-opf'
import { generateNavXhtml } from './nav-xhtml'
import { generateNcx } from './ncx'
import { createResource } from './resources'
import type { Resource, ResourceProperty } from './resources'
import { readBinaryFile } from './utils/files'
import { ZipContainer } from './zip'

/**
 * A non-opinionated EPUB builder
 */
export class EpubBuilder {
  /**
   * The builder config
   */
  config: EpubBuilderConfig
  /**
   * The list of registered EPUB resources
   */
  readonly resources: Resource[]
  /**
   * The EPUB ZIP container
   */
  private zip!: ZipContainer

  /**
   * The private constructor
   * @param config The builder config
   */
  private constructor (config: EpubBuilderConfig) {
    this.config = config
    this.resources = []
  }

  /**
   * Registers a binary-encoded file
   * @param href The resource's path inside the EPUB container
   * @param content The resource's binary-encoded content
   * @param properties The resource's manifest properties
   * @returns The registered resource
   */
  async addBinaryFile (href: string, content: Blob, properties: ResourceProperty[] = []): Promise<Resource> {
    const resource = createResource(href, properties)
    this.resources.push(resource)
    await this.zip.addBinaryFile(`OEBPS/${href}`, content)
    return resource
  }

  /**
   * Registers a text-encoded file
   * @param href The resource's path inside the EPUB container
   * @param content The resource's text-encoded content
   * @param properties The resource's manifest properties
   * @returns The registered resource
   */
  async addTextFile (href: string, content: string, properties: ResourceProperty[] = []): Promise<Resource> {
    const resource = createResource(href, properties)
    this.resources.push(resource)
    await this.zip.addTextFile(`OEBPS/${href}`, content)
    return resource
  }

  /**
   * Reads a file and registers it as a resource
   * @param href The resource's path inside the EPUB container
   * @param path The file's physical path
   * @param properties The resource's manifest properties
   * @returns The registered resource
   */
  async copyFile (href: string, path: string, properties: ResourceProperty[] = []): Promise<Resource> {
    const blob = await readBinaryFile(path)
    return this.addBinaryFile(href, blob, properties)
  }

  /**
   * Generate metadata files for EPUB compliance
   */
  async #generateFiles (): Promise<void> {
    await this.addTextFile('nav.xhtml', generateNavXhtml(this.config), ['nav'])
    await this.addTextFile('toc.ncx', generateNcx(this.config))

    await this.zip.addTextFile('OEBPS/content.opf', generateContentOpf(this.config, this.resources))
    await this.zip.addTextFile('META-INF/com.apple.ibooks.display-options.xml', generateAppleDisplayOptionsXml(this.resources))
  }

  /**
   * Returns an empty `EpubBuilder`
   * @param partialConfig The builder config
   */
  static async init (partialConfig: EpubBuilderPartialConfig): Promise<EpubBuilder> {
    const config = populateConfig(partialConfig)
    const builder = new EpubBuilder(config)

    builder.zip = await ZipContainer.init()
    await builder.zip.addTextFile('META-INF/container.xml', generateContainerXml())

    return builder
  }

  /**
   * Closes the ZIP container, returning its content
   * @returns The EPUB binary data
   */
  async seal (): Promise<Blob> {
    await this.#generateFiles()
    return this.zip.seal()
  }
}
