document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.querySelectorAll('input[name="bypassMode"]');
  const toggleSwitch = document.getElementById('extension-toggle');
  const modeSection = document.getElementById('mode-section');
  const refreshBtn = document.getElementById('refresh-btn');
  const refreshContainer = document.getElementById('refresh-container');

  /**
   * Updates the disabled state of the refresh button and mode section
   * @param {boolean} isEnabled
   */
  function updateDisabledState(isEnabled) {
    // refreshBtn.disabled = !isEnabled;
    if (isEnabled) {
      modeSection.classList.remove('disabled');
    } else {
      modeSection.classList.add('disabled');
    }
  }

  let currentState = { bypassMode: 'udm14', extensionEnabled: true };
  let initialState = null;

  /**
   * Checks if the given URL is a Google search URL
   * @param {string} urlString 
   * @returns {boolean}
   */
  function isGoogleSearchUrl(urlString) {
    if (!urlString) return false;
    try {
      const url = new URL(urlString);
      const isGoogleDomain = url.hostname.startsWith("www.google.") || url.hostname.startsWith("google.");
      return isGoogleDomain && url.pathname === "/search";
    } catch (e) {
      return false;
    }
  }

  /**
   * Updates the visibility of the refresh button based on the current state
   */
  function updateRefreshButton() {
    if (initialState === null) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const isGoogleSearch = tabs[0] && isGoogleSearchUrl(tabs[0].url);

      if (isGoogleSearch && (currentState.extensionEnabled !== initialState.extensionEnabled ||
        currentState.bypassMode !== initialState.bypassMode)) {
        refreshContainer.classList.add('show');
      } else {
        refreshContainer.classList.remove('show');
      }
    });
  }

  // Load the currently saved mode and toggle state
  chrome.storage.local.get({ bypassMode: 'udm14', extensionEnabled: true }, (result) => {
    currentState = { ...result }; // Copy the result to currentState
    initialState = { ...result }; // Copy the result to initialState

    toggleSwitch.checked = result.extensionEnabled;
    updateDisabledState(result.extensionEnabled);
    const radio = document.getElementById(`mode-${result.bypassMode}`);
    if (radio) radio.checked = true;
  });

  // Save the toggle state when changed
  toggleSwitch.addEventListener('change', (e) => {
    currentState.extensionEnabled = e.target.checked;
    chrome.storage.local.set({ extensionEnabled: currentState.extensionEnabled });
    updateDisabledState(currentState.extensionEnabled);
    updateRefreshButton();
  });

  // Save the new mode when a radio button is clicked
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentState.bypassMode = e.target.value;
      chrome.storage.local.set({ bypassMode: currentState.bypassMode });
      updateRefreshButton();
    });
  });

  // Refresh current search tab
  refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0] && isGoogleSearchUrl(tabs[0].url)) {
        const url = new URL(tabs[0].url);

        const data = await chrome.storage.local.get({ extensionEnabled: true });
        if (!data.extensionEnabled) {
          // if extension is disabled, remove udm=14 and -ai from the query
          let query = url.searchParams.get("q");
          let udm = url.searchParams.get("udm");
          if (udm === "14") {
            url.searchParams.delete("udm");
          }
          if (query && query.endsWith(" -ai")) {
            url.searchParams.set("q", query.replace(" -ai", ""));
          }
          chrome.tabs.update(tabs[0].id, { url: url.toString() });
        } else {
          chrome.tabs.reload(tabs[0].id);
        }
        window.close(); // Close the popup no matter what, once refresh button is clicked
      }
    });
  });
});