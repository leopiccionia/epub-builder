import { resolve as resolvePath } from 'node:path'

import { readTextFile } from './utils/files'

/**
 * An EpubBuilder locale
 */
export interface Locale {
  /**
   * Translation of "Start of content"
   */
  bodymatter: string
  /**
   * Translation of "Guide"
   */
  landmarks: string
  /**
   * Translation of "List of images"
   */
  loi: string
  /**
   * Translation of "Table of contents"
   */
  toc: string
  /**
   * Translation of the name of another landmark
   */
  [landmark: string]: string | undefined
}

/**
 * An EpubBuilder locale shorthand
 */
export type KnownLocale = 'en' | 'pt'

/**
 * Resolves the locale object from shorthand
 * @param locale A locale shorthand
 */
async function resolveLocaleShorthand (locale: KnownLocale | Partial<Locale>): Promise<Locale> {
  if (typeof locale === 'object') {
    return locale as Locale
  }

  const path = resolvePath(import.meta.dirname, `static/locales/${locale}.json`)
  const json = await readTextFile(path)
  return JSON.parse(json)
}

/**
 * Loads a locale
 * @param locale An EpubBuilder locale
 * @returns The resolved locale
 */
export async function loadLocale (locale: KnownLocale | Partial<Locale>): Promise<Locale> {
  const translations = {}

  const languageStack = [locale]
  if (locale !== 'en') {
    languageStack.push('en')
  }

  for (const language of languageStack) {
    const newTranslations = await resolveLocaleShorthand(language)
    Object.assign(translations, newTranslations)
  }

  return translations as Locale
}
