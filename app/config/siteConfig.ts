/**
 * Single source of truth for edition branding, conference names, and dates.
 *
 * Every year/date/name string rendered on the site should derive from this
 * file (or from the JSON datasets under /data, which mirror these values for
 * the server-rendered API routes). When the edition changes, update this file
 * AND the two datasets (data/events.json, data/schedule.json) — no page
 * component should need touching.
 */
export const siteConfig = {
  brand: 'CICMUN',
  edition: '2027',
  /** Public canonical URL — used to build absolute og:image URLs. */
  siteUrl: 'https://cicmun.qzz.io',
  samun: {
    name: 'SAMUN 2027',
    date: '2027-11-12',
    dateLabel: 'November 12-13, 2027',
  },
  jmun: {
    name: 'JMUN 2027',
    date: '2027-04-24',
    dateLabel: 'April 24-25, 2027',
  },
  copyright: `© ${new Date().getFullYear()} Colegio Internacional de Caracas`,
} as const

/** e.g. "CICMUN 2027" — used by title templates and og tags. */
export const siteTitle = `${siteConfig.brand} ${siteConfig.edition}`