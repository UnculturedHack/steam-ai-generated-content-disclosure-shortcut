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

  // TODO: check that DOM and/or window are available

  log("main called", window.location.href);
  registerEventHandlers();
}

const STORE_HOST_NAME = "store.steampowered.com";
const STORE_APP_PATH_REGEX = /^\/(?:agecheck\/)?app\/\d+(?:\/[^/]+)?\/?$/;

function isStoreAppPage(): boolean {
  const isStorePage = window.location.hostname === STORE_HOST_NAME && 
    STORE_APP_PATH_REGEX.test(window.location.pathname);
  log("isStoreAppPage(): ", isStorePage);
  return isStorePage;
}

let currentUrl = location.href;

function registerEventHandlers() {
  addEventListener("popstate", () => {
    log("popState event fired.");
    handlePageEvent();
  });

  addEventListener("hashchange", () => {
    log("hashchange event fired.");
    handlePageEvent();
  });

  if (window.navigation) {
    navigation.addEventListener("navigate", (e) => {
      log("navigate event fired. navigationType: ", e.navigationType);
      handlePageEvent();
    });
  }

  wrapStateMethods();
}

function wrapStateMethods() {
  const origPushState = history.pushState;
  history.pushState = function (...args) {
    const applyResult = Reflect.apply(origPushState, this, args);
    log("pushState called.");
    handlePageEvent();
    return applyResult;
  }

  const origReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const applyResult = Reflect.apply(origReplaceState, this, args);
    log("replaceState called.");
    handlePageEvent();
    return applyResult;
  }
}

function handlePageEvent() {
  currentUrl = location.href;
  if (!currentPageNeedsShortcut()) {
    log("Current page does not need a shortcut added. Ignoring.");
    return;
  }

  addShortcutToPage();
}

function currentPageNeedsShortcut(): boolean {
  if (!isStoreAppPage()) return false;

  //TODO: add real logic that determines whether the current page needs a button or not.
  // - check if it has an Gen AI Disclosure. return false if not.
  // - if it does have a disclosure, check if it already has a shortcut. if it does, return false.
  // - if we've made it this far, the page needs a shortcut. return true.


  return true;
}

function currentUrlChanged(): boolean {
  let urlChanged = currentUrl == location.href;
  log("currentUrlChanged: ", urlChanged);
  return urlChanged;
}

function addShortcutToPage() {
  //TODO: actually add button/label shortcut\
  // - tooltip? shortcut icon/image?
  log("shortcut added to page!");
}
