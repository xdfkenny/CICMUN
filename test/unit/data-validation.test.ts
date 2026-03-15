import { describe, expect, it } from 'vitest'
import { normalizeCommittees, normalizeEvents } from '../../server/utils/data-validation'

describe('normalizeCommittees', () => {
  it('falls back to generated local committee artwork and keeps only valid resource files', () => {
    const { committees, errors } = normalizeCommittees([
      {
        id: 99,
        name: 'Test Committee',
        type: 'JMUN',
        chairName: 'Alex',
        coChairName: 'Taylor',
        topicA: 'Test Topic A',
        image: 'https://images.example.com/committee.jpg',
        resources: [
          {
            title: 'Rules',
            description: 'Valid published resource',
            filename: 'Rules of procedure.pdf',
          },
          {
            title: 'Missing Guide',
            description: 'Missing file should be filtered out',
            filename: 'missing-guide.pdf',
          },
        ],
      },
    ])

    expect(committees).toHaveLength(1)
    expect(committees[0]?.image).toBe('/committee-images/generated/jmun-99-test-committee.svg')
    expect(committees[0]?.resources).toEqual([
      {
        title: 'Rules',
        description: 'Valid published resource',
        filename: 'Rules of procedure.pdf',
      },
    ])
    expect(errors).toEqual(expect.arrayContaining([
      'committee:99:image must be a local public asset path',
      'committee:99:image falling back to generated local asset',
      'committee:99:resources[1] file not found: missing-guide.pdf',
    ]))
  })
})

describe('normalizeEvents', () => {
  it('preserves valid events and strips disallowed remote map hosts', () => {
    const { events, errors } = normalizeEvents([
      {
        id: 'samun',
        name: 'SAMUN 2026',
        startDate: '2026-11-20T00:00:00-04:00',
        endDate: '2026-11-21T23:59:59-04:00',
        timezone: 'America/Caracas',
        mapUrl: 'https://evil.example.com/embed',
      },
    ])

    expect(events).toHaveLength(1)
    expect(events[0]?.mapUrl).toBeNull()
    expect(errors).toContain('event:samun:mapUrl invalid or disallowed map url')
  })
})
