import { u } from 'unist-builder'
import { x } from 'xastscript'

import { stringifyXml } from './utils/xml'

/**
 * Generates a basic OCF `container.xml`
 * @returns The generated XML string
 */
export function generateContainerXml (): string {
  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0" encoding="utf-8"'),
    x('container', { version: '1.0', xmlns: 'urn:oasis:names:tc:opendocument:xmlns:container' }, [
      x('rootfiles', [
        x('rootfile', { 'full-path': 'OEBPS/content.opf', 'media-type': 'application/oebps-package+xml' }),
      ]),
    ]),
  ])

  return stringifyXml(tree)
}
