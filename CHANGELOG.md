# Changelog

## 0.4.1 - 2026-08-15

- Fixed a duplicate `COMPONENTS` declaration in `src/vitre.js` that made the ESM entry point fail to parse for npm and bundler consumers. The browser/CDN file was unaffected.
- vitre-js has merged into the `vitre-css` package. This is a fix-only release; further development continues there as `vitre-css` 1.6.0 and later, where the behavior helpers ship as `vitre-css/vitre.js`.

## 0.4.0 - 2026-06-15

- Added `data-kind="nav"` behavior for class-free same-origin SPA navigation.
- Navigation helpers now dispatch cancelable `vitre:navigate` events, update history, and maintain `aria-current="page"` on current links.

## 0.3.5 - 2026-05-08

- Added a version and license banner to the package entry files.
- Added a `data-kind="theme-toggle"` component that renders a light/dark toggle button and persists the selected theme.

## 0.3.4 - 2026-05-08

- Removed stale package-local Pages documentation references after moving public docs and examples to the central Vitre Docs site.

## 0.3.3 - 2026-05-07

- Updated CDN examples and docs pages to use unversioned unpkg URLs for faster latest-version resolution.
- Pointed package documentation links at the central Vitre Docs site.

## 0.3.2 - 2026-05-07

- Updated CDN examples and docs pages to use explicit `@latest` Vitre package URLs.

## 0.3.1 - 2026-05-07

- Updated repository and documentation links for the move to the `vitre-ui` GitHub organization.
- Hid dismissible alerts during close-button injection so enhancement is presented after the final alert structure is ready.

## 0.3.0 - 2026-05-07

- Replaced role-based alert discovery with `[data-kind="alert"]`.

## 0.2.2 - 2026-05-07

- Added alert behavior for `[data-kind="alert"]` using short `dismiss` and `timeout` attributes.
- Removed the custom element alert approach before first release.
- Replaced separate public behavior functions with `Vitre.apply(root, components)`.
- Generated right-aligned alert dismiss controls with SVG icons and `data-variant="ghost"`.
- Added GitHub Pages docs and a kitchen sink example under `docs/`, paired with versioned CDN assets for static hosting.
- Switched the development `vitre-css` dependency to a pnpm `link:../vitre-css` dependency and removed the npm lockfile.
- Added a tag-triggered GitHub Actions release workflow using npm Trusted Publishing.

## 0.1.0 - 2026-05-06

- Published initial empty package.
