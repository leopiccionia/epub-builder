import { getMimeType } from './mime'

/**
 * A resource manifest property
 * @see https://www.w3.org/TR/epub-33/#app-item-properties-vocab
 */
export type ResourceProperty = 'cover-image' | 'mathml' | 'nav' | 'remote-resources' | 'scripted' | 'svg' | 'switch'

/**
 * A resource representing a file asset
 */
export interface Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined
}

/**
 * A binary-encoded resource
 */
export class BinaryResource implements Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined
  /**
   * The resource's binary-encoded content
   */
  private content: Blob

  /**
   * @param href The resource's path inside the EPUB container
   * @param content The resource's binary-encoded content
   * @param property The resource's manifest property
   */
  constructor (href: string, content: Blob, property: ResourceProperty | undefined = undefined) {
    this.href = href
    this.content = content
    this.mime = getMimeType(href)!
    this.property = property
  }
}

/**
 * A text-encoded resource
 */
export class TextResource implements Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined
  /**
   * The resource's text-encoded content
   */
  private content: string

  /**
   * @param href The resource's path inside the EPUB container
   * @param content The resource's text-encoded content
   * @param property The resource's manifest property
   */
  constructor (href: string, content: string, property: ResourceProperty | undefined = undefined) {
    this.href = href
    this.content = content
    this.mime = getMimeType(href)!
    this.property = property
  }
}
