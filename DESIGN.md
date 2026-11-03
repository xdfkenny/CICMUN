---
name: CICMUN Delegate Portal
description: The official delegate portal for the Colegio Internacional de Caracas Model United Nations.
colors:
  cic-crimson: "#DC2628"
  ink-black: "#000000"
  bulletin-paper: "#FFFFFF"
  notice-grey: "#F5F5F5"
  slate-grey: "#333333"
  rule-line: "#E4E4E7"
  cover-night: "oklch(0.13 0.028 261.692)"
typography:
  display:
    fontFamily: "Montserrat, ui-sans-serif, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Montserrat, ui-sans-serif, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Montserrat, ui-sans-serif, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0em"
  body:
    fontFamily: "Open Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "Open Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "6.4px"
  md: "8.4px"
  lg: "10.4px"
  xl: "14.4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.bulletin-paper}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.cic-crimson}"
    textColor: "{colors.bulletin-paper}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  card:
    backgroundColor: "{colors.bulletin-paper}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.xl}"
    padding: "24px"
  chip-active:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.bulletin-paper}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  chip-idle:
    backgroundColor: "{colors.notice-grey}"
    textColor: "{colors.slate-grey}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
---

# Design System: CICMUN Delegate Portal

## Overview

**Creative North Star: "The Official Bulletin"**

This is a school's official record, not a campaign page. The system reads like a printed bulletin that happens to be a website: white paper, black type, hairline rules, and one crimson that carries the school's authority. Information is set, not performed — a date is a date, a committee is a committee, and the type hierarchy does the persuading that decoration would otherwise do.

Density is generous but never airy for its own sake. Section rhythm comes from a 4px base scale and a single 1280px content column, so a delegate scanning on a phone sees the same order a delegate scanning on a laptop sees. Photography is evidence: real rooms, real delegates, real committees. Where there is no evidence — an unpublished schedule, a committee roster still being confirmed — the page says so in plain words rather than filling the slot with placeholder art.

The chromatic budget is deliberately narrow. Black and white carry structure, grey carries secondary text and rules, and crimson is a signal: the active tab, the one primary call to action, the divider under a page title. The restraint is the identity; a page that spends crimson everywhere stops being this system.

**Key Characteristics:**
- White paper ground, black type, hairline grey rules.
- One signal color, used on a small fraction of any screen.
- Rectangular forms with small radii (8–10px), never pills for content, never zero-radius austerity.
- Flat at rest; depth appears only as a response to hover or overlay state.
- Montserrat for structure, Open Sans for reading.

## Colors

A two-ink system — black and crimson on white — with grey doing the connective work.

### Primary
- **CIC Crimson** (`#DC2628`, `oklch(0.577 0.245 27.325)`): The school's red. Used for the single primary call to action on a surface, the active navigation pill's hover state, the divider under a page title, the countdown accent, and inline emphasis on committee and conference pages. It is a signal, not a surface: large crimson fills are limited to hero overlays where a photograph sits underneath.

