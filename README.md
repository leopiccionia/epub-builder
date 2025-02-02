# Epub Builder

A non-opinionated EPUB builder for reflowable content

## Install

```bash
npm install @leopiccionia/epub-builder
```

## Features

Generates EPUBs that are fully compatible with [EPUB 3.3](https://www.w3.org/TR/epub-33/) standard, with some additional compatibility with EPUB 2.

It provides a declarative API, for easy configuration, and writes for you:

- a machine-readable table of contents
- accessibility landmarks
- all the boring EPUB ceremony

## Usage example

```js
import { EpubBuilder } from '@leopiccionia/epub-builder'

const ebook = await EpubBuilder.init({
  // Some book metadata
  meta: {
    title: 'An example book',
    creators: [
      { name: 'John Doe' },
    ],
  },
  // The reading order
  spine: [
    'cover.xhtml',
    'toc.xhtml',
    'chapter-1.xhtml',
  ],
  // The table of contents
  toc: [
    { href: 'toc.xhtml', text: 'Table of contents' },
    { href: 'chapter-1.xhtml', text: 'Chapter 1', children: [
      { href: 'chapter-1.xhtml#introduction', text: 'Introduction' },
      { href: 'chapter-1.xhtml#conclusion', text: 'Conclusion' },
    ] },
  ],
  // Some accessibility landmarks
  landmarks: {
    toc: 'toc.xhtml', // The table of contents
    bodymatter: 'chapter-1.xhtml', // The start of content
  },
})

// Add the ebook files
await ebook.addTextFile('toc.xhtml', '...')
await ebook.addTextFile('chapter-1.xhtml', '...')
await ebook.addTextFile('cover.xhtml', '...')
await ebook.copyFile('cover.png', 'PATH TO THE IMAGE')

// Returns the ZIP file
const blob = await ebook.seal()
```

## Related projects

- [Pubmark](https://github.com/leopiccionia/pubmark) - A Markdown to EPUB converter powered by this package
