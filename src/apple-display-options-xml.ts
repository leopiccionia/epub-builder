import { u } from 'unist-builder'
import { x } from 'xastscript'

import { Resource } from './resources'
import { stringifyXml } from './utils/xml'

/**
 * Generates the proprietary `com.apple.ibooks.display-options.xml` for improved supported in Apple devices
 * @param resources The list of registered resources
 * @returns The generated XML string
 */
export function generateAppleDisplayOptionsXml (resources: Resource[]): string {
  const hasEmbeddedFonts = resources.some((resource) => {
    return resource.mime.startsWith('font/')
  })

  const hasInteractiveContent = resources.some((resource) => {
    return resource.mime === 'application/javascript' || resource.properties.includes('scripted')
  })

  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0" encoding="utf-8"'),
    x('display_options', [
      x('platform', { name: '*' }, [
        x('option', { name: 'specified-fonts' }, String(hasEmbeddedFonts)),
        x('option', { name: 'interactive' }, String(hasInteractiveContent)),
      ])
    ])
  ])

  return stringifyXml(tree)
}
