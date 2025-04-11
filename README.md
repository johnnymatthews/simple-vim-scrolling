<p align="center">
  <img width="250" height="250" src="https://github.com/user-attachments/assets/5278e4c5-c8d3-4d3b-ab05-e3bc7947bbb3" alt="Alt text for your image">
</p>

<h1 align="center">Vim-Style Page Navigation</h1>

A simple Firefox extension that adds vim-style keyboard navigation to any webpage. Pretty much stripped out all the extra stuff from the _excellent_  [Vimium FF](https://addons.mozilla.org/en-CA/firefox/addon/vimium-ff/) by [Phil Crosby](https://addons.mozilla.org/en-CA/firefox/user/14971172/) and [Stephen Blott](https://addons.mozilla.org/en-CA/firefox/user/12979436/).

![Screenshot From 2025-02-28 15-05-09](https://github.com/user-attachments/assets/1dcb7f68-55cf-4d1e-93da-87afde84ed7f)

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
- Works on all websites

## Installation

### Temporary Installation (for Development)

1. Open Firefox and navigate to `about:debugging`
2. Click **This Firefox** in the sidebar
3. Click **Load Temporary Add-on...**
4. Navigate to the extension directory and select the `manifest.json` file

### Permanent Installation

1. Package the extension by zipping all files
2. Submit the extension to [Firefox Add-ons](https://addons.mozilla.org/developers/)
3. After approval, users can install from the Firefox Add-ons website

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

You can modify the following constants in `page-navigator.js` to customize the scrolling behavior:

- `SCROLL_AMOUNT`: The distance to scroll with each keypress (in pixels)
- `SCROLL_SPEED`: The interval between scroll steps when holding down a key (in milliseconds, lower = faster)

Examples:
- For faster scrolling when holding keys, decrease `SCROLL_SPEED` (default: 10ms)
- For larger scroll steps, increase `SCROLL_AMOUNT` (default: 60px)

## License

MIT
