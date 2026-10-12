# MUP Trading website

A single-page marketing site for MUP Trading, built as plain static files. There is no framework and no build step.

| File | What it is |
|---|---|
| `index.html` | The page: content, meta tags, favicon |
| `styles.css` | All styles, including the CSS logo mark and the animations |
| `main.js` | Mobile menu, service tabs, scroll reveals and contact form validation |
| `og-image.png` | 1200 × 630 preview image for link sharing |
| `fonts/` | Outfit, self-hosted (SIL Open Font License, see `fonts/OFL.txt`) |
| `images/` | Your photos go here (see "Adding photos" below) |

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

## Adding photos

The design has three photo spaces. Until you add photos, each one shows a labelled placeholder such as `[PHOTO: warehouse or distribution, 1600 × 1200]`.

| Photo space | Suggested photo | Size |
|---|---|---|
| Hero, large | Your warehouse, cold chain or delivery fleet | 1600 × 1200 |
| Hero, small | Your products on a pharmacy shelf | 900 × 1100 |
| What we do | Product handling, quality checks or registration work | 1400 × 1000 |

To add one:
1. Put the photo in an `images/` folder.
2. In `index.html`, find the matching `<!-- PHOTO SLOT ... -->` comment.
3. Replace the `<span class="photo__label">…</span>` inside the `<figure>` with the `<img>` line shown in that comment, and write a short `alt` description.
4. Remove `aria-hidden="true"` from that `<figure>`.

Photos are cropped to fit their frames, so any reasonably large landscape (or, for the small hero photo, portrait) image works.

## Deploy

All the site needs is the files in this folder.

- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repository with no build command and `/` as the publish directory.
- **GitHub Pages**: push to GitHub, open *Settings → Pages*, choose *Deploy from a branch*, and select the branch with the `/ (root)` folder.
- **Any other host** (cPanel, S3, Cloudflare Pages): upload `index.html`, `styles.css`, `main.js`, `og-image.png` and the `fonts/` folder to the web root.

After deploying, replace `[SITE URL]` so link previews show the image.

## Design, accessibility and motion

- **Look:** light, professional and premium. The page sits on a cool off-white base and uses Outfit, self-hosted from `fonts/`.
- **Colour:** deep teal (`#1F5C63`) is the one accent, used for buttons, the "Human medicines" tile and the Contact section, the page's single colour block. Orange from the logo appears only in small marks.
- **Shapes:** pill shapes for buttons and tabs, 20px corners for cards and photos, 12px for form fields.
- **Sections, each with its own layout:**
  - a split hero, with the headline beside a two-photo composition and the logo seal;
  - a large editorial statement for "Who we are";
  - a service explorer: pick a service on the left to see it on the right (a plain list without JavaScript);
  - a bento grid of product categories;
  - the process steps beside a sticky heading, with a line that fills as you scroll;
  - three featured company facts above the rest of the register details;
  - the contact form on a teal background.
- **Motion:**
  - the hero arrives in sequence and sections fade up into view;
  - the service panel fades when you switch tabs;
  - the process line follows your scroll, in browsers that support it;
  - cards lift slightly on hover.
- **Reduced motion:** all motion is turned off for visitors who set *reduce motion* in their system settings.
- **Without JavaScript:** all content stays visible, including every service, and the form falls back to the browser's own required-field checks.
- **Accessibility:**
  - text contrast is at least 4.5:1;
  - keyboard focus is visible;
  - the service tabs work with the arrow keys;
  - tap targets are at least 44px;
  - the layout is responsive down to 360px wide.
