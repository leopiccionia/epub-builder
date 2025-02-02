import type { Element } from 'xast'
import { x } from 'xastscript'

import type { EbookMeta } from '../config'
import type { Resource } from '../resources'

/**
 * The unique identifier property
 */
export const PUB_ID: string = 'pub-id'

/**
 * An unique identifier for use in DublinCore
 */
interface UniqueIdentifier {
  /**
   * The identifier
   */
  id: string,
  /**
   * The identifier type
   * @see https://ns.editeur.org/onix/en/5
   */
  onix: string,
}

/**
 * Generates the OPF creators metadata
 * @param meta The ebook metadata
 * @returns The generated list of XML trees
 */
function generateCreators (meta: EbookMeta): Element[] {
  return meta.creators.flatMap((creator, index) => {
    const id = `creators-${index + 1}`
    const dcTag = ['aut', 'dub'].includes(creator.role) ? 'dc:creator' : 'dc:contributor'

    const creatorMeta = [
      x(dcTag, { id }, creator.name),
      x('meta', { refines: `#${id}`, property: 'role', scheme: 'marc:relators' }, creator.role)
    ]

    if (creator['file as']) {
      creatorMeta.push(
        x('meta', { refines: `#${id}`, property: 'file-as' }, creator['file as'])
      )
    }

    if (creator.alternate) {
      for (const [lang, alias] of Object.entries(creator.alternate)) {
        x('meta', { refines: `#${id}`, property: 'alternate-script', 'xml:lang': lang }, alias)
      }
    }

    return creatorMeta
  })
}

/**
 * Generates the OPF subject metadata
 * @param meta The ebook metadata
 * @returns The generated list of XML trees
 */
function generateSubjects (meta: EbookMeta): Element[] {
  return meta.subjects.flatMap((subject, index) => {
    const id = `subject-${index + 1}`

    return [
      x('dc:subject', { id }, subject.label),
      x('meta', { refines: `#${id}`, property: 'authority' }, subject.authority),
      x('meta', { refines: `#${id}`, property: 'term' }, subject.term),
    ]
  })
}

/**
 * Generates the OPF `<metadata>` section
 * @param meta The ebook metadata
 * @param cover The cover image
 * @returns The generated XML tree
 */
export function generateMetadata (meta: EbookMeta, cover: Resource | undefined): Element {
  const { id: pubId, onix } = getUniqueIdentifier(meta)

  return x('metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/', 'xmlns:opf': 'http://www.idpf.org/2007/opf' }, [
    x('dc:identifier', { id: PUB_ID }, pubId),
    x('dc:title', { id: 'title' }, meta.title),
    meta.subtitle
      ? x(null, [
        x('dc:title', { id: 'subtitle' }, meta.subtitle),
        x('meta', { refines: '#subtitle', property: 'title-type' }, 'subtitle'),
      ])
      : null,
    meta.description ? x('dc:description', meta.description) : null,
    meta.publisher.name ? x('dc:publisher', meta.publisher.name) : null,
    meta.date ? x('dc:date', meta.date) : null,
    x('dc:language', meta.language),
    x('meta', { property: 'dcterms:modified' }, getTimestamp()),
    x('meta', { refines: `#${PUB_ID}`, property: 'identifier-type', scheme: 'onix:codelist5' }, onix),
    cover && x('meta', { name: 'cover', content: cover.href }),
    ...generateCreators(meta),
    ...generateSubjects(meta),
  ])
}

/**
 * Returns the timestamp, in `CCYY-MM-DDThh:mm:ssZ` format
 */
function getTimestamp (): string {
  const isoString = new Date().toISOString()
  return isoString.slice(0, 19) + 'Z'
}

/**
 * Extracts the DublinCore unique identifier from config
 * @param meta The ebook metadata
 */
export function getUniqueIdentifier (meta: EbookMeta): UniqueIdentifier {
  const { doi, isbn, uuid } = meta.ids
  if (isbn) {
    const onix = isbn.length > 10 ? '15' : '02'
    return { id: `urn:isbn:${isbn}`, onix }
  } else if (doi) {
    return { id: `urn:doi:${doi}`, onix: '06' }
  } else {
    return { id: `urn:uuid:${uuid}`, onix: '01' }
  }
}
