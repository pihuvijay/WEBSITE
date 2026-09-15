# CLAUDE.md — Pihu Vijaywargiya · Portfolio

This is the durable spec for this project. It is true on turn 1 and turn 50.
Do not put one-off instructions here — those go in chat. When unsure what to do
next, ask which build phase we are in (see BUILD PHASES).

---

## WHAT THIS IS

A personal portfolio website for **Pihu Vijaywargiya — software / solutions engineer**.

The centrepiece is a **scroll-driven animation**: a luxury handbag tips over on
pale stone steps and its contents — six objects — spill down the steps toward the
camera. **Each spilled object is clickable** and scrolls the user to that object's
project section. After the spill, the page scrolls quietly through the six sections.

The bag is the personal frame (feminine, editorial, high-fashion). Every object
that spills out is **technical evidence with a metric attached**. That contrast —
elegant container, rigorous contents — is the whole idea. Keep it.

---

## POSITIONING (the throughline for all copy)

Pihu is a **software / solutions engineer**: technical depth *plus* the ability to
translate it for customers and stakeholders. The headline is not "I can build" —
it is **"I build safety-critical systems AND I can stand in front of the customer."**
Evidence: GE Vernova (translate technical analysis into strategic recommendations
for cross-functional teams), Dotlines (enterprise clients), Noumena (presentations
to business stakeholders), WakeWatch (investor pitch, actuarial stakeholders).

Do NOT frame this as a lifestyle / fashion site. The bag is styling; the substance
is the engineering. No A-level or GCSE content anywhere.

---

## THE SIX OBJECTS → SECTIONS (with the metric that sells each)

Order = order they come to rest down the steps (hero nearest the bag).

1. **Portable charger → GE Vernova / National Grid** — *HERO.* Current role.
   Safety-critical national grid systems. C++, Python, Kubernetes, Linux.
   Real-time infrastructure that is not allowed to fail.
2. **Car keys → WakeWatch** — Founder. ML drowsiness detection, 85%+ accuracy.
   AWS pipeline (S3, DynamoDB, Lambda, Redis), sub-second queries, 70% faster
   dashboards. "Most innovative startup" at university incubator.
3. **Laptop (app UI) → Studio1** — Full-stack (React, Node, TypeScript, SQL).
   500+ users, 10,000+ daily requests, 85% test coverage, 60% faster deploys.
   Promoted to lead 4 engineers.
4. **Coin pouch (coins spilling) → M&A AI system** — RAG on SEC filings,
   transformer models, 80–85% accuracy, 80% reduction in manual analysis time.
5. **Padlock → Noumena** — Cybersecurity. SIEM, blocked 100+ malicious
   accesses/min (Cloudflare, Datadog), CIA triad, stakeholder presentations.
6. **Magazine → Women of Colour feature** — Recognition / identity. The one
   non-project object; a genuine, distinctive credential. Keep it understated.

Tiering for layout: the charger, keys and laptop are the strongest engineering
stories — give them the most prominence. Padlock, coin pouch and magazine are
secondary. Do not add more objects; six is deliberate.

---

## DESIGN SYSTEM

Derived from the moodboard (dark canvas, "Luxury Typography": serif letterforms,
high letter-spacing, gold-foil accents, monochrome palette, editorial mood).

**Colours**
- Background: near-black `#0A0A0A` (alt `#0E0E0E`)
- Primary text / stone: off-white `#F2EFEA`
- Secondary text: warm grey `#9A968F`
- Gold-foil accent (headings, metric numbers, hairlines): `#C9A24B`
  (richer foil = gradient `#B8862F` → `#E6C670`)

**Typography**
- Display / section headings: high-contrast serif (Playfair Display / Canela / Ogg),
  letter-spacing 0.08–0.12em, used sparingly. This carries the identity.
- Body / descriptions: clean neutral sans (Inter / Neue Haas Grotesk), small, quiet.
- **Metric numbers (85%, 500+, 100+/min) render in the serif, in gold.** The hard
  technical numbers ARE the luxury element. This is the signature move.

**Standing design rules (non-negotiable)**
- Restraint. One hero animation (the spill) + clean scroll sections. No effect pile-up.
- Whitespace and slow, calm pacing. Sections breathe.
- Consistency: one type scale, one spacing rhythm, one easing curve everywhere.
- Motion after the spill is QUIET — subtle fades / gentle scroll reveals only.
  The bag is the star; every other section supports it, never competes.

---

## THE SCROLL ANIMATION — TECH APPROACH

Scroll-scrubbed image sequence (the Apple product-page technique):

- **30 sequential frames** exported from the spill render, named
  `frame-01.png … frame-30.png`, in `/frames/`, **1920×1080 (16:9)**.
- A `<canvas>` maps scroll position → frame index and draws the current frame.
  Preload frames; draw on `requestAnimationFrame`, not on every scroll event.
- **Hotspots are invisible SVG/DOM overlays on top of the canvas**, one per object,
  repositioned per frame to track each object as it settles. Do NOT try to make the
  rendered pixels clickable. Hotspots become live once the spill reaches its rest
  frame; clicking one scrolls to that object's section.
- After the animation completes, normal scroll continues into the six sections.

### TOKEN ECONOMY — IMPORTANT
- **Never load the 30 frame images into context.** They are runtime assets the
  browser loads by path. Refer to them in text only (name, count, dimensions).
- Build and debug the mechanic with **placeholder rectangles first**, then swap in
  the real frames last.
- Keep this file short. It is re-read every session; bloat costs tokens every turn.

---

## BUILD PHASES

This project is built in phases. Do the current one only; don't jump ahead.
1. **Skeleton** — sections, navigation, scroll transitions, placeholder content. No
   styling, no real frames. Goal: get the scroll FLOW feeling right.
2. **Style one section** to a high finish; confirm it's loved.
3. **Propagate** that exact treatment to the other sections (consistency by
   propagation, not styling each fresh).
4. **Drop in** the 30 real frames + real project metrics.
5. **Polish** — feel passes (slower scroll, more space, quieter transitions).

---

## REFERENCE SITES (borrow one dimension each, applied through the design system)
- Motion / scroll feel & restraint: dylantombs.com (smooth, paced, restrained).
- Typography / whitespace / editorial serif: [add your chosen site].
- Metric-led project cards (one number per project): [add your chosen site].
Do not clone any one site. The design system above is the throughline that makes
borrowed elements read as one intentional site.

---

## CONTACT / LINKS (fill in confirmed values)
- Name: Pihu Vijaywargiya
- Email: pv425@bath.ac.uk
- LinkedIn: linkedin.com/in/pihuvijay-71524a252
- GitHub: [confirm handle]
- Status: BSc Computer Science, University of Bath (graduating 2028); currently on
  industrial placement at GE Vernova.