import { describe, expect, it } from 'vitest'

import { EpubBuilder } from '../src'

describe('Basic tests', () => {
  it('can be instantiated', async () => {
    const builder = await EpubBuilder.init({
      spine: [],
      toc: [],
      landmarks: {
        bodymatter: '',
        toc: '',
      },
    })

    expect(builder.config.locale).toBe('en')
    expect(typeof builder.locale).toBe('object')
  })
})
