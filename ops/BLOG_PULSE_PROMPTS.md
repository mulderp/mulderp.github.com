# `thinkingonthinking.com` — Blog Pulse & 4-Planet Prompts Playbook

## 1. Your Blog Identity & 4-Planet Constellation (2012–2026+)

**Origin Story**: `thinking_on thinking` started as a personal note-taking device—inspired by your 2003–2008 correspondence with **Marvin Minsky** (*The Society of Mind*) and meeting **Douglas Hofstadter**, and grown in Munich as an open laboratory for learning JavaScript, software engineering, and hardware in public.

Like Minsky's society of mind, the blog has no single central sun. Instead, its **91 posts** (`51,924` words, average **571 words/post**) orbit **4 Planets**:

1. **Thinking Marvels (`planet: thinking-marvels` · 11 posts · Active Core)**
   - *How humans and machines represent knowledge, build abstractions, and explore ideas together.*
   - Anchors: [RIP Marvin Minsky (`2016-01-26-marvin-minsky-passed-away.md`)](../_posts/2016-01-26-marvin-minsky-passed-away.md), *Keeping ideas simple*, *Learning from a Graph*, *Visual Languages for the Web*.
   - Primary tags for new posts: `ai`, `mind`, `thinking`, `models`, `cognition`, `agents`, `llm`.

2. **Physical Software & Hardware (`planet: physical-software` · 16 posts · Active Orbit)**
   - *Where code meets voltage, timing constraints, and physical matter.*
   - Anchors: *From JavaScript to C*, *I broke the 3d printer*, *Espruino - JavaScript on bare metal*, *Design of break out boards*.
   - Primary tags for new posts: `hardware`, `arduino`, `embedded`, `c`, `iot`, `3d`, `robotics`.

3. **Field Notes, Culture & Chess (`planet: culture-chess` · 13 posts + Chess Seed · Active Orbit)**
   - *Curiosity outside the terminal—Beethoven, contemporary art, books, travel, writing, and chess study (`@chessdiver` on Lichess).*
   - Anchors: *Finding Beethoven on Coursera*, *Voyage en France*, *Modern arts tour in Houston*, *Some thoughts about writing*, plus Chess learnings.
   - Primary tags for new posts: `chess`, `lichess`, `music`, `art`, `books`, `writing`, `travel`, `culture`.

4. **Munich Lab & Tech (`planet: munich-lab` · 51 posts · Completed Orbit, 2012–2016)**
   - *The historical Munich software engineering laboratory: JavaScript (Backbone, Browserify, Node, D3), databases (Neo4j, ArangoDB), infrastructure (Chef, Vagrant, Ruby), and freelance engineering.*

### Local CLI Scanner Usage
```powershell
# Full archive pulse (includes 4-Planet Orbit distribution)
npm --prefix ops run pulse

# Scan a specific post or draft by keyword or path
node ops/blog-pulse.mjs marvin-minsky
node ops/blog-pulse.mjs learning-c
```

---

## 2. Copy-Paste Prompts for New Posts (2026+)