### Neutral
- **Ink Black** (`#000000`): Headlines, body text at full strength, and the active navigation pill. Also the default filled button.
- **Bulletin Paper** (`#FFFFFF`): The page ground and every card surface. The system assumes white; there is no tinted paper.
- **Notice Grey** (`#F5F5F5`): The ground for interior pages (`bg-gray-50`) and the idle state of chips and tabs.
- **Slate Grey** (`#333333`, with Tailwind's 500–700 steps covering secondary text): Subtitles, metadata, captions, and de-emphasized labels.
- **Rule Line** (`#E4E4E7`, `oklch(0.92 0.004 286.32)`): Every border and divider at rest. 1px, never heavier except for the 2px header rule under the navigation.
- **Cover Night** (`oklch(0.13 0.028 261.692)`): The footer ground only. The single near-black surface in the system.

### Named Rules
**The One Signal Rule.** Crimson occupies less than roughly a tenth of any viewport. If two competing elements are both red, one of them is wrong.

**The No Tinted Paper Rule.** Backgrounds are white or `#F5F5F5`. No cream, no blue-grey, no gradient wash behind content. Depth comes from rules and shadow, never from hue.

## Typography

**Display Font:** Montserrat (with `ui-sans-serif, sans-serif`)
**Body Font:** Open Sans (with `ui-sans-serif, system-ui, sans-serif`)

**Character:** Montserrat gives the pages their institutional spine — geometric, slightly wide, unmistakably a school's signage. Open Sans keeps long passages readable at small sizes on a phone. The pairing is deliberately conventional: the system earns its character from scale and restraint, not from an unusual face.

### Hierarchy
- **Display** (700, `text-4xl` → `text-6xl` / 2.25rem → 3.75rem, `tracking-tight`, line-height 1.1): Page heroes only. One per page, uppercase on conference and gallery surfaces.
- **Headline** (700, `text-2xl` → `text-3xl`, line-height 1.2): Section openers and card titles that anchor a block of content.
- **Title** (700, `text-lg` → `text-xl`, line-height 1.3): Committee names, event names, list-item headings.
- **Body** (400–500, `text-base`, line-height 1.625): Prose, descriptions, and table cells. Keep measure near 65–75 characters; the 1280px container handles this by capping prose blocks rather than the page.
- **Label** (600, `text-xs` → `text-sm`, `tracking-widest` when set in caps): Navigation, dates, metadata, and button text.

### Named Rules
**The Two-Face Rule.** Montserrat never sets a paragraph and Open Sans never sets a page title. The boundary is structural, not stylistic.

**The Caps Belong To Structure Rule.** Uppercase is for page titles, conference names, and navigation — never for body copy or long headings, where it costs reading speed.

## Layout

A single centered container with a 1280px cap (`max-width: 1280px`) at `lg` and above, padded 16px, 24px, then 32px as the viewport grows. Content lives in one column on mobile and splits to two or three at `md` (768px) and `lg` (1024px); nothing reflows to four columns.

Vertical rhythm is built from the 4px base scale: 16px inside compact cards, 24px inside standard cards, 32px between related blocks, 48px between sections, and 64–96px around page heroes. Section padding is `py-12` to `py-20`; the navigation is a fixed 80px tall at rest and compresses to 64px with a translucent white ground once scrolled.

Breakpoints are the Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Mobile-first: every layout is authored single-column and widened, never narrowed.

## Elevation & Depth

The system is flat at rest and lifted on interaction. Cards carry a thin border and at most a whisper of shadow (`shadow-sm`) so they read as paper on paper; the shadow that matters is the hover lift (`-translate-y-2` with `shadow-xl`, 300ms ease-out). Navigation is the exception that proves the rule: it gains `shadow-md` at rest because it is pinned above content, and `shadow-lg` once scrolled.

Overlays — the image lightbox, the mobile menu, the command-style overlays — are the only places with heavy elevation (`shadow-2xl`) and a dark scrim, because they must visibly detach from the page beneath.

### Shadow Vocabulary
- **Whisper** (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): Card and input rest state.
- **Lift** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): Card hover, paired with a 8px upward translate.
- **Pinned** (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): Sticky navigation at rest.
- **Overlay** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): Lightbox, dialogs, and full-screen menus.

### Named Rules
**The Flat-At-Rest Rule.** A card that is not being interacted with does not float. If a surface needs a shadow to be legible, the border and spacing are wrong.

## Shapes

Rectangles with a small, consistent radius. The base radius is 10.4px (`--radius: 0.65rem`), expressed as `rounded-lg` on cards and panels, `rounded-md` (8.4px) on buttons and inputs, and `rounded-xl` (14.4px) on the larger content cards. Pills (`rounded-full`) are reserved for the navigation's active-state container, filter chips, and social icon buttons — never for primary content cards.

Borders are 1px hairline rules in `Rule Line`, except the navigation's 2px black bottom rule, which is the system's one deliberate heavy line and frames the header as a masthead. Imagery is never clipped into circles except for portrait avatars; banners and committee art stay rectangular and edge-to-edge within their container.

