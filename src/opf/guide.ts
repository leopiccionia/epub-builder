import type { Element } from 'xast'
import { x } from 'xastscript'

import type { Landmarks } from '../config'
import type { Locale } from '../locales'

/**
 * Generates the OPF `<guide>` section, for EPUB 2.0 compatibility
 * @param landmarks The ebook landmarks
 * @param locale The builder locale
 * @returns The generated XML tree
 */
export function generateGuide (landmarks: Landmarks, locale: Locale): Element {
  return x('guide', [
    x('reference', { href: landmarks.toc, title: locale.toc, type: 'toc' })
  ])
}
