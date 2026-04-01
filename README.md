# Noobs Cricboard

This is a static single-page application that tracks a cricket match in real time using vanilla JavaScript and Bootstrap. To make the project buildable by JavaScript tooling (e.g. for Coolify), the repository now ships with an npm build pipeline that copies the HTML, `app/`, and `assets/` files into `dist/`.

## Getting started

1. Install dependencies (currently none beyond Node itself):
   ```bash
   npm install
   ```
2. Run the build step, which copies all necessary files into `dist/`:
   ```bash
   npm run build
   ```
3. Serve the `dist/` directory with any static host (Coolify can serve it directly once you point its publish directory to `dist/`).

## Coolify notes

- Set the build command to `npm run build`.
- Point the publish/build directory to `dist/` so Coolify serves the generated static bundle.
