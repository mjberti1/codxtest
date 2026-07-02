# Project Notes

## Architecture

This is a static Netlify project. The root `index.html` file defines the page structure, `styles.css` contains all presentation styles, and `script.js` handles video playback status detection.

## Key Directories

- `/index.html`: Main codec compatibility test page.
- `/styles.css`: Responsive visual design and video panel styling.
- `/script.js`: Browser-side playback checks for the embedded videos.
- `/netlify.toml`: Netlify static publish configuration with no build command.

## Coding Conventions

- Keep the project dependency-free unless a new feature genuinely requires tooling.
- Preserve the static hosting model; no build step is currently required.
- Use native video attributes for compatibility testing so browser behavior remains visible.

## Non-Obvious Decisions

The video elements are muted and use `playsinline` because many mobile browsers block autoplay unless videos are muted and allowed to play inline. The sources are remote CC0 sample clips so the repository stays small while still exercising different browser codec paths.
