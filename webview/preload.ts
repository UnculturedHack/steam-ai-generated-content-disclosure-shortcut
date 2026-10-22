/**
 * This preload module is injected into all well known steam urls.
 * - Store
 * - Community
 * - etc
 *
 * It does NOT have access to React, or any other frameworks then the
 * raw DOM.
 *
 * This includes @steamclienthomebrew/millennium as its only made for the Steam
 * Client, not external, insecure pages.
 */

/**
 * This function is called by Millennium once this script has been loaded.
 * This is no guarantee that the DOM or window is.
 *
 * The frontend and backend will be loaded.
 */
export default async function main() {
  // TODO: ensure DOM and/or window are available
  console.info("[ai-disclosure-shortcut] main called", window.location.href);
  console.info("[ai-disclosure-shortcut] isStoreAppPage(): ", isStoreAppPage());
}

const storeHost = "store.steampowered.com";
const storeAppPath = /^\/(?:agecheck\/)?app\/\d+(?:\/[^/]+)?\/?$/;

function isStoreAppPage(): boolean {
  return window.location.hostname === storeHost && storeAppPath.test(window.location.pathname);
}

function registerEventHandlers() {
  
}
