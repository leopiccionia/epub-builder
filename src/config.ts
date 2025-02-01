import { v4 as uuid } from '@lukeed/uuid/secure'
import { defu } from 'defu'

import type { KnownLocale, Locale } from './locales'

/**
 * An ebook set of metadata
 */
export interface EbookMeta {
  /**
   * The book title
   */
  title: string
  /**
   * The book subtitle
   */
  subtitle: string
  /**
   * The book description
   */
  description: string
  /**
   * The reading direction (left-to-right, right-to-left, or auto)
   */
  direction: 'ltr' | 'rtl' | 'auto'
  /**
   * The language tag
   * @see https://www.w3.org/International/articles/language-tags/
   */
  language: string
  /**
   * The book publisher
   */
  publisher: {
    /**
     * The publisher type
     */
    type?: 'Organization' | 'Person'
    /**
     * The publisher name
     */
    name: string
  }
  /**
   * A list of contributors to the book
   */
  creators: Array<{
    /**
     * The contributor's name
     */
    name: string
    /**
     * The contributor's role MARC code
     * @see https://www.loc.gov/marc/relators/relaterm.html
     */
    role: string
    /**
     * The contributor's type
     */
    type?: 'Organization' | 'Person'
    /**
     * Normalized form of contributor's name
     */
    'file as'?: string
    /**
     * Contributor's name in alternative scripts or languages
     */
    alternate?: { [language: string]: string }
  }>
  /**
   * Unique identifiers
   */
  ids: {
    /**
     * An ISBN (International Standard Book Number) identifier
     */
    isbn?: string
    /**
     * A DOI (Digital Object Identifier) identifier
     */
    doi?: string
    /**
     * An UUID (Universally Unique Identifier) v4-compatible identifier
     */
    uuid?: string
  }
}

/**
 * A EPUB builder config
 */
export interface EpubBuilderConfig {
  /**
   * The builder locale
   */
  locale: KnownLocale | Locale
  /**
   * The book metadata
   */
  meta: EbookMeta
}

/**
 * Fills the user-provided config with default values
 * @param partialConfig The partial config
 * @returns The completely-filled config
 */
export function populateConfig (partialConfig: Partial<EpubBuilderConfig>): EpubBuilderConfig {
  return defu(partialConfig, {
    locale: 'en' as const,
    meta: {
      title: '',
      subtitle: '',
      description: '',
      direction: 'ltr' as const,
      language: 'en',
      publisher: {
        type: 'Organization' as const,
        name: '',
      },
      creators: [],
      ids: {
        uuid: uuid(),
      },
    },
  })
}
