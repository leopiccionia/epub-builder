import type { Element } from 'xast'
import { x } from 'xastscript'

import type { Resource } from '../resources'
import { generateItemId } from '../utils/ids'

/**
 * Generates the OPF `<manifest>` section
 * @param resources The list of registered resources
 * @returns The generated XML tree
 */
export function generateManifest (resources: Resource[]): Element {
  return x('manifest', resources.map(({ href, mime, properties }) => x('item', {
    href,
    id: generateItemId(href),
    'media-type': mime,
    properties: properties.length > 0 ? properties.join(' ') : undefined,
  })))
}
