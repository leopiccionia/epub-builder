/**
 * An EpubBuilder locale
 */
export interface Locale {
  bodymatter?: string
  landmark?: string
  toc?: string
}

/**
 * An EpubBuilder locale shorthand
 */
export type KnownLocale = 'en' | 'pt-BR'
