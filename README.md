<p align="center">
  <img width="250" height="250" src="https://github.com/user-attachments/assets/5278e4c5-c8d3-4d3b-ab05-e3bc7947bbb3" alt="Alt text for your image">
</p>

<h1 align="center">Simple Vim Scrolling</h1>

A lightweight Chrome extension that adds vim-style keyboard navigation to any webpage.

## Controls

- `j`: Scroll down
- `k`: Scroll up
- `gg`: Go to top of page
- `G`: Go to bottom of page
- `H`: Go back in browser history
- `L`: Go forward in browser history
- `f`: Enter link-hint mode - displays 2-character codes next to all visible links
  - Type the corresponding 2-character code to navigate to that link
  - Press `Esc` to exit link-hint mode

## Features

- Smooth scrolling for comfortable navigation

- Keyboard shortcuts don't interfere with text input in forms
- Link-hint navigation without using the mouse
- Works on all websites
- No tracking or analytics

## Installation

### From Chrome Web Store (Recommended)

1. Go to the Chrome Web Store page for VimNav (Link TBD)
2. Click "Add to Chrome"
3. Confirm the installation

### Developer Mode Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory containing these files

## Directory Structure

```
vimnav/

│
├── manifest.json        # Extension metadata
├── page-navigator.js    # Main functionality

├── README.md            # Documentation
└── icons/               # Extension icons
    ├── icon-16.png

    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## Customization

You can modify the following constants in `page-navigator.js` to customize the scrolling behavior:

- `SCROLL_AMOUNT`: The distance to scroll with each keypress (in pixels)
- `SCROLL_SPEED`: The interval between scroll steps when holding down a key (in milliseconds, lower = faster)

Examples:

- For faster scrolling when holding keys, decrease `SCROLL_SPEED` (default: 10ms)
- For larger scroll steps, increase `SCROLL_AMOUNT` (default: 60px)
