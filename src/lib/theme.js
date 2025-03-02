import { writable } from 'svelte/store';

// Initialize with a function to allow SSR compatibility
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

// Create a writable store
const theme = writable(getInitialTheme());

// Subscribe to theme changes and update localStorage and document class
if (typeof window !== 'undefined') {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    
    // Update the document class for theming
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}

// Toggle between light and dark themes
function toggleTheme() {
  theme.update(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
}

export { theme, toggleTheme }; 