import { log } from "./utils";

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
  if (document.readyState === "complete") {
    log("page already loaded - handling setup.")
    handlePageLoad();
  }
  else {
    log("page not loaded yet - add event listener for load event. document.readyState: ", document.readyState);
    window.addEventListener("load", () => {
      log("window: load event fired.")
      handlePageLoad();
    });
  }
}

// Games with "AI Generated Content Disclosure":
// - Zombie Car Kaiju Killer (and demo)
// - SLAM TANK

const STORE_HOST_NAME = "store.steampowered.com";
const STORE_APP_PATH_REGEX = /^\/(?:agecheck\/)?app\/\d+(?:\/[^/]+)?\/?$/;
const DISCLOSURE_ROOT_SELECTOR = "#game_area_content_descriptors";
const DISCLOSURE_HEADER_TEXT = "AI Generated Content Disclosure";
const SHORTCUT_ID = "ai-content-disclosure-shortcut";
const SHORTCUT_SELECTOR = `#${SHORTCUT_ID}`;

function isStoreAppPage(): boolean {
  const isStorePage = window.location.hostname === STORE_HOST_NAME && 
    STORE_APP_PATH_REGEX.test(window.location.pathname);
  if (!isStorePage) {
    log("Page is not a steam store app page. Ignoring.");
  }
  return isStorePage;
}

let pageLoaded = false;

function registerEventHandlers() {

  addEventListener("popstate", () => {
    log("popState event fired.");
    handleUrlChange();
  });

  addEventListener("hashchange", () => {
    log("hashchange event fired.");
    handleUrlChange();
  });

  if (window.navigation) {
    navigation.addEventListener("navigate", (e) => {
      log("navigate event fired. navigationType: ", e.navigationType);
      
      //handlePageEvent();
    });
  }

  wrapStateMethods();
}

function wrapStateMethods() {
  const origPushState = history.pushState;
  history.pushState = function (...args) {
    const applyResult = Reflect.apply(origPushState, this, args);
    log("pushState called.");
    handleUrlChange();
    return applyResult;
  }

  const origReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const applyResult = Reflect.apply(origReplaceState, this, args);
    log("replaceState called.");
    handleUrlChange();
    return applyResult;
  }
}

function handleUrlChange() {
  if (!pageLoaded) {
    log("handleUrlChange called but the window hasn't finished loading! Returning...");
    return;
  }

  if (!pageAlreadyHasShortcut()) {
    addShortcutToPage();
  }
  else {
    log("The current page already has a shortcut. Ignoring.");
  }
}

function addShortcutToPage() {
  //TODO: actually add button/label shortcut\
  // - tooltip? shortcut icon/image?
  log("shortcut added (not really yet) to page!");
}

function pageHasAiContentDisclosure(): boolean {
  const disclosureRoot = document.querySelector(DISCLOSURE_ROOT_SELECTOR);
  if (!disclosureRoot) {
    log("element with id ", DISCLOSURE_ROOT_SELECTOR, " was not found. AI Content Disclosure not found.");
    return false;
  }

  const foundHeaders = disclosureRoot.querySelectorAll('h2');
  for (let header of foundHeaders) {
    if (header.textContent == DISCLOSURE_HEADER_TEXT)
    {
      log(`${DISCLOSURE_HEADER_TEXT} found.`);
      return true;
    }
  }
  log(`${DISCLOSURE_HEADER_TEXT} not found.`)
  return false;
}

function pageAlreadyHasShortcut(): boolean {
  return document.querySelector(SHORTCUT_SELECTOR) != null;
}

function handlePageLoad() {
  pageLoaded = true;
  if (isStoreAppPage() && pageHasAiContentDisclosure()){
    handleUrlChange();
    registerEventHandlers();
  }
}
