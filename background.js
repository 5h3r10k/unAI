chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const url = new URL(details.url);

  const isGoogleDomain = url.hostname.startsWith("www.google.") || url.hostname.startsWith("google.");
  if (isGoogleDomain && url.pathname === "/search") {
    // Get the saved settings (defaulting to udm14 and enabled)
    const data = await chrome.storage.local.get({ bypassMode: 'udm14', extensionEnabled: true });

    // Do nothing if the extension is disabled
    if (!data.extensionEnabled) return;

    const mode = data.bypassMode;

    let query = url.searchParams.get("q");
    let needsUpdate = false;

    if (mode === 'minusAI') {
      // If "-ai" isn't there, add it. Also, remove "udm=14" if present.
      if (query && !query.includes("-ai")) {
        url.searchParams.set("q", query + " -ai");
        url.searchParams.delete("udm");
        needsUpdate = true;
      }
    } else if (mode === 'udm14') {
      // If "udm=14" isn't there, add it. Also, remove "-ai" if present.
      let udm = url.searchParams.get("udm");
      if (udm !== "14") {
        url.searchParams.set("udm", "14");
        if (query && query.endsWith(" -ai")) {
          url.searchParams.set("q", query.replace(" -ai", ""));
        }
        needsUpdate = true;
      }
    }

    // Redirect the tab if we made changes
    if (needsUpdate) {
      chrome.tabs.update(details.tabId, { url: url.toString() });
    }
  }
}, { url: [{ hostContains: "google.", pathEquals: "/search" }] });