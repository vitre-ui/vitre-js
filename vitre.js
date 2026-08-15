/*!
 * Vitre JS v0.4.1
 * Styleless behavior helpers for semantic Vitre UI components.
 * MIT License
 */

const ALERT_SELECTOR = '[data-kind="alert"]';
const NAV_SELECTOR = 'nav[data-kind="nav"],[data-kind="nav"] nav,[data-kind="nav"][role="navigation"]';
const THEME_TOGGLE_SELECTOR = '[data-kind="theme-toggle"]';
const SPLITTER_SELECTOR = '[data-kind="splitter"][role="separator"]';
const CONTENT_SELECTOR = '[data-v-content]';
const CLOSE_SELECTOR = '[data-v-close]';
const THEME_BUTTON_SELECTOR = '[data-v-theme-toggle]';
const ENHANCED = 'vEnhanced';
const STYLE_ID = 'vitre-js-alert-styles';
const COMPONENTS = ['alerts', 'nav', 'splitters', 'theme-toggle'];
const THEME_STORAGE_KEY = 'vitre-theme';
const THEME_ICON = '<svg viewBox="0 0 512 512" fill="currentColor" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="overflow: visible;"><path fill="currentColor" d="M448 256c0-106-86-192-192-192v384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0z"></path></svg>';

function ensureAlertStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = [
    '[data-kind="alert"][data-v-enhancing="true"]{visibility:hidden}',
    '[data-kind="alert"][data-v-enhancing="true"],[data-kind="alert"][data-v-enhanced="true"]:has(>[data-v-close]){display:flex;align-items:center;gap:var(--vitre-space-3,0.75rem)}',
    '[data-kind="alert"][data-v-enhancing="true"]::after{content:"";display:block;margin-inline-start:auto;flex:0 0 auto;inline-size:2rem;block-size:2rem}',
    '[data-kind="alert"][data-v-enhanced="true"]>[data-v-content]{flex:1 1 auto}',
    '[data-kind="alert"][data-v-enhanced="true"]>[data-v-close]{margin-inline-start:auto;flex:0 0 auto;inline-size:2rem;block-size:2rem;min-block-size:2rem;padding:0;color:currentColor}',
    '[data-kind="alert"][data-v-enhanced="true"]>[data-v-close] svg{inline-size:1.125rem;block-size:1.125rem;overflow:visible}',
    '[data-v-theme-toggle] svg{inline-size:1.125rem;block-size:1.125rem;overflow:visible}'
  ].join('');
  document.head.append(style);
}

function parseSeconds(value) {
  if (value == null || value === '') {
    return null;
  }

  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

function getTimeout(element) {
  return parseSeconds(element.getAttribute('timeout'));
}

function isDismissible(element) {
  return element.hasAttribute('dismiss');
}

function dismiss(element) {
  element.dispatchEvent(new CustomEvent('vitre:dismiss', {
    bubbles: true,
    detail: { source: element }
  }));

  element.remove();
}

function ensureAlertContent(element) {
  const existing = element.querySelector(`:scope > ${CONTENT_SELECTOR}`);
  if (existing) {
    return existing;
  }

  const content = document.createElement('span');
  content.setAttribute('data-v-content', '');

  for (const child of [...element.childNodes]) {
    if (child.nodeType === Node.ELEMENT_NODE && child.matches(CLOSE_SELECTOR)) {
      continue;
    }

    content.append(child);
  }

  element.prepend(content);
  return content;
}

function ensureCloseButton(element) {
  ensureAlertContent(element);

  const existing = element.querySelector(`:scope > ${CLOSE_SELECTOR}`);
  if (existing) {
    return existing;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-v-close', '');
  button.setAttribute('data-variant', 'ghost');
  button.setAttribute('aria-label', 'Dismiss');
  button.innerHTML = '<svg viewBox="0 0 384 512" fill="currentColor" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="overflow: visible;"><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l137.3-137.4 137.4 137.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256l137.3-137.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg>';
  element.append(button);
  return button;
}

function enhanceAlert(element) {
  if (element.dataset[ENHANCED] === 'true') {
    return element;
  }

  if (isDismissible(element)) {
    element.dataset.vEnhancing = 'true';
    const close = ensureCloseButton(element);
    close.addEventListener('click', () => dismiss(element));
    delete element.dataset.vEnhancing;
  }

  const seconds = getTimeout(element);
  if (seconds) {
    window.setTimeout(() => {
      if (element.isConnected) {
        dismiss(element);
      }
    }, seconds * 1000);
  }

  element.dataset[ENHANCED] = 'true';
  return element;
}

function applyAlerts(root = document) {
  const scope = root instanceof Element || root instanceof Document || root instanceof DocumentFragment
    ? root
    : document;

  const elements = [];

  if (scope instanceof Element && scope.matches(ALERT_SELECTOR)) {
    elements.push(scope);
  }

  elements.push(...scope.querySelectorAll(ALERT_SELECTOR));
  return elements.map(enhanceAlert);
}

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentTheme() {
  return document.documentElement.dataset.theme || getSystemTheme();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  try {
    window.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors in restricted browsing contexts.
  }
}

function restoreStoredTheme() {
  try {
    const stored = window.localStorage?.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    }
  } catch {
    // Ignore storage errors in restricted browsing contexts.
  }
}

function updateThemeButton(button) {
  const theme = getCurrentTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  button.setAttribute('aria-label', `Switch to ${next} theme`);
  button.setAttribute('title', `Switch to ${next} theme`);
  button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function ensureThemeButton(element) {
  const existing = element.querySelector(`:scope > ${THEME_BUTTON_SELECTOR}`);
  if (existing) {
    return existing;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-v-theme-toggle', '');
  button.setAttribute('data-variant', 'ghost');
  button.innerHTML = THEME_ICON;
  element.append(button);
  return button;
}

function enhanceThemeToggle(element) {
  if (element.dataset[ENHANCED] === 'true') {
    return element;
  }

  const button = ensureThemeButton(element);
  updateThemeButton(button);
  button.addEventListener('click', () => {
    setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
    updateThemeButton(button);
  });

  element.dataset[ENHANCED] = 'true';
  return element;
}

function applyThemeToggles(root = document) {
  const scope = root instanceof Element || root instanceof Document || root instanceof DocumentFragment
    ? root
    : document;

  const elements = [];

  if (scope instanceof Element && scope.matches(THEME_TOGGLE_SELECTOR)) {
    elements.push(scope);
  }

  elements.push(...scope.querySelectorAll(THEME_TOGGLE_SELECTOR));
  return elements.map(enhanceThemeToggle);
}

function enhanceSplitter(element) {
  if (element.dataset[ENHANCED] === 'true') {
    return element;
  }

  if (!element.hasAttribute('tabindex')) {
    element.tabIndex = 0;
  }

  if (!element.hasAttribute('aria-orientation')) {
    element.setAttribute('aria-orientation', 'vertical');
  }

  element.dataset[ENHANCED] = 'true';
  return element;
}

function applySplitters(root = document) {
  const scope = root instanceof Element || root instanceof Document || root instanceof DocumentFragment
    ? root
    : document;

  const elements = [];

  if (scope instanceof Element && scope.matches(SPLITTER_SELECTOR)) {
    elements.push(scope);
  }

  elements.push(...scope.querySelectorAll(SPLITTER_SELECTOR));
  return elements.map(enhanceSplitter);
}

function getLinkUrl(anchor) {
  try {
    return new URL(anchor.getAttribute('href') || '', window.location.href);
  } catch {
    return null;
  }
}

function isPlainPrimaryClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function isRoutableAnchor(anchor) {
  const target = anchor.getAttribute('target');
  const download = anchor.hasAttribute('download');
  const rel = anchor.getAttribute('rel') || '';
  const url = getLinkUrl(anchor);

  return Boolean(
    url &&
    url.origin === window.location.origin &&
    !download &&
    (!target || target === '_self') &&
    !rel.split(/\s+/).includes('external')
  );
}

function getNavigationPath(url) {
  return `${url.pathname}${url.search}${url.hash}`;
}

function isCurrentUrl(url) {
  return (
    url.origin === window.location.origin &&
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    url.hash === window.location.hash
  );
}

function setCurrentLinks(nav) {
  for (const anchor of nav.querySelectorAll('a[href]')) {
    const url = getLinkUrl(anchor);
    const current = url && url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search;

    if (current && (!url.hash || url.hash === window.location.hash)) {
      anchor.setAttribute('aria-current', 'page');
    } else {
      anchor.removeAttribute('aria-current');
    }
  }
}

function scrollToHash(hash) {
  if (!hash) {
    window.scrollTo?.({ top: 0 });
    return;
  }

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`);
  target?.scrollIntoView();
}

function navigate(url, anchor, originalEvent) {
  const detail = {
    anchor,
    event: originalEvent,
    href: anchor.getAttribute('href') || '',
    path: getNavigationPath(url),
    url
  };

  const event = new CustomEvent('vitre:navigate', {
    bubbles: true,
    cancelable: true,
    detail
  });

  anchor.dispatchEvent(event);

  if (event.defaultPrevented) {
    return;
  }

  if (!isCurrentUrl(url)) {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
  }

  scrollToHash(url.hash);
  document.querySelectorAll(NAV_SELECTOR).forEach(setCurrentLinks);
}

function enhanceNav(nav) {
  if (nav.dataset[ENHANCED] === 'true') {
    return nav;
  }

  nav.addEventListener('click', (event) => {
    if (!isPlainPrimaryClick(event)) {
      return;
    }

    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor || !nav.contains(anchor) || !isRoutableAnchor(anchor)) {
      return;
    }

    const url = getLinkUrl(anchor);
    if (!url) {
      return;
    }

    event.preventDefault();
    navigate(url, anchor, event);
  });

  window.addEventListener('popstate', () => setCurrentLinks(nav));
  setCurrentLinks(nav);
  nav.dataset[ENHANCED] = 'true';
  return nav;
}

function applyNavs(root = document) {
  const scope = root instanceof Element || root instanceof Document || root instanceof DocumentFragment
    ? root
    : document;

  const elements = [];

  if (scope instanceof Element && scope.matches(NAV_SELECTOR)) {
    elements.push(scope);
  }

  elements.push(...scope.querySelectorAll(NAV_SELECTOR));
  return elements.map(enhanceNav);
}

export function apply(root = document, components = COMPONENTS) {
  const selected = Array.isArray(components) ? components : [components];
  const results = {};

  if (selected.includes('alerts')) {
    results.alerts = applyAlerts(root);
  }

  if (selected.includes('nav') || selected.includes('navigation')) {
    results.nav = applyNavs(root);
  }

  if (selected.includes('theme-toggle') || selected.includes('theme')) {
    results.themeToggle = applyThemeToggles(root);
  }

  if (selected.includes('splitters') || selected.includes('splitter')) {
    results.splitters = applySplitters(root);
  }

  return results;
}

export const Vitre = {
  apply
};

if (typeof window !== 'undefined') {
  window.Vitre = Vitre;
  ensureAlertStyles();
  restoreStoredTheme();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply());
  } else {
    apply();
  }
}
