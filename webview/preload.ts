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
  if (document.readyState != "loading") {
    handlePageLoad();
  }
  else {
    document.addEventListener("DOMContentLoaded", () => {
      handlePageLoad();
    });
  }
}

const STORE_HOST_NAME = "store.steampowered.com";
const STORE_APP_PATH_REGEX = /^\/(?:agecheck\/)?app\/\d+(?:\/[^/]+)?\/?$/;

const APP_DESCRIPTION_COLUMN_SELECTOR = ".leftcol.game_description_column";
const DISCLOSURE_HEADER_TEXT = "AI Generated Content Disclosure";
const DISCLOSURE_HEADER_ID = "aiContDisclosureHeader";
let disclosureHeaderIdHref: string | null = null;

const SHORTCUT_LINK_ID = "aiDisclosureSc";
const SHORTCUT_PARENT_SELECTOR = ".glance_ctn_responsive_left";

const TOOLTIP_TEXT = "This app has an AI Generated Content Disclosure. Click to see it.";

function isStoreAppPage(): boolean {
  const isStorePage = window.location.hostname === STORE_HOST_NAME && 
    STORE_APP_PATH_REGEX.test(window.location.pathname);
  if (!isStorePage) {
    log("Page is not a steam store app page. Ignoring.");
  }
  return isStorePage;
}

function handleHashChangeEvent() {
  if (window.location.href.endsWith(DISCLOSURE_HEADER_ID)) {
    // scroll down slightly to avoid navbar overlap
    window.scrollBy(0, -50);
  }

  addShortcutIfDne();
}

function addShortcutIfDne() {
  if (shortcutAlreadyExists()) {
    log("The current page already has a shortcut. Shortcut not added.");
    return;
  }
  
  if (!disclosureHeaderIdHref) {
    log("disclosureHeaderIdHref was null. Shortcut not added.");
    return;
  }
  
  const shortcut = document.createElement("a");
  shortcut.href = disclosureHeaderIdHref;
  shortcut.id = SHORTCUT_LINK_ID;
  shortcut.dataset.tooltipHtml = TOOLTIP_TEXT;
  shortcut.textContent = DISCLOSURE_HEADER_TEXT;

  const ctn = document.createElement("div");
  ctn.style.display = "flex";
  ctn.style.paddingTop = "20px";
  ctn.appendChild(shortcut);

  const shortcutParent = document.querySelector(SHORTCUT_PARENT_SELECTOR);
  if (!shortcutParent) {
    log("Failed to find element with class: ", SHORTCUT_PARENT_SELECTOR, ". Shortcut not added.");
    return;
  }

  shortcutParent.appendChild(ctn);
  log("shortcut added to page!");
}

function pageHasAiContentDisclosure(): boolean {
  const appDescrCol = document.querySelector(APP_DESCRIPTION_COLUMN_SELECTOR);
  if (!appDescrCol) {
    log(`element with selector ${APP_DESCRIPTION_COLUMN_SELECTOR} was not found. ${DISCLOSURE_HEADER_TEXT} not found.`);
    return false;
  }

  const foundHeaders = appDescrCol.querySelectorAll('h2');
  for (let header of foundHeaders) {
    if (header.textContent?.trim() === DISCLOSURE_HEADER_TEXT)
    {
      if (header.id) {
        disclosureHeaderIdHref = `#${header.id}`;
      }
      else {
        header.id = DISCLOSURE_HEADER_ID;
        disclosureHeaderIdHref = `#${DISCLOSURE_HEADER_ID}`;
      }

      log(`${DISCLOSURE_HEADER_TEXT} found.`);
      return true;
    }
  }
  log(`${DISCLOSURE_HEADER_TEXT} not found.`)
  return false;
}

function shortcutAlreadyExists(): boolean {
  return document.getElementById(SHORTCUT_LINK_ID) != null;
}

function handlePageLoad() {
  if (isStoreAppPage() && pageHasAiContentDisclosure()){
    addShortcutIfDne();
    addEventListener("hashchange", handleHashChangeEvent);
  }
}

function log(...args: any[]) {
  window.console.log('[AI-Disclosures-Shortcut]', ...args);
}
