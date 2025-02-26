# Simple Vim Scrolling

A simple Firefox extension that adds vim-style keyboard navigation to any webpage. Pretty much stripped out all the extra stuff from the _excellent_  [Vimium FF](https://addons.mozilla.org/en-CA/firefox/addon/vimium-ff/) by [Phil Crosby](https://addons.mozilla.org/en-CA/firefox/user/14971172/) and [Stephen Blott](https://addons.mozilla.org/en-CA/firefox/user/12979436/).

## Controls

- `j`: Scroll down
- `k`: Scroll up
- `gg`: Go to top of page
- `G`: Go to bottom of page
- `H`: Go back in browser history
- `L`: Go forward in browser history
- `/`: Enter link-hint mode - displays 2-character codes next to all visible links
  - Type the corresponding 2-character code to navigate to that link
  - Press `Esc` to exit link-hint mode
  - If you're on a website that binds `/` to something (like GitHub.com), you can use `CTRL` + `/` instead.

## Features

- Smooth scrolling for comfortable navigation.
- Keyboard shortcuts don't interfere with text input in forms.
- Works on all websites.
- Incredibly small and focused feature-set.

## Temporary installation (for development)

1. Open Firefox and navigate to `about:debugging`.
2. Click **This Firefox** in the sidebar.
3. Click **Load Temporary Add-on...**.
4. Navigate to the extension directory and select the `manifest.json` file.

## Directory Structure

```
vim-style-navigation/
│
├── manifest.json        # Extension metadata
├── page-navigator.js    # Main functionality
├── README.md            # Documentation
└── icons/               # Extension icons
    ├── icon-48.png
    └── icon-96.png
```

## Customization

You can modify the `SCROLL_AMOUNT` constant in `page-navigator.js` to change how far each keypress scrolls the page.
