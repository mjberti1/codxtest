# Codec Loop Test

A small static Netlify site for checking video codec compatibility across devices. The page embeds two muted autoplaying videos that loop continuously: one AV1 source and one HEVC source.

## Key Technologies

- Static HTML, CSS, and JavaScript
- Native `<video>` elements with `autoplay`, `muted`, `loop`, and `playsinline`
- Netlify static hosting

## Run Locally

Open `index.html` in a browser, or serve the directory with any static file server. On Netlify, the site deploys as static files with no build step required.
