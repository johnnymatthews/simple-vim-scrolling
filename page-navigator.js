/**
 * Vim-Style Page Navigation Firefox Extension
 * 
 * Navigation controls:
 * - j: Scroll down
 * - k: Scroll up
 * - gg: Go to top of page
 * - G: Go to bottom of page
 * - /: Enter link-hint mode, display 2-letter codes for links
 *     (type the code to navigate to that link)
 * - H: Go back in browsing history
 * - L: Go forward in browsing history
 */

// Scroll amount for each j/k press (in pixels)
const SCROLL_AMOUNT = 200;

// To track multi-key sequences (for "gg")
let keySequence = '';
let keySequenceTimer = null;
const KEY_SEQUENCE_TIMEOUT = 1000; // 1 second timeout for key sequence

// Link hint mode variables
let isLinkHintMode = false;
let linkHints = [];
let currentHintCode = '';
const EXCLUDED_CHARS = ['j', 'k', 'g', '/']; // Characters we don't use for hints
const HINT_CHARS = 'abcdefhilmnopqrstuvwxyz12345678'; // Characters we do use

// Main event listener for keyboard input
document.addEventListener('keydown', (event) => {
  // Ignore inputs when focus is on form elements
  if (isUserTyping()) {
    return;
  }
  
  // If in link hint mode, handle differently
  if (isLinkHintMode) {
    handleLinkHintModeKeypress(event);
    return;
  }
  
  // Clear key sequence after timeout
  if (keySequenceTimer) {
    clearTimeout(keySequenceTimer);
  }
  
  keySequenceTimer = setTimeout(() => {
    keySequence = '';
  }, KEY_SEQUENCE_TIMEOUT);
  
  // Add key to sequence
  keySequence += event.key;
  
  // Handle navigation based on key presses
  switch (event.key) {
    case 'j':
      // Scroll down
      window.scrollBy({
        top: SCROLL_AMOUNT,
        behavior: 'smooth'
      });
      break;
      
    case 'k':
      // Scroll up
      window.scrollBy({
        top: -SCROLL_AMOUNT,
        behavior: 'smooth'
      });
      break;
      
    case 'G':
      // Go to bottom of page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      break;
      
    case 'f':
      // Enter link hint mode
      event.preventDefault();
      enterLinkHintMode();
      break;
      
    case 'H':
      // Go back in browsing history
      window.history.back();
      break;
      
    case 'L':
      // Go forward in browsing history
      window.history.forward();
      break;
  }
  
  // Handle the "gg" sequence to go to top of page
  if (keySequence.endsWith('gg')) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    keySequence = '';
  }
});

/**
 * Enter link hint mode - show link hints and prepare for hint selection
 */
function enterLinkHintMode() {
  isLinkHintMode = true;
  currentHintCode = '';
  showLinkHints();
}

/**
 * Display link hints for all links on the page
 */
function showLinkHints() {
  // Clear any existing hints
  clearLinkHints();
  
  // Find all links on the page
  const links = document.querySelectorAll('a');
  
  // Generate hint codes for each link
  const hintCodes = generateHintCodes(links.length);
  
  // Create hint elements for each link
  links.forEach((link, index) => {
    if (isLinkVisible(link)) {
      const hintCode = hintCodes[index];
      createLinkHint(link, hintCode, index);
    }
  });
}

/**
 * Check if a link is visible in the viewport
 */
function isLinkVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Generate 2-character hint codes for links
 */
function generateHintCodes(count) {
  const codes = [];
  const charsLength = HINT_CHARS.length;
  
  // Generate 2-letter codes
  for (let i = 0; i < charsLength; i++) {
    for (let j = 0; j < charsLength; j++) {
      codes.push(HINT_CHARS[i] + HINT_CHARS[j]);
      if (codes.length >= count) {
        return codes;
      }
    }
  }
  
  return codes;
}

/**
 * Create and position a link hint element
 */
function createLinkHint(link, hintCode, index) {
  const rect = link.getBoundingClientRect();
  
  // Create hint element
  const hintElement = document.createElement('div');
  hintElement.textContent = hintCode;
  hintElement.className = 'vim-nav-link-hint';
  hintElement.style.cssText = `
    position: fixed;
    top: ${rect.top - 10}px;
    left: ${rect.left - 10}px;
    background-color: #ffff00;
    color: #000000;
    border: 1px solid #000000;
    padding: 2px 4px;
    font-size: 14px;
    font-weight: bold;
    z-index: 10000;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  `;
  
  document.body.appendChild(hintElement);
  
  // Add to link hints array to keep track
  linkHints.push({
    element: hintElement,
    link: link,
    code: hintCode
  });
}

/**
 * Handle keypresses while in link hint mode
 */
function handleLinkHintModeKeypress(event) {
  // Escape key exits link hint mode
  if (event.key === 'Escape') {
    exitLinkHintMode();
    return;
  }
  
  // Add character to current hint code
  currentHintCode += event.key.toLowerCase();
  
  // Check if the current input matches any hint
  const matchedHint = linkHints.find(hint => hint.code === currentHintCode);
  
  // If we have an exact match, navigate to the link
  if (matchedHint) {
    matchedHint.link.click();
    exitLinkHintMode();
    event.preventDefault();
    return;
  }
  
  // Check if we still have potential matches
  const potentialMatches = linkHints.filter(hint => 
    hint.code.startsWith(currentHintCode)
  );
  
  // If no potential matches, exit hint mode
  if (potentialMatches.length === 0) {
    exitLinkHintMode();
  }
}

/**
 * Exit link hint mode and clean up
 */
function exitLinkHintMode() {
  isLinkHintMode = false;
  currentHintCode = '';
  clearLinkHints();
}

/**
 * Remove all link hint elements from the page
 */
function clearLinkHints() {
  linkHints.forEach(hint => {
    if (hint.element && hint.element.parentNode) {
      hint.element.parentNode.removeChild(hint.element);
    }
  });
  linkHints = [];
}

/**
 * Check if user is currently typing in a form element
 * to avoid intercepting keyboard inputs when typing
 */
function isUserTyping() {
  const activeElement = document.activeElement;
  const inputElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
  const isEditable = activeElement.isContentEditable;
  
  return (
    inputElements.includes(activeElement.tagName) || 
    isEditable
  );
}
