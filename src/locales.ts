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
