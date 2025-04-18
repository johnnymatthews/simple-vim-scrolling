/**
 * Vim-Style Page Navigation Firefox Extension
 * 
 * Navigation controls:
 * - j: Scroll down
 * - k: Scroll up
 * - gg: Go to top of page
 * - G: Go to bottom of page
 * - f: Enter link-hint mode, display 2-letter codes for links
 *     (type the code to navigate to that link)
 * - H: Go back in browsing history
 * - L: Go forward in browsing history
 */

// Scroll amount for each j/k press (in pixels)
const SCROLL_AMOUNT = 60;

// To track multi-key sequences (for "gg")
let keySequence = '';
let keySequenceTimer = null;
const KEY_SEQUENCE_TIMEOUT = 1000; // 1 second timeout for key sequence

// Continuous scrolling support
let isScrolling = false;
let scrollDirection = 0;
let scrollInterval = null;
const SCROLL_SPEED = 10; // Lower is faster (milliseconds between scroll steps)

// Link hint mode variables
let isLinkHintMode = false;
let linkHints = [];
let currentHintCode = '';
const EXCLUDED_CHARS = ['j', 'k', 'g', 'f']; // Characters we don't use for hints
const HINT_CHARS = 'abcdehilmnopqrstuvwxyz12345678'; // Characters we do use

// Function to start continuous scrolling
function startContinuousScroll(direction) {
  // Clear any existing interval
  if (scrollInterval) {
    clearInterval(scrollInterval);
  }
  
  // Set scrolling state
  isScrolling = true;
  scrollDirection = direction;
  
  // Start interval for continuous scrolling
  scrollInterval = setInterval(() => {
    window.scrollBy({
      top: SCROLL_AMOUNT * direction,
      behavior: 'auto' // Use 'auto' for continuous scrolling to be more responsive
    });
  }, SCROLL_SPEED);
}

// Function to stop continuous scrolling
function stopContinuousScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  isScrolling = false;
  scrollDirection = 0;
}

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
        behavior: 'auto' // Changed to 'auto' for faster initial response
      });
      
      // Start continuous scrolling if key is held down
      if (!isScrolling || scrollDirection !== 1) {
        startContinuousScroll(1); // 1 for down
      }
      break;
      
    case 'k':
      // Scroll up
      window.scrollBy({
        top: -SCROLL_AMOUNT,
        behavior: 'auto' // Changed to 'auto' for faster initial response
      });
      
      // Start continuous scrolling if key is held down
      if (!isScrolling || scrollDirection !== -1) {
        startContinuousScroll(-1); // -1 for up
      }
      break;
      
    case 'G':
      // Go to bottom of page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'auto'
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
 * Display link hints for all clickable elements on the page
 */
function showLinkHints() {
  // Clear any existing hints
  clearLinkHints();
  
  // Find all clickable elements on the page
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');
  const inputs = document.querySelectorAll('input:not([type="button"]):not([type="submit"]), textarea, select');
  
  // Count visible elements to generate enough codes
  const visibleElements = [];
  
  // Collect visible links
  links.forEach(link => {
    if (isElementVisible(link)) {
      visibleElements.push({
        element: link,
        type: 'link'
      });
    }
  });
  
  // Collect visible buttons
  buttons.forEach(button => {
    if (isElementVisible(button)) {
      visibleElements.push({
        element: button,
        type: 'button'
      });
    }
  });
  
  // Collect visible inputs
  inputs.forEach(input => {
    if (isElementVisible(input)) {
      visibleElements.push({
        element: input,
        type: 'input'
      });
    }
  });
  
  // Generate hint codes for all visible elements
  const hintCodes = generateHintCodes(visibleElements.length);
  
  // Create hint elements for each clickable element
  visibleElements.forEach((item, index) => {
    const hintCode = hintCodes[index];
    createLinkHint(item.element, hintCode, index, item.type);
  });
}

/**
 * Check if an element is visible in the viewport
 */
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    getComputedStyle(element).display !== 'none' &&
    getComputedStyle(element).visibility !== 'hidden' &&
    element.offsetParent !== null
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
function createLinkHint(element, hintCode, index, type) {
  const rect = element.getBoundingClientRect();
  
  // Create hint element
  const hintElement = document.createElement('div');
  hintElement.textContent = hintCode;
  hintElement.className = 'vim-nav-link-hint';
  
  // Style based on element type
  let bgColor = '#ffff00'; // Default yellow for links
  if (type === 'button') {
    bgColor = '#ffa500'; // Orange for buttons
  } else if (type === 'input') {
    bgColor = '#90ee90'; // Light green for input elements
  }
  
  hintElement.style.cssText = `
    position: fixed;
    top: ${rect.top - 10}px;
    left: ${rect.left - 10}px;
    background-color: ${bgColor};
    color: #000000;
    border: 1px solid #000000;
    padding: 2px 4px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10000;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  `;
  
  document.body.appendChild(hintElement);
  
  // Add to link hints array to keep track
  linkHints.push({
    element: hintElement,
    target: element,
    code: hintCode,
    type: type
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
  const key = event.key.toLowerCase();
  
  // If this is the first character, filter to only show matching hints
  if (currentHintCode === '') {
    // Check if any hints start with this character
    const matchingHints = linkHints.filter(hint => 
      hint.code.startsWith(key)
    );
    
    // If no matches, exit hint mode
    if (matchingHints.length === 0) {
      exitLinkHintMode();
      return;
    }
    
    // Hide all hints that don't match
    linkHints.forEach(hint => {
      if (!hint.code.startsWith(key)) {
        hint.element.style.display = 'none';
      } else {
        hint.element.style.backgroundColor = '#88ff88'; // Highlight matching hints
      }
    });
  }
  
  currentHintCode += key;
  
  // Check if the current input matches any hint
  const matchedHint = linkHints.find(hint => hint.code === currentHintCode);
  
  // If we have an exact match, activate the element
  if (matchedHint) {
    activateElement(matchedHint.target, matchedHint.type);
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
  } else {
    // Update highlighting of potential matches
    linkHints.forEach(hint => {
      if (hint.code.startsWith(currentHintCode)) {
        hint.element.style.backgroundColor = '#88ff88'; // Brighter green for better matches
      } else if (hint.element.style.display !== 'none') {
        hint.element.style.backgroundColor = '#ffff88'; // Dimmer yellow for less relevant
      }
    });
  }
  
  event.preventDefault();
}

/**
 * Activate the targeted element based on its type
 */
function activateElement(element, type) {
  if (type === 'input') {
    element.focus();
  } else {
    // For links and buttons, simulate a click
    element.click();
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
