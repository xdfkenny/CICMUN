---
target: landing page
total_score: 19
max_score: 28
na_heuristics: 5,7,9
p0_count: 0
p1_count: 2
target_identity: "file:/Users/xdfke/Documents/CICMUN/app/pages/index.vue"
target_fingerprint: "sha256:4ab5513cb6af53d9bd644b9abbdb629e1a248a59982da01320578c5483c77ab4"
target_path: /Users/xdfke/Documents/CICMUN/app/pages/index.vue
timestamp: 2026-11-03T17-21-55Z
slug: app-pages-index-vue
closed: true
---
# Critique: CICMUN landing page (`app/pages/index.vue`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Countdown shows liveness, but the literal date is nowhere on the page; countdown has no static/ARIA equivalent |
| 2 | Match System / Real World | 3 | "Where Future Leaders Are Forged" / "unforgettable" / "premier" puffery vs the documented no-hype voice |
| 3 | User Control and Freedom | 3 | Always-visible nav covers exits; page end offers no next step at all |
| 4 | Consistency and Standards | 2 | Four different section-heading treatments and three card languages on one page |
| 5 | Error Prevention | n/a | Read-only page, no user input surface |
| 6 | Recognition Rather Than Recall | 3 | Six labeled wayfinding cards (5–7 option band at one decision point, but grouped) |
| 7 | Flexibility and Efficiency | n/a | Persuade/Experience surface; no accelerator layer applies |
| 8 | Aesthetic and Minimalist Design | 3 | Disciplined palette/type; generic geometric hero decor and filler Values cards |
| 9 | Error Recovery | n/a | No user-triggerable error path on this page; empty-dataset countdown hides gracefully |
| 10 | Help and Documentation | 2 | Contact exists only as unlabeled icon buttons in the footer; no contextual help |
| **Total** | | **19/28** | **Acceptable (67.9% — significant improvements available)** |

n/a heuristics: 5, 7, 9. Applicable maximum: 28.

## Design Specificity Verdict

Partially authored. The brand layer is genuinely CICMUN — red/black identity, Montserrat/Open Sans, the school's real crest, real team photos, real committee datasets. But the page skeleton (red-gradient hero → countdown → 6-card wayfinding grid → about columns → team grid → values cards) is the category pattern for any MUN/conference landing page, the hero's geometric decorations (rotated squares, a lone vertical rule, outline globe) are product-neutral, and the copy ("Where Future Leaders Are Forged", "unforgettable conference", "South America's premier Model UN conference") could ship unchanged on a thousand conference sites. An unrelated product could reuse this page's composition with a color swap.

## Deterministic Scan

- CLI markup scan (`impeccable detect --json` on index.vue + CountdownTimer, ExploreLinks, TeamSection, Navigation, Footer): **clean, exit 0**. Navigation.vue and TeamSection.vue are covered by documented `ignoreFiles` entries for dynamic `:src` bindings (known false positives).
- Rendered URL scans (this session, full element rules): **clean on all 9 routes** including `/`.
- Live overlay injection: **blocked by the site's Content-Security-Policy** (`script-src 'self'` refuses localhost:8400). Security-positive; fallback = the rendered URL scans above. No user-visible overlay is available.

## What's Working

1. **Real institutional content** — actual named team with photos, real committees, real documents. This earns trust no template can fake, and it's the page's moat.
2. **Wayfinding discipline** — the six Explore cards sit immediately under the hero and map every primary task (SAMUN, JMUN, Delegates, Schedule, Resources, Gallery) to one click with icon+label, never icon-only.
3. **Coherent brand layer** — one red, one black, two typefaces, used consistently; browser surfaces (selection, focus, scrollbar) now themed; graceful reveal-on-scroll with reduced-motion and no-JS fallbacks.

## Priority Issues

1. **[P1] The one fact delegates need — the date — is not on the page.** PRODUCT.md's success bar: "answer in under a minute: when is it, where is it." The hero answers "in 23 days" via ticking numbers, but "November 27–28, 2026" appears nowhere, and neither does the venue (Colegio Internacional de Caracas, Caracas). A countdown can't be screenshotted, cited, or recalled after the tab closes. Fix: one text line under the countdown label — "November 27–28, 2026 · Colegio Internacional de Caracas, Caracas" — sourced from events.json, already loaded.
2. **[P1] The page ends on a dead end (peak-end violation).** After CIC Values, the visitor gets a footer with a logo, two icons, and a copyright. A delegate who scrolls to the end — the emotionally committed reader — is handed nothing: no next step, no date reminder, no wayfinding. Fix: close the page with the site's existing "Continue exploring" cross-wayfinding pattern (already built in ConferenceOverviewPage.vue) pointing at Delegates/Resources/Schedule.
3. **[P2] Copy drifts from the documented brand voice.** PRODUCT.md: "No hype, no sales language, no invented superlatives." The page ships "Where Future Leaders Are Forged", "an unforgettable conference", "one of South America's premier Model UN conferences". Fix: plain institutional lines that state facts (dates, place, who it's for) and let the real content carry the pride. The primary CTA also says "Explore the conferences" but links to /delegates.
4. **[P2] Four section-heading systems on one page.** "Explore CICMUN" (left, mb-2), "About CICMUN" (centered, mb-6), "MEET THE TEAM" (uppercase + red bar, mb-6), "CIC Values" (centered, mb-12) — plus three card languages (rounded-2xl border, rounded-lg shadow-sm hover-lift, bordered team tiles). The page reads as four sessions stitched together. Fix: one heading pattern (size/spacing/alignment) and one card language for same-role surfaces.
5. **[P3] Countdown is not screen-reader safe.** Ticking day/hour/minute/second numbers are exposed raw — no aria-hidden, no static text equivalent. Fix: aria-hidden the ticking units and add an sr-only line "SAMUN 2026 starts November 27, 2026" (which also fixes issue 1's data source once).

## Persona Red Flags

**Jordan (Confused First-Timer, 13-year-old delegate):** Understands it's a MUN site within seconds (good). Wants "when is it" → gets a ticking box, not a date. Wants help/contact → footer offers only two unlabeled icons (Instagram, mail — aria-labeled but visually icon-only). Acronyms SAMUN/JMUN are expanded in card descriptions — good.

**Riley (Deliberate Stress Tester):** With an empty events dataset the countdown block vanishes gracefully (min-h reserved, no layout jump) — good. But the primary CTA carries `animation-delay: 0.9s; animation-fill-mode: both` — on a slow phone the page's only action is invisible for nearly a second after the hero paints. The hero also hard-codes `#180507` outside the token system.

**Casey (Distracted Mobile User):** Mobile composition holds — 2×2 countdown, stacked cards, zero horizontal overflow, targets ≥24px. Primary CTA sits mid-hero, reachable by thumb. No state to persist; heavy hero assets are CSS/SVG, not images — good.

## Minor Observations

- Hero gradient stops on a hard-coded `#180507` instead of a token.
- CIC Values cards carry `hover-lift` but aren't links — a false affordance.
- CIC Values is three same-size cards of title+text — the category default container.
- Explore grid = 6 options at one decision point (acceptable as grouped wayfinding; keep an eye on it).
- Footer copyright names the school but never the conference — "© Colegio Internacional de Caracas" with no CICMUN link.

## Questions to Consider

- What if the date itself were the hero's second line — the one fact every viewer needs, visible in every screenshot?
- What if the page ended by handing the visitor their next step (their committee, their guide) instead of ending on a values list?
- What would this page look like if it trusted the school's own photography instead of generic geometric decoration?
