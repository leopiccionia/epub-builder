import { describe, expect, it } from 'vitest'

import { getMimeType, isCoreMediaType } from '../src/utils/mime'

describe('Get MIME types', () => {
  it('Images', () => {
    expect(getMimeType('image.gif')).toBe('image/gif')
    expect(getMimeType('image.jpg')).toBe('image/jpeg')
    expect(getMimeType('image.jpeg')).toBe('image/jpeg')
    expect(getMimeType('image.png')).toBe('image/png')
    expect(getMimeType('image.svg')).toBe('image/svg+xml')
    expect(getMimeType('image.webp')).toBe('image/webp')
  })

  it('Audio', () => {
    expect(getMimeType('audio.mp3')).toBe('audio/mpeg')
    expect(getMimeType('audio.m4a')).toBe('audio/mp4')
    expect(getMimeType('audio.oga')).toBe('audio/ogg')
    expect(getMimeType('audio.ogg')).toBe('audio/ogg')
  })

  it('Style', () => {
    expect(getMimeType('style.css')).toBe('text/css')
  })

  it('Fonts', () => {
    expect(getMimeType('font.otf')).toBe('font/otf')
    expect(getMimeType('font.ttf')).toBe('font/ttf')
    expect(getMimeType('font.woff')).toBe('font/woff')
    expect(getMimeType('font.woff2')).toBe('font/woff2')
  })

  it('Miscellaneous', () => {
    expect(getMimeType('script.js')).toBe('application/javascript')
    expect(getMimeType('toc.ncx')).toBe('application/x-dtbncx+xml')
    expect(getMimeType('overlay.smil')).toBe('application/smil+xml')
    expect(getMimeType('index.xhtml')).toBe('application/xhtml+xml')
  })

  it('Invalid', () => {
    expect(getMimeType('image-jpg')).toBeUndefined()
    expect(getMimeType('format.invalid')).toBeUndefined()
  })
})

describe('Validate core media types', () => {
  it('Images', () => {
    expect(isCoreMediaType('image/gif')).toBe(true)
    expect(isCoreMediaType('image/jpeg')).toBe(true)
    expect(isCoreMediaType('image/png')).toBe(true)
    expect(isCoreMediaType('image/svg+xml')).toBe(true)
    expect(isCoreMediaType('image/webp')).toBe(true)

    expect(getMimeType('image.avif')).toBe('image/avif')
    expect(isCoreMediaType('image/avif')).toBe(false)

    expect(getMimeType('image.bmp')).toBe('image/bmp')
    expect(isCoreMediaType('image/bmp')).toBe(false)
  })

  it('Audio', () => {
    expect(isCoreMediaType('audio/mp4')).toBe(true)
    expect(isCoreMediaType('audio/mpeg')).toBe(true)
    expect(isCoreMediaType('audio/ogg')).toBe(true)

    expect(getMimeType('audio.aac')).toBe('audio/aac')
    expect(isCoreMediaType('audio/aac')).toBe(false)

    expect(getMimeType('audio.mid')).toBe('audio/midi')
    expect(isCoreMediaType('audio/midi')).toBe(false)

    expect(getMimeType('audio.wav')).toBe('audio/wav')
    expect(isCoreMediaType('audio/wav')).toBe(false)
  })

  it('Video', () => {
    expect(getMimeType('video.avi')).toBe('video/x-msvideo')
    expect(isCoreMediaType('video/x-msvideo')).toBe(false)

    expect(getMimeType('video.mpeg')).toBe('video/mpeg')
    expect(isCoreMediaType('video/mpeg')).toBe(false)

    expect(getMimeType('video.mp4')).toBe('video/mp4')
    expect(isCoreMediaType('video/mp4')).toBe(false)

    expect(getMimeType('video.webm')).toBe('video/webm')
    expect(isCoreMediaType('video/webm')).toBe(false)
  })

  it('Style', () => {
    expect(isCoreMediaType('text/css')).toBe(true)
  })

  it('Fonts', () => {
    expect(isCoreMediaType('font/otf')).toBe(true)
    expect(isCoreMediaType('font/ttf')).toBe(true)
    expect(isCoreMediaType('font/woff')).toBe(true)
    expect(isCoreMediaType('font/woff2')).toBe(true)
  })

  it('Miscellaneous', () => {
    expect(isCoreMediaType('application/javascript')).toBe(true)
    expect(isCoreMediaType('application/smil+xml')).toBe(true)
    expect(isCoreMediaType('application/xhtml+xml')).toBe(true)
    expect(isCoreMediaType('application/x-dtbncx+xml')).toBe(true)

    expect(getMimeType('book.epub')).toBe('application/epub+zip')
    expect(isCoreMediaType('application/epub+zip')).toBe(false)

    expect(getMimeType('virus.exe')).toBe('application/octet-stream')
    expect(isCoreMediaType('application/octet-stream')).toBe(false)

    expect(getMimeType('index.html')).toBe('text/html')
    expect(isCoreMediaType('text/html')).toBe(false)

    expect(getMimeType('README.md')).toBe('text/markdown')
    expect(isCoreMediaType('text/markdown')).toBe(false)

    expect(getMimeType('book.pdf')).toBe('application/pdf')
    expect(isCoreMediaType('application/pdf')).toBe(false)

    expect(getMimeType('data.xml')).toBe('application/xml')
    expect(isCoreMediaType('application/xml')).toBe(false)

    expect(getMimeType('folder.zip')).toBe('application/zip')
    expect(isCoreMediaType('application/zip')).toBe(false)
  })

  it('Invalid', () => {
    expect(isCoreMediaType(undefined)).toBe(false)
    expect(isCoreMediaType('invalid/mime')).toBe(false)
  })
})
