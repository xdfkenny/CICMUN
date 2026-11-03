# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, in this order:

1. **Delegates** — middle- and high-school students at Colegio Internacional de Caracas and visiting schools. They arrive before and during a conference to find out when it is, which committees exist, what to research, where to be, and what to bring.
2. **Faculty advisors and coaches** — teachers who plan a delegation's participation. They need dates, grade ranges, committee assignments, and the official documents in one citable place.

Both are usually on a phone, often on school or mobile networks in Venezuela, sometimes between classes on the day of the event.

## Product Purpose

The official delegate portal for CICMUN, the Model United Nations programme of Colegio Internacional de Caracas. It publishes the two annual conferences — SAMUN (high school) and JMUN (middle school) — with their committees, schedules, venues, research resources, and photo gallery, so a delegate can prepare and show up without asking a staff member.

Success means a delegate or advisor can answer, unaided, in under a minute: *when is it, where is it, what committee am I in, and what do I read first?*

## Positioning

CICMUN is the school's own conference programme, not a generic MUN listing. The portal's authority comes from being the single, current, school-published source for its two conferences — committee rosters, official charter and rules of procedure, and per-committee research guides — backed by the school's real institutional identity. A third-party MUN directory could list the dates; it could not publish the committee datasets or the school's own documents.

## Operating Context

- Two conferences per academic year: SAMUN (grades 9–12) in late November and JMUN (grades 6–8) in late April, both at Colegio Internacional de Caracas, Minas de Baruta, Caracas.
- Content is maintained by conference staff as JSON datasets in the repository (`data/committees.json`, `data/events.json`, `data/schedule.json`, `data/gallery.json`, `data/resources.json`) and rendered by Nitro API routes.
- The site is consulted both weeks ahead (preparation) and on the day (room, time, gallery).
- Official documents live as PDFs under `public/resources/`; the charter and rules of procedure are the canonical policy documents.
- Priorities after the event include browsing and sharing photos.

## Capabilities and Constraints

- Read-only information portal. Registration is **out of scope for now**: any register call to action must resolve to an existing external channel (email or an official Google Form), never to a dead end or an invented form.
- Nuxt 4 + Vue 3 + Tailwind CSS 4, deployed as a static/Vercel-style site. Nitro routes read the JSON datasets; there is no database and no server-side persistence.
- Committee and schedule data change per edition. Edition branding, conference names, and dates must derive from `app/config/siteConfig.ts` plus the mirrored JSON datasets, so an edition change never requires touching page components.
- Empty or unconfirmed datasets must render an explicit "coming soon" / unavailable state rather than placeholder content.
- Gallery originals are served through a Nitro proxy route; thumbnails are generated at build time.

## Brand Commitments

- Name: **CICMUN** — Colegio Internacional de Caracas Model United Nations. Never rebrand or rename.
- Institution: Colegio Internacional de Caracas, Caracas, Venezuela. The school is the authority behind the site.
- Voice: institutional, plain, and welcoming to students. No hype, no sales language, no invented superlatives.
- The school's logo and the red/black conference identity are existing brand assets and must be preserved.
- Public copy ships in English only.

## Evidence on Hand

- `data/committees.json` — published committee datasets, with the SAMUN 2026 set (6 committees) live and the JMUN set empty until republished.
- `data/events.json` — confirmed conference dates, venue, address, and map links for SAMUN 2026 and JMUN 2027.
- `data/schedule.json` — schedule dataset, intentionally empty until a real schedule is confirmed.
- `data/resources.json` plus `public/resources/*.pdf` — charter, rules of procedure, and per-committee research guides.
- `public/gallery/`, `public/gallery-origins/`, and `data/gallery.json` — real event photography, including the JMUN 2026 Drive manifest.
- `public/team-photos/` — conference leadership portraits.

**Absences future work must not fabricate:** no testimonials, no award counts, no attendance numbers, no pricing, no registration deadlines, no schedule specifics, and no committee staff photos. Staff photo fields stay `null` by policy and the UI renders initials avatars.

## Product Principles

1. **One question, one screen.** A delegate should reach dates, committee, schedule, or a document in a single navigation step, on a phone.
2. **Publish only what is confirmed.** Empty is honest; placeholder is not. Confirmed data comes from the datasets, and nothing is invented to fill space.
3. **The school's authority, not a marketing voice.** Plain institutional copy, real documents, real photos.
4. **Edition changes are data changes.** Every year, date, and name derives from configuration and datasets, never from hard-coded page copy.
5. **Privacy outranks completeness.** Staff identities are public; staff photographs are not.

## Accessibility & Inclusion

Web accessibility is a stated quality bar: WCAG AA contrast, keyboard-operable tabs and lightbox, visible focus, respects `prefers-reduced-motion`, and content that reads without JavaScript. The audience is on mobile devices on constrained networks, so performance and touch target size are part of accessibility here.
