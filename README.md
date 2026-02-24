# unAI: Hide Google AI Overviews

> Hide AI Overviews from Google search results for a clean, traditional search experience. Open-source and easy to use.

**unAI** is a lightweight browser extension to hide AI summaries that now appear at the top of Google search results. For the times where you're doing research and don't need half the screen taken up by AI-generated summaries.

## Features

- **Toggle On/Off**: Easily enable or disable the functionality with a simple toggle switch without having to uninstall/disable the extension.
- **Dynamic Refresh**: Auto-prompts you to refresh your search results instantly when you change your settings on an active Google Search tab.
- **Two Blocking Options**: Choose between two distinct methods to hide AI overviews, based on your preference for how search results are filtered. (more below)
- **Open-Source & Secure**: Built with standard extension APIs (`webNavigation`, `tabs`, `storage`) meaning your browsing history remains your own. Clean code, no tracking.
    - `webNavigation`: used to detect when a user navigates to a new page
    - `tabs`: used to get the current tab and to refresh it
    - `storage`: used to store the user's settings

## How it Works: Two Modes

unAI offers two distinct approaches for blocking AI results. You can easily switch between them directly in the extension's popup UI:

### 1. Web Mode (`udm=14`)
This mode forces Google into its classic **"Web" filter** by appending the `udm=14` parameter to your search URL. 
- **What it does:** It completely disables AI overviews and provides a traditional, link-focused search layout. 
- **Best for:** Users who want the old-school, distraction-free list of blue links without extra widgets or AI-generated summaries.

### 2. Append "-ai"
This option automatically appends the modifier `"-ai"` to the end of whatever you type into the search bar.
- **What it does:** It modifies your query (e.g., `how to bake a cake` becomes `how to bake a cake -ai`). This acts as an explicit instruction to Google's search engine to omit AI overviews for that specific query.
- **Best for:** Users who prefer the standard "All" search tab layout (including images, videos, and knowledge panels) but specifically want to exclude the AI summary block.

## Attribution
<a href="https://www.flaticon.com/free-icons/robot" title="robot icons">Robot icons created by Hilmy Abiyyu A. - Flaticon</a>

## Open Source
This project is open-source. Personally not a fan of big data and a big enthusiast of open software/information. I couldn't trust a closed-source extension with access to my browsing history, so I decided to build my own.

In that spirit, feel free to download the unpacked version here and load it yourself via dev mode. Should function identically as there is no extra tracking or telemetry.

If you see anything that can be better, feel free to open an issue or a pull request.

I'll try my best to keep this extension updated if the methods for blocking AI overviews evolve.

Cheers