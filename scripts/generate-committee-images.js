import fs from 'node:fs'
import path from 'node:path'

const committeesPath = path.resolve('data/committees.json')
const outputDir = path.resolve('public/committee-images/generated')

const slugify = (value) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const filenameForCommittee = (committee) =>
  `${committee.type.toLowerCase()}-${committee.id}-${slugify(committee.name)}.svg`

const wrapLines = (value, maxLength = 14) => {
  const words = value.trim().split(/\s+/)
  const lines = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxLength) {
      current = candidate
      continue
    }

    if (current) {
      lines.push(current)
      if (lines.length === 2) return lines
    }
    current = word
  }

  if (current) lines.push(current)
  return lines.slice(0, 2)
}

const buildSvg = (committee) => {
  const accent = committee.type === 'SAMUN' ? '#dc2626' : '#111827'
  const accentSoft = committee.type === 'SAMUN' ? '#fecaca' : '#d1d5db'
  const label = escapeXml(`${committee.type} Committee`)
  const committeeNameLines = wrapLines(committee.name).map(escapeXml)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(committee.name)}</title>
  <desc id="desc">Generated conference artwork for ${escapeXml(committee.name)}.</desc>
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafaf9" />
      <stop offset="100%" stop-color="#e5e7eb" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${accentSoft}" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)" />
  <circle cx="${220 + (committee.id % 5) * 40}" cy="220" r="180" fill="${accentSoft}" opacity="0.75" />
  <circle cx="1360" cy="${680 - (committee.id % 4) * 30}" r="220" fill="${accentSoft}" opacity="0.55" />
  <rect x="120" y="120" width="1360" height="660" rx="48" fill="#ffffff" opacity="0.82" />
  <rect x="120" y="120" width="16" height="660" fill="${accent}" />
  <text x="220" y="260" fill="${accent}" font-family="Montserrat, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="10">${label}</text>
  <text x="220" y="430" fill="#0f172a" font-family="Montserrat, Arial, sans-serif" font-size="108" font-weight="800">${committeeNameLines[0] ?? ''}</text>
  <text x="220" y="540" fill="#0f172a" font-family="Montserrat, Arial, sans-serif" font-size="108" font-weight="800">${committeeNameLines[1] ?? ''}</text>
  <text x="220" y="660" fill="#475569" font-family="Open Sans, Arial, sans-serif" font-size="34">Colegio Internacional de Caracas Model United Nations</text>
  <path d="M1180 210h160l72 72v408l-72 72h-160l72-72V282z" fill="url(#accent)" opacity="0.92" />
  <path d="M1040 322h180v44h-180zm0 104h240v44h-240zm0 104h180v44h-180z" fill="#ffffff" opacity="0.88" />
</svg>
`
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const rawCommittees = JSON.parse(fs.readFileSync(committeesPath, 'utf8'))
const committees = Array.isArray(rawCommittees)
  ? rawCommittees.filter((committee) =>
      committee
      && Number.isFinite(Number(committee.id))
      && typeof committee.name === 'string'
      && (committee.type === 'JMUN' || committee.type === 'SAMUN'),
    )
  : []

const expectedFiles = new Set()

for (const committee of committees) {
  const filename = filenameForCommittee(committee)
  expectedFiles.add(filename)
  fs.writeFileSync(path.join(outputDir, filename), buildSvg(committee))
}

for (const existingFile of fs.readdirSync(outputDir)) {
  if (!expectedFiles.has(existingFile) && existingFile.endsWith('.svg')) {
    fs.unlinkSync(path.join(outputDir, existingFile))
  }
}

console.log(`Generated ${expectedFiles.size} committee image placeholders in ${outputDir}`)
