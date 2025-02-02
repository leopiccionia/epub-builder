import { getMimeType } from './utils/mime'

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
   * The resource's manifest properties
   */
  properties: ResourceProperty[]
}

/**
 * Generates a resource descriptor
 * @param href The resource's path inside the EPUB container
 * @param properties The resource's manifest properties
 * @returns The resource descriptior
 */
export function createResource (href: string, properties: ResourceProperty[] = []): Resource {
  return {
    href,
    mime: getMimeType(href)!,
    properties,
  }
}
