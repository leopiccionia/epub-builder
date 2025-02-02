import type { Element } from 'xast'
import { x } from 'xastscript'

import type { EpubBuilderConfig, Landmarks, TocEntry } from './config'
import type { Locale } from './locales'
import { stringifyXml } from './utils/xml'

/**
 * Converts the ebook landmarks into a XHTML list
 * @param landmarks The ebook landmarks
 * @param locale The builder locale
 * @returns The generated XML tree
 */
function generateLandmarks (landmarks: Landmarks, locale: Locale): Element {
  return x('ol',
    Object.entries(landmarks).map(([landmark, href]) => x('li', [
      x('a', { 'epub:type': landmark, 'href': href }, locale[landmark] ?? landmark),
    ]))
  )
}

/**
 * Converts a TOC entry into a XHTML list
 * @param entries A list of links
 * @returns The generated XML tree
 */
function generateTocList (entries: TocEntry[]): Element {
  return x('ol',
    entries.map(({ children, href, text }) => x('li', [
      x('a', { href }, text),
      children && children.length > 0 ? generateTocList(children) : null
    ]))
  )
}

/**
 * Generates the navigation document
 * @param config The builder config
 * @param locale The builder locale
 * @returns The generated XML string
 */
export function generateNavXhtml (config: EpubBuilderConfig, locale: Locale): string {
  const { landmarks, meta, toc } = config

  const tree = x('html', {
    dir: meta.direction,
    lang: meta.language,
    'xml:lang': meta.language,
    xmlns: 'http://www.w3.org/1999/xhtml',
    'xmlns:epub': 'http://www.idpf.org/2007/ops'
  }, [
    x('head', [
      x('meta', { charset: 'UTF-8' }),
      x('title', meta.title),
    ]),
    x('body', [
      x('h1', meta.title),
      x('nav', { 'epub:type': 'toc' }, [
        x('h2', locale.toc),
        generateTocList(toc),
      ]),
      x('nav', { 'epub:type': 'landmarks' }, [
        x('h2', locale.landmarks),
        generateLandmarks(landmarks, locale),
      ]),
    ]),
  ])

  return stringifyXml(tree)
}
