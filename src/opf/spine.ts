import type { Element } from 'xast'
import { x } from 'xastscript'

import type { EbookMeta } from '../config'
import { generateItemId } from '../utils/ids'

/**
 * Generates the OPF `<spine>` section
 * @param meta The ebook metadata
 * @param spine The ebook spine
 * @returns The generated XML tree
 */
export function generateSpine (meta: EbookMeta, spine: string[]): Element {
  return x('spine', { 'page-progression-direction': meta.direction, toc: 'toc-ncx' },
    spine.map((href) => x('itemref', {
      idref: generateItemId(href),
      linear: 'yes',
    })),
  )
}
