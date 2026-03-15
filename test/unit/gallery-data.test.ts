import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadGalleryDataFromFile, parseGalleryData } from '../../server/utils/gallery-data'

const tempDirectories: string[] = []

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

describe('parseGalleryData', () => {
  it('parses gallery metadata arrays', () => {
    expect(parseGalleryData('[{"id":"jmun-2025","images":[]}]')).toEqual([
      { id: 'jmun-2025', images: [] },
    ])
  })

  it('rejects non-array gallery metadata', () => {
    expect(() => parseGalleryData('{"id":"jmun-2025"}')).toThrow('Gallery metadata must be an array.')
  })
})

describe('loadGalleryDataFromFile', () => {
  it('reads gallery metadata from disk', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gallery-data-'))
    const filePath = path.join(directory, 'gallery.json')
    tempDirectories.push(directory)

    fs.writeFileSync(filePath, '[{"id":"samun-2025","images":[{"id":"samun-1"}]}]')

    expect(loadGalleryDataFromFile(filePath)).toEqual([
      {
        id: 'samun-2025',
        images: [{ id: 'samun-1' }],
      },
    ])
  })
})
