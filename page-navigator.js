/**
 * Vim-Style Page Navigation Firefox Extension
 * 
 * Navigation controls:
 * - j: Scroll down
 * - k: Scroll up
 * - gg: Go to top of page
 * - G: Go to bottom of page
 */

// Scroll amount for each j/k press (in pixels)
const SCROLL_AMOUNT = 150;

// To track multi-key sequences (for "gg")
let keySequence = '';
let keySequenceTimer = null;
const KEY_SEQUENCE_TIMEOUT = 1000; // 1 second timeout for key sequence

// Main event listener for keyboard input
document.addEventListener('keydown', (event) => {
  // Ignore inputs when focus is on form elements
  if (isUserTyping()) {
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
        behavior: 'auto'
      });
      break;
  }
  
  // Handle the "gg" sequence to go to top of page
  if (keySequence.endsWith('gg')) {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    keySequence = '';
  }
});

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