## Components

### Buttons
- **Shape:** Small rectangular radius (8.4px, `rounded-md`), 36px tall at default size, 16px horizontal padding, 8px gap to an icon.
- **Primary:** Black ground with white text at rest (`bg-black text-white`); crimson on hover. In the shared `UiButton`, the `default` variant instead assigns the brand crimson as ground — used where an action should read as the school's, not the page's.
- **Hover / Focus:** Background shift plus a subtle scale or translate (`active:scale-95`, `hover:scale-105` on large CTAs), 300ms. Focus is a 3px ring in the accent color at 50% opacity, offset by a border color shift.
- **Secondary / Ghost / Outline:** Ghost is transparent with a grey hover wash; outline is a hairline border with no fill; link is crimson underlined on hover. Large navigation CTAs use black for active and transparent-grey for idle.

### Chips
- **Style:** Fully rounded (`rounded-full`), 8px × 16px padding. Active chips are black ground with white text; idle chips are `Notice Grey` with `Slate Grey` text.
- **State:** Used for schedule day filters and gallery event filters. The active chip is the only element in the row allowed to be black; there is no crimson chip.

### Cards / Containers
- **Corner Style:** `rounded-xl` (14.4px) for content cards, `rounded-lg` (10.4px) for tighter panels.
- **Background:** `Bulletin Paper` on light pages; a photograph with a dark scrim on conference and committee heroes.
- **Shadow Strategy:** Whisper at rest, Lift on hover (see Elevation).
- **Border:** 1px `Rule Line` at rest. Committee and conference cards may swap the border for a 2px black or crimson top rule to signal the conference.
- **Internal Padding:** 24px (`p-6`) standard, 32px (`p-8`) for feature cards.

### Navigation
- **Style:** Sticky masthead, 80px tall at rest compressing to 64px on scroll, white ground with `backdrop-blur` when scrolled, 2px black bottom rule. Wordmark in Montserrat, `tracking-widest`, beside the school crest.
- **States:** Active items are a black filled pill with white text; idle items are black text with a grey hover wash. Desktop links sit behind a slide-in underline (`nav-link`, 2px crimson, 300ms). Mobile collapses to a full-height overlay menu with large stacked links and the social handle.

### Page Hero
- **Style:** The shared `UiPageHero` block: one Montserrat display `h1`, an optional 6px crimson divider (64px wide, rounded), and an Open Sans subtitle at `text-lg` → `text-xl` in `Slate Grey`. Centered by default; conference pages set it left-aligned and uppercase.
- **Rule:** This is the only place a page-level `h1` lives. No page re-declares its own hero type scale.

### Conference Hero
- **Style:** Full-bleed photograph or generated committee art with a dark scrim (`bg-black/40` plus a vertical gradient), the conference or committee name in white display type, and a metadata row in white label type. The image is the evidence; the type is a caption on it, never a second competing headline.

## Do's and Don'ts

### Do:
- **Do** keep one crimson signal per viewport — the primary CTA, the active pill, or the title divider, not all three at full strength.
- **Do** set the page title once, through `UiPageHero`, in Montserrat display type.
- **Do** keep cards flat with a 1px `Rule Line` border and lift them only on hover (`-translate-y-2` + `shadow-xl`, 300ms).
- **Do** pad cards at 24px and feature cards at 32px.
- **Do** use `#F5F5F5` as the interior-page ground and white for card surfaces.

### Don't:
- **Don't** introduce a new typeface, a second accent hue, or a tinted page background.
- **Don't** use pills for content cards, or zero-radius rectangles for interactive elements.
- **Don't** put a shadow on a static card, or a second `h1` on a page.
- **Don't** use crimson as a large background fill except in the homepage hero and beneath a conference photograph.
- **Don't** set body copy in Montserrat or page titles in Open Sans.
- **Don't** fabricate imagery, rosters, or schedules to fill an empty slot — use the explicit empty state.