### Prompt 1: First-Pass Blog Post Scanner & Clarity Audit
```markdown
You are an editorial scanner for my personal field-notebook blog "thinking_on thinking" (thinkingonthinking.com).
The blog was inspired by my correspondence with Marvin Minsky (The Society of Mind) and meeting Douglas Hofstadter, and orbits 4 Planets:
1. Thinking Marvels (humans & machines exploring ideas together, mental models, AI, abstractions)
2. Physical Software & Hardware (embedded systems, C, Arduino, electronics, 3D printing)
3. Field Notes, Culture & Chess (chess study/@chessdiver, music, art, books, travel, writing)
4. Munich Lab & Tech (completed 2012–2016 JS/infra archive)

My best posts are 350–700 words, bridge concrete technical/physical/chess details with a bigger mental model, and keep a natural, curious human notebook voice (never corporate or generic AI marketing prose).

Run a **First-Pass Blog Post Scan** on the text below and return a compact report with these 6 sections:

1. **Planet & 1-Sentence Spine**: Which of the active Planets does this belong to (`thinking-marvels`, `physical-software`, or `culture-chess`), and what is the single core thesis or question? If you detect 2–3 competing topics fighting for attention, list them as `[Competing Threads]`.
2. **Clarity vs. Confusion Scorecard (1–5)**:
   - **Hook Speed**: Does the reader know *why to care* within the first 3 sentences?
   - **Single-Thread Focus**: Does it stick to one idea, or drift into unparked tangents?
   - **Signposting & Pacing**: Are transitions visible (headings, short paragraphs), or is there a wall of text?
   - **Concrete Anchors**: Are abstract ideas grounded in a specific command, code snippet, chess position/PGN, book quote, or real-world observation?
3. **Where the Reader Gets Confused (Line-by-Line Friction)**: Quote the exact 1–3 sentences or jumps where a reader without my private context will lose the thread, and explain *why*.
4. **What Sparkles (Keep This Voice!)**: Quote the 1–2 best sentences or observations that sound authentically human and insightful.
5. **Tangent Parking Lot**: List any side-ideas in the draft that should be cut and saved as seeds for *separate* future blog posts.
6. **Minimal-Touch Structural Fix**: Suggest a clean 3–4 point outline (and a stronger opening + closing sentence) that fixes the confusion **without** rewriting my voice into generic AI prose.

---
[PASTE DRAFT OR POST HERE]
```

### Prompt 2: Browser Session Field-Note Harvester ("Open Tabs -> Blog Seed")
```markdown
I am collecting field notes for my blog thinkingonthinking.com ("physical software & thinking marvels").
Below are my raw, messy notes / links / commands / chess positions from my current session.

Do NOT write a full blog post yet. Instead, turn my raw notes into **3 distinct "Blog Seeds"** I can choose from across my active Planets (`thinking-marvels`, `physical-software`, `culture-chess`). For each seed, give me:
- **Planet & Working Title**: Short, specific, curiosity-driven (e.g., "From JavaScript to C", "Keeping ideas simple", "Learning from a Graph").
- **The Spark (1 sentence)**: The concrete surprise, friction, or observation from my notes.
- **The Concrete Artifact**: Which exact snippet, link, command, chess position, or quote from my notes anchors this post.
- **The 3-Step Arc**: A 3-bullet skeleton (`Hook/Friction` -> `Experiment/Observation` -> `Mental Model/Takeaway`) for a 450-word post.
- **1 Clarifying Question for Me**: Ask me one sharp question that will unlock my personal perspective before I draft it.

---
[PASTE RAW SESSION NOTES / LINKS / SNIPPETS HERE]
```

### Prompt 3: Rough Notes -> Jekyll Markdown Draft (`_posts/YYYY-MM-DD-slug.md`)
```markdown
Turn the seed and notes below into a 400–650 word Jekyll blog post for thinkingonthinking.com.

### Style & Structure Rules:
1. **Voice**: Reflective, direct, curious engineer's personal field notebook (like Patrick Mulder's posts on thinkingonthinking.com, inspired by Minsky's Society of Mind). No hype words ("delve", "game-changer", "revolutionize", "in today's fast-paced world").
2. **Structure**:
   - Opening paragraph (2–4 sentences) that states the concrete problem, observation, or contrast immediately.
   - 2 to 4 short signposted sections (`## ...`) with paragraphs under 75 words.
   - At least one concrete anchor (minimal code block, CLI command, chess diagram/link, or specific reference link).
   - Explicitly park any tangents with a one-liner ("That's a topic for another post, but for now...").
   - Closing paragraph that lands on a clear takeaway or open question.
3. **Output Format**: Return valid Jekyll Markdown starting with frontmatter:
---
layout: post
title: <Title>
planet: <thinking-marvels | physical-software | culture-chess>
tags: <space-separated lowercase tags>
---

---
[PASTE SEED + YOUR ANSWER HERE]
```
