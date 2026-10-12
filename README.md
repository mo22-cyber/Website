# MUP Trading website

A single-page marketing site for MUP Trading, built as plain static files. There is no framework and no build step.

| File | What it is |
|---|---|
| `index.html` | The page: content, meta tags, favicon |
| `styles.css` | All styles, including the CSS logo mark and the animations |
| `main.js` | Mobile menu, scroll reveals and contact form validation |
| `og-image.png` | 1200 × 630 preview image for link sharing |
| `fonts/` | Plus Jakarta Sans, self-hosted (SIL Open Font License, see `fonts/OFL.txt`) |

## Preview locally

Open `index.html` in a browser. To test it the way a host serves it, run a small local server from this folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Placeholders to fill in

Search the project for `[` to find them all.

| Placeholder | Where | What to put |
|---|---|---|
| `[STREET ADDRESS]` | `index.html`, contact section | Street address in Giza |
| `[PHONE NUMBER]` | `index.html`, contact section | Main phone number, ideally as a link: `<a href="tel:+20...">` |
| `[EMAIL ADDRESS]` | `index.html`, contact section, and the message in `main.js` | Inquiry email, ideally as a link: `<a href="mailto:...">` |
| `[SITE URL]` | `index.html`, the `og:url` and `og:image` meta tags | Live domain, e.g. `https://www.example.com` (no trailing slash) |
| Form `action="#"` | `index.html`, the `<form>` tag (see the comment above it) | Your form endpoint. Until it is set, the form validates but does not send, and tells the visitor so. |

### Connecting the contact form

Choose one of these:

- **Formspree** (any host): create a form at formspree.io and set `action="https://formspree.io/f/your-id"`.
- **Netlify Forms**: add `data-netlify="true"` and `name="inquiry"` to the `<form>` tag, then set `action` to a thank-you page such as `/thank-you.html`.
- **Your own server**: point `action` at your script. The fields are posted as `name`, `company`, `email`, `topic` and `message`.

Once `action` is no longer `#`, `main.js` lets valid submissions go through normally.

### Logo

The logo is rebuilt in CSS (`.mark` in `styles.css`), and the favicon is an inline SVG in `index.html`. If you get a vector logo file (`logo.svg`), you can swap it in for the `.mark` element in the header.

## Deploy

All the site needs is the files in this folder.

- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repository with no build command and `/` as the publish directory.
- **GitHub Pages**: push to GitHub, open *Settings → Pages*, choose *Deploy from a branch*, and select the branch with the `/ (root)` folder.
- **Any other host** (cPanel, S3, Cloudflare Pages): upload `index.html`, `styles.css`, `main.js`, `og-image.png` and the `fonts/` folder to the web root.

After deploying, replace `[SITE URL]` so link previews show the image.

## Design, accessibility and motion

- **Look:** clean and professional. The page is near-white, with light teal-grey bands for alternating sections and a deep teal footer. Type is Plus Jakarta Sans, self-hosted from `fonts/`.
- **Colour:** deep teal (`#23626A`) is used for buttons, step numbers and the contact panel. Orange from the logo appears only as small accents: the short rule above each section title and the service markers.
- **Shapes:** one soft radius throughout (8-12px) for buttons, cards, fields and panels.
- **Motion:** kept quiet. The hero fades in on load, sections fade up gently as they scroll into view, and service cards lift slightly on hover.
- **Reduced motion:** all motion is turned off for visitors who set *reduce motion* in their system settings.
- **Without JavaScript:** all content stays visible, and the form falls back to the browser's own required-field checks.
- **Accessibility:**
  - text contrast is at least 4.5:1;
  - keyboard focus is visible;
  - tap targets are at least 44px;
  - the layout is responsive down to 360px wide.
