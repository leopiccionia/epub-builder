import { u } from 'unist-builder'
import { x } from 'xastscript'

import type { EpubBuilderConfig } from './config'
import { generateGuide } from './opf/guide'
import { generateManifest } from './opf/manifest'
import { generateMetadata, PUB_ID } from './opf/metadata'
import { generateSpine } from './opf/spine'
import type { Resource } from './resources'
import { stringifyXml } from './utils/xml'

/**
 * Generates the OPF package document
 * @param config The builder config
 * @param resources The list of registered resources
 * @returns The generated XML string
 */
export function generateContentOpf (config: EpubBuilderConfig, resources: Resource[]): string {
  const { landmarks, locale, meta, spine } = config

  const cover = resources.find((resource) => resource.properties.includes('cover-image'))

  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0" encoding="utf-8"'),
    x('package', {
      dir: meta.direction,
      'unique-identifier': PUB_ID,
      version: '3.0',
      'xml:lang': meta.language,
      xmlns: 'http://www.idpf.org/2007/opf',
    }, [
      generateMetadata(meta, cover),
      generateManifest(resources),
      generateSpine(meta, spine),
      generateGuide(landmarks, locale),
    ])
  ])

  return stringifyXml(tree)
}
