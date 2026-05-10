
# The CPP Grind

The CPP Grind is a static, learning site for C++: a roadmap, chapter notes, references, and small interactive pages.

This repo is intentionally simple—plain HTML/CSS/JS—so the content is easy to edit and the site can ship on GitHub Pages with no build step.

## What’s in here

- **Roadmap**: a phase-based path through core C++ topics.
- **Articles**: chapter-by-chapter notes (written as I learn, in my own words).
- **References / Resources**: quick lookup + curated links.
- **Games**: small interactive challenges.

## Tech stack

- **HTML** pages under `index.html` and `pages/`
- **CSS** in `css/main.css` (design tokens via CSS variables)
- **JS** in `js/main.js` (nav, theme toggle, local progress state)
- **Data** in `site-data.json` (resource lists, metadata)

## Theme (dark + light)

The site is **dark mode by default**.

There’s also a light theme that keeps the same accent palette but uses a cool off-white background (better contrast for the blues).

- The toggle lives next to the site title in the header.
- User preference is saved in `localStorage` under `theme` (`dark` or `light`).
- If there’s no saved preference, it follows the OS setting (`prefers-color-scheme`).

Theme values are controlled via CSS variables in `css/main.css`:

- `:root` = dark theme tokens
- `[data-theme="light"]` = light theme overrides

## Progress tracking

Some pages use clickable progress markers (elements with the `.progress-check` class). Their state is stored locally in the browser:

- Key format: `progress:<path>:<index>`
- Storage: `localStorage`

No analytics and no server-side tracking.

## Contact form (GitHub Pages compatible)

GitHub Pages can’t run server code, so the contact form is wired to **Formspree**.

To enable it:

1. Create a Formspree form and copy your endpoint URL (looks like `https://formspree.io/f/xxxxxxx`).
2. Open `pages/contact.html` and replace the placeholder:
	- `action="https://formspree.io/f/YOUR_FORM_ID"`

The page submits via `fetch()` and shows inline success/error status.

## Project layout

```text
.
├── index.html
├── pages/              # top-level site pages
├── articles/           # chapter notes/articles (static html)
├── css/
│   └── main.css
├── js/
│   └── main.js
├── images/
├── documentation/
└── site-data.json
```

## Local development

Because it’s a static site, you can open `index.html` directly in a browser.

For fewer CORS/relative-path surprises, a local static server is nicer (any server works). Example options:

- Python: `python3 -m http.server`
- Node: `npx serve`

Then open the printed localhost URL.

## Notes

- This site is a learning journal, not a copy of LearnCpp/Roberts/other resources.
- If something looks wrong in light mode, it usually means a hard-coded color slipped into a page-level `<style>` block. The fix is to convert it to CSS variables.

