# Master AI image prompt template

This is the canonical prompt scaffold for every illustration in the project. Lock the style here once; never re-derive per image. When you generate a new illustration, fill in the per-image fields and paste the assembled prompt into your image tool of choice (DALL-E, Midjourney, SDXL, Imagen, model-agnostic).

The point of locking the style is consistency. Diffusion models drift across generations. Faces change, line weight wanders, palette slips. The way to fight that is a single style description plus a small set of anchor reference images, used over and over.

---

## Style lock, do not change without reviewing every existing image

```
Storybook illustration in the spirit of David Macaulay's "The Way Things Work" , 
hand-drawn-feeling, warm and approachable, sophisticated rather than juvenile.
Soft cross-hatching for shading. Confident dark-ink linework over gentle warm
washes. Natural paper texture visible underneath. Slightly imperfect, alive,
human-touched.

Palette: warm parchment background (#fdf9f3), dark warm ink (#252220), small
accents of warm orange (#c2410c) and pale yellow. Avoid saturated digital
colors. Avoid sterile vector flatness. Avoid corporate-blue.

Composition: clear focal subject, generous breathing room around it, labels and
pointer lines integrated naturally (handwritten-feeling, not Helvetica). 9:16
or 1:1 aspect ratio depending on placement (specified per image). Optimized
for being viewed inline at ~600-800px wide.

Mood: curious, patient, a little wry. Like a senior coworker drawing on a
napkin to explain something, not a textbook, not a marketing illustration.
```

---

## Character handling, defaults + fallback

**Default attempt: characters when the scene calls for one.**
Stylized people, line-drawing faces, simple hands, expressive postures, no
hyper-realism. Three-quarter views over straight profile. Diverse cast: vary
age, ethnicity, body type, presentation across the project. Keep individual
characters consistent in their reappearances by including a one-line
character-card at the top of every prompt that uses them (see Character cards
below).

**Fallback: if character drift becomes unworkable across generations** (faces
look different from one image to the next, or identifiable people start
showing up), opt out to scene-only / object-driven illustrations. The world
of fed compliance is full of stuff that draws well without people: server
rooms, blueprints on walls, thick binders with tabs, sticky notes, labeled
diagrams, hand-drawn org charts, vintage clipboards, monitors with code on
them, doorways labeled with rooms. Use those instead. The voice carries
enough warmth on its own; the illustrations don't have to.

---

## Character cards, paste at top of any prompt that uses a character

Keep these short, distinctive, and stable. Update them only deliberately;
never improvise.

```
SAM, federal contractor, late 20s, casual button-down, glasses, often
holding a laptop or coffee. Mixed-race, dark hair, slightly skeptical
expression. Wears a lanyard with an unreadable ID badge.

JORDAN, healthcare IT lead, 30s, scrubs visible under a cardigan, stethoscope
draped over shoulder when on the floor. Black hair pulled back, warm brown
skin, calm focused expression.

GARY, private tech engineer, 30s, hoodie + jeans, headphones around neck.
Pale, light brown hair, slightly wry. Almost always at a desk with three
monitors.

TOM, small-business IT, 40s, plaid button-up, beard, often standing up
fixing something. Olive skin, salt-and-pepper hair, patient expression.
Carries a small toolbag.

JAROD, career-changer, early 20s, hoodie + backpack, looking at his phone or
a laptop. Light brown skin, curly hair, bright curious expression.
```

You can swap any of these to match what works for your generations, but lock
them again once you do.

---

## Negative prompt (avoid)

Use these terms in the negative-prompt field if your tool supports it. For
DALL-E and tools without a negative prompt, fold them into the main prompt as
"avoid: ..." or "do not include: ..."

```
photorealistic, 3D render, octane render, hyper-realistic, glossy, plastic,
saturated digital colors, neon, anime, manga, chibi, cartoon network, marvel
style, corporate vector illustration, undraw style, flat geometric, isometric,
pristine perfection, AI-generated look, watermark, signature, text errors,
jumbled letters
```

---

## Per-image prompt scaffold

For each illustration, copy this template and fill in the bracketed fields:

```
[STYLE LOCK, paste from above, unchanged]

[CHARACTER CARDS, paste any cards used in this scene]

SCENE:
[One paragraph describing what's happening. Concrete and visual. "Sam is
sitting at a metal desk in a server room, laptop open, looking puzzled at a
sticky note that's been left on his keyboard. The note reads 'POA&M?' in
handwritten script. Behind him, a rack of servers blinks gently."]

LABELS / TEXT IN IMAGE (if any):
[List any text that should appear, written exactly. Diffusion models are bad
at text, keep labels short, simple words, ideally 1-3 words per label. If
text matters and the model gets it wrong, plan to add the labels in
post-production with SVG overlays.]

ASPECT RATIO: [9:16 vertical | 1:1 square | 16:9 horizontal]
EMOTIONAL BEAT: [puzzled | calm explanation | breakthrough | wry | overwhelmed | etc.]

[NEGATIVE PROMPT, paste from above, unchanged]
```

---

## Reference image strategy

Before generating any chapter illustrations, generate **3-5 anchor images**
that nail the style. These become the visual reference set.

Anchor candidates worth generating first:

1. **A worn manila folder labeled "ATO PACKAGE" sitting on a wooden desk,
   surrounded by smaller papers and a coffee mug.** Tests: paper texture,
   warm palette, hand-lettered labels, object-only composition.
2. **Sam at a desk reading a sticky note.** Tests: character work, expression,
   integration of label-as-prop.
3. **A schematic cross-section of a rack-mounted server with hand-labeled
   parts.** Tests: technical illustration with labels (the Macaulay specialty).
4. **A wall with sticky notes pinned to it, each labeled with an acronym
   (FISMA, NIST, OMB, STIG).** Tests: multiple text labels in one frame, the
   "this is a vocabulary world" mood.
5. **Two characters (Sam + Jordan) at a coffee shop, one explaining
   something on a napkin.** Tests: character consistency across multiple
   characters in one frame.

Once you have ~3 keepers, paste them into your tool as visual references for
every subsequent prompt. Most tools (Midjourney `--cref`, DALL-E reference
upload, ComfyUI IPAdapter) support some form of style-anchoring from prior
images. Use it.

---

## Workflow

1. Write the chapter prose first. Mark the spots where an illustration goes.
2. For each marked spot, fill in the per-image prompt scaffold above.
3. Generate 4-6 candidates per spot. Keep the best one. Re-roll the rest if
   none are right.
4. If a generation looks great EXCEPT for text labels, accept it and add
   labels as SVG overlays in post (the project already uses SVG for diagrams;
   the same workflow handles label overlays).
5. Save the final image to `public/illustrations/<chapter-slug>/<beat-name>.png`.
   Save the final prompt next to it as `<beat-name>.prompt.txt` so future
   regenerations can match the original.
6. Reference in MDX: `![Sam reading a sticky note](/illustrations/fisma/sam-confused.png)`

---

## When to break the lock

The style lock exists to fight drift, not to lock out improvement. If an
illustration needs a different aesthetic (a chapter set in the IC
world might want a darker, more shadowed treatment; a chapter on supply
chain might want a wider, schematic-heavy approach), update this document
first, regenerate the affected anchor images, then continue.

Never silently break the lock for one image. The whole project drifts when
you do.