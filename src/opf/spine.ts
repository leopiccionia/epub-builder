import type { Element } from 'xast'
import { x } from 'xastscript'

import type { EbookMeta, TocEntry } from '../config'
import { generateItemId } from '../utils/ids'

/**
 * Generates the OPF `<spine>` section
 * @param meta The ebook metadata
 * @param toc The table of contents
 * @returns The generated XML tree
 */
export function generateSpine (meta: EbookMeta, toc: TocEntry[]): Element {
  return x('spine', { 'page-progression-direction': meta.direction, toc: 'toc-ncx' },
    toc.map((entry) => x('itemref', {
      idref: generateItemId(entry.href),
      linear: 'yes',
    })),
  )
}
