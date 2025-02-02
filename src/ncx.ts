import type { Element } from 'xast'
import { x } from 'xastscript'

import type { EpubBuilderConfig, TocEntry } from './config'
import { getUniqueIdentifier } from './opf/metadata'
import { stringifyXml } from './utils/xml'

/**
 * Converts a TOC entry into a NCX `<navPoint>` list
 * @param entries A list of links
 * @param prefix Prefix for `navPoint` IDs
 * @returns The generated NCX/XML tree
 */
function generateList (entries: TocEntry[], prefix: string = 'ncx'): Element[] {
  return entries.map((entry, index) => {
    const entryId = `${prefix}-${index}`
    return x('navPoint', { id: entryId }, [
      x('navLabel', [
        x('text', entry.text),
      ]),
      x('content', { src: entry.href }),
      ...(entry.children && entry.children.length > 0 ? generateList(entry.children, entryId) : []),
    ])
  })
}

/**
 * Generates the NCX navigation document, for EPUB 2.0 compatibility
 * @param config The builder config
 * @returns The generated NCX/XML string
 */
export function generateNcx (config: EpubBuilderConfig): string {
  const { meta, toc } = config

  const tree = x('ncx', { version: '2005-1', 'xml:lang': meta.language, xmlns: 'http://www.daisy.org/z3986/2005/ncx/' }, [
    x('head', [
      x('meta', { content: getUniqueIdentifier(meta).id, name: 'dtb:uid' }),
    ]),
    x('docTitle', [
      x('text', meta.title),
    ]),
    x('navMap', generateList(toc)),
  ])

  return stringifyXml(tree)
}
