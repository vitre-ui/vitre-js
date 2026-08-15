# Vitre JS

![Vitre UI](https://vitre-ui.com/images/vitre-ui-dark.webp)

> **This project has merged into [vitre-css](https://www.npmjs.com/package/vitre-css).**
> Vitre CSS and Vitre JS are now a single project, released and versioned together.
> Install `vitre-css` and load `vitre-css/vitre.js` for these same behaviors.
> This package is fixed at 0.4.1 and will receive no further development.

Small behavior helpers for semantic Vitre UI components.

Vitre JS provides optional interactivity for semantic HTML. It does not ship component skinning. Pair it with [Vitre CSS](https://www.npmjs.com/package/vitre-css) when you want the full Vitre UI presentation.

**WARNING**: This is a new library (May 2026) under new development. It is published mostly for testing its own docs and examples from CDNs. You're free to try it, make suggestions, report problems at https://github.com/vitre-ui/vitre-js/issues but it comes **as-is** and **without** any stated or implied warrantees. It is a **best effort** that I made for myself and I'm making it available for everyone to use for free.

## Links

- GitHub repo: https://github.com/vitre-ui/vitre-js
- Documentation: https://docs.vitre-ui.com/
- npmjs.org: https://www.npmjs.com/package/vitre-js
- Vitre CSS: https://www.npmjs.com/package/vitre-css

## Install

```sh
npm install vitre-js
```

Use the browser file:

```html
<link rel="stylesheet" href="https://unpkg.com/vitre-css/vitre.css">
<script type="module" src="https://unpkg.com/vitre-js/vitre.js"></script>
```

For CDN usage, prefer the unversioned unpkg URLs. They resolve to the latest published npm versions quickly while keeping copy/paste usage simple.

Or import the ESM API:

```js
import { Vitre, apply } from "vitre-js";
```

## Alerts

Semantic alert markup:

```html
<div data-kind="alert" data-color="success" role="status" dismiss timeout="6">
  Saved successfully.
</div>
```

Alerts are selected with `data-kind="alert"`. Use named `data-color` values such as `primary`, `info`, `success`, `warning`, and `error` for Vitre CSS styling. Add `role="alert"` or `role="status"` only when live-region behavior is intended. Add `dismiss` for a close button and `timeout` for automatic dismissal. Dismiss controls are generated as right-aligned SVG icon buttons with `data-variant="ghost"` when paired with Vitre CSS.

## Theme Toggle

Use a span with `data-kind="theme-toggle"` to render a light/dark toggle button:

```html
<span data-kind="theme-toggle"></span>
```

The generated button toggles `data-theme="light"` and `data-theme="dark"` on the root `<html>` element and stores the selected theme in local storage.

## Navigation

Use `data-kind="nav"` on a semantic navigation region to add class-free SPA
navigation behavior:

```html
<nav data-kind="nav" aria-label="Primary navigation">
  <a href="/">Home</a>
  <a href="/videos">Videos</a>
</nav>
```

Vitre intercepts same-origin primary clicks, updates browser history, dispatches
a `popstate` event for routers that listen to history changes, and maintains
`aria-current="page"` on the current link. External links, downloads, modified
clicks, and links with `target` other than `_self` use normal browser behavior.

Each intercepted link emits a cancelable `vitre:navigate` event from the clicked
anchor. Applications can call `event.preventDefault()` to hand navigation to a
framework router while still using semantic anchors.

## Splitters

Use `data-kind="splitter"` with `role="separator"` for resizable pane handles:

```html
<div data-kind="splitter" role="separator" aria-orientation="vertical"></div>
```

Vitre JS ensures the handle is focusable and has a default `aria-orientation` when one is not provided. Applications still own the pane sizing behavior.

## API

```js
Vitre.apply();
Vitre.apply(document.querySelector("#dynamic-content"), ["alerts", "theme-toggle"]);
```

`Vitre.apply()` runs automatically on page load for browser script usage. Call it again after inserting dynamic content.

## Development

This repo uses a local pnpm link to the sibling `../vitre-css` checkout during development. Public documentation and examples live in the central Vitre Docs site:

```sh
pnpm install
```
