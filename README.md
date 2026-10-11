# MUP Trading website

A single-page marketing site for MUP Trading, built as plain static files. There is no framework and no build step.

| File | What it is |
|---|---|
| `index.html` | The page: content, meta tags, favicon |
| `styles.css` | All styles, including the CSS logo mark and the animations |
| `main.js` | Mobile menu, scroll reveals, header state and contact form validation |
| `og-image.png` | 1200 × 630 preview image for link sharing |

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
- **Any other host** (cPanel, S3, Cloudflare Pages): upload `index.html`, `styles.css`, `main.js` and `og-image.png` to the web root.

After deploying, replace `[SITE URL]` so link previews show the image.

## Design, accessibility and motion

- **Look:** dark and premium. The page runs on a deep teal-black base with light bands for the detailed sections, set in Geist and Geist Mono (Google Fonts).
- **Brand colours:** orange is the action colour. Teal and orange also form the logo's corner gradient.
- **On load:** the headline rises in word by word, and the logo emblem springs into place with a slowly turning glow and orbit.
- **On scroll:**
  - sections fade up;
  - the "Who we are" statement brightens line by line (in browsers that support scroll-driven animations);
  - the process line draws across the four steps;
  - the product names scroll in a slow marquee, which pauses on hover.
- **Reduced motion:** all motion is turned off for visitors who set *reduce motion* in their system settings. The marquee then becomes a static list.
- **Without JavaScript:** all content stays visible.
- **Accessibility:**
  - text contrast is at least 4.5:1;
  - keyboard focus is visible;
  - tap targets are at least 44px;
  - the layout is responsive down to 360px wide.
