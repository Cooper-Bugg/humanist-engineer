# The CPP Grind — AI Delegation Guide
# Who does what, and the exact prompts to use

==============================================================
SITE CONTEXT (paste this at the start of every AI session)
==============================================================

I'm building "The CPP Grind" — a C++ learning site deployed on GitHub Pages.
Stack: plain HTML, CSS (CSS variables, dark mode), vanilla JS, no frameworks.
Font: JetBrains Mono (mono) + Instrument Serif (headings/serif).
Color system: --bg #0d0d0d, --accent #e05c2a, --green #4ec994, --blue #5ba3d9, --yellow #e8b84b.
All files live in /thecppgrind/ with subfolders: css/, js/, pages/, articles/.
The site is dark mode only. Code policy: hand-typed source, AI assists docs/structure only.

==============================================================
CLAUDE — Architecture, writing, content, code review
==============================================================

USE CLAUDE FOR:
- Building new pages and components (give it the site context above)
- Writing article content / chapter notes
- Reviewing code for correctness and clarity
- Designing data structures (challenge banks, progress schema)
- Anything requiring reasoning about the learning sequence

PROMPT TEMPLATE — New Page:
---
[Paste site context above]
Build a new page: pages/articles.html
It should list all articles grouped by Roberts chapter (Ch.1–20).
Each article card shows: chapter tag, title, estimated read time, completion status (from localStorage).
Match the existing design system exactly — same header, footer, font, colors.
Output complete HTML file only.
---

PROMPT TEMPLATE — New Article:
---
[Paste site context above]
Write an article for: articles/ch1-overview.html
Topic: Roberts Chapter 1 — Overview of C++ (structure of a program, compilation process, variables, data types, expressions, statements)
Format:
- h1 title (serif font)
- progress checkbox at top (class="progress-check")
- Each major section has h2
- Code examples use .code-block with .spoiler wrapper — NO copy button
- End with a "What's next" section linking to Ch. 2
- Cite learncpp.com and Roberts where relevant
- Tone: honest, learning-in-progress, not expert
---

PROMPT TEMPLATE — Code Component:
---
[Paste site context above]
Build a reusable Godbolt run-button component.
When clicked it opens the code in Compiler Explorer (godbolt.org) with the C++ code pre-filled.
It should be a small button below each .code-block with text "▶ Run on Godbolt".
Add it to js/godbolt.js as a self-contained module.
---

==============================================================
CLAUDE CODE — File creation, GitHub Pages setup, build tasks
==============================================================

USE CLAUDE CODE FOR:
- Setting up the GitHub Pages repo and _config.yml
- Creating file structures, renaming, moving files
- Running build checks or link validators
- Git operations

PROMPT TEMPLATE — GitHub Pages Setup:
---
Set up this repo for GitHub Pages deployment.
The repo is: github.com/Cooper-Bugg/thecppgrind (or chosen name)
- Create a .github/workflows/deploy.yml that deploys from main branch
- The root index.html is the homepage
- No Jekyll, no build step — static HTML only
- Add a 404.html page matching the site design
---

PROMPT TEMPLATE — File Scaffold:
---
Create this file structure for The CPP Grind site:
thecppgrind/
  index.html (exists)
  css/main.css (exists)
  js/main.js (exists)
  pages/
    articles.html
    roadmap.html
    projects.html
    games.html (exists)
    resources.html
    about.html
    contact.html
  articles/
    ch1-overview.html
  images/
    (empty, placeholder README)
Create all missing files as stubs with the correct header/footer from index.html.
---

==============================================================
GEMINI — Research, link checking, competitor analysis
==============================================================

USE GEMINI FOR:
- Browsing URLs you want to reference or cite
- Checking what LearnCpp covers in specific chapters
- Researching what CppQuiz questions exist on a topic
- Verifying links still work
- Comparing your site to competitors

PROMPT TEMPLATE — Chapter Research:
---
Go to https://www.learncpp.com and find all chapters/sections covering:
[topic, e.g. "pointers and references"]
List the section numbers, titles, and URLs.
I want to cite these correctly on my C++ learning site.
---

PROMPT TEMPLATE — Link Audit:
---
Check these URLs are still live and summarize what each page covers in 1-2 sentences:
- https://exercism.org/tracks/cpp/concepts
- https://cppquiz.org
- https://godbolt.org
- https://cppreference.com
I'll use these as cited resources on my site.
---

PROMPT TEMPLATE — Competitor Analysis:
---
Visit https://www.learncpp.com and https://www.codecademy.com/learn/learn-c-plus-plus
Describe:
1. How they structure their navigation
2. How they display code examples
3. What interactive features they have
4. What they're missing that a learner would want
I'm building a competitor/complement site and want to differentiate.
---

==============================================================
CHATGPT — Alternative explanations, second opinions, writing polish
==============================================================

USE CHATGPT FOR:
- Getting a second explanation of a concept when Roberts isn't clicking
- Polishing article prose for clarity
- Generating additional code challenge questions
- Brainstorming article titles and descriptions

PROMPT TEMPLATE — Second Explanation:
---
Explain [concept] as if explaining to someone who just read about it in a textbook
but didn't fully understand it. Use a different analogy than the textbook would use.
Keep it under 200 words. No code needed — just the mental model.
Concept: [e.g. "why pointers and references are different in C++"]
---

PROMPT TEMPLATE — Generate Quiz Questions:
---
Generate 5 C++ daily code challenge questions in this exact JSON format:
{
  "code": "the C++ code snippet (use \\n for newlines)",
  "question": "What does this print? / Will this compile? / etc.",
  "options": ["option A", "option B", "option C", "option D"],
  "answer": 0,  // index of correct option
  "explanation": "why the answer is correct, what the concept is",
  "type": "output | compile | overflow | crash | gotcha"
}

Topic: [e.g. "undefined behavior with uninitialized variables"]
Difficulty: beginner
Make sure the code is valid C++17 and the explanation is clear.
---

PROMPT TEMPLATE — Article Polish:
---
Polish this article section for clarity. Keep the tone honest and learning-in-progress
(not expert). Keep technical accuracy. Shorten where possible without losing meaning.
Target audience: someone learning C++ for the first time.

[paste your draft section]
---

==============================================================
DIVISION OF LABOR SUMMARY
==============================================================

Claude:       Architecture + writing + components + articles
Claude Code:  File ops + GitHub Pages + deployment
Gemini:       Research + link checking + competitor URLs
ChatGPT:      Alt explanations + quiz generation + prose polish

You (Cooper): Roberts reading → write raw notes → paste to Claude for article format
              Exercism solutions → paste to Claude Code for repo commit
              New concept → ask ChatGPT for different angle if stuck
              Cite a resource → ask Gemini to verify the URL first

==============================================================
PROGRESS TRACKING SCHEMA (for reference)
==============================================================

localStorage keys used by the site:
  cookie-ok                     → "1" if user accepted notice
  wordle:{seed}                 → JSON {guessCount, gameOver, keyState}
  challenge:{seed}              → JSON {chose, correct}
  streak:wordle                 → number
  streak:wordle:last            → seed of last day played
  streak:wordle:best            → best streak
  streak:challenge              → number
  streak:challenge:last         → seed
  streak:challenge:best         → best streak
  progress:{pathname}:{index}   → "1" if checkbox checked

To clear all progress: localStorage.clear() in browser console.
Warn users: clearing browser data / private mode loses all progress.
