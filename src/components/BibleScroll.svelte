<script>
  import { onMount } from 'svelte';
  import { theme, toggleTheme } from '$lib/theme';
  import { cn } from '$lib/utils';
  import Button from './ui/Button.svelte';
  import Dialog from './ui/Dialog.svelte';
  import DialogContent from './ui/DialogContent.svelte';
  import DialogHeader from './ui/DialogHeader.svelte';
  import DialogTitle from './ui/DialogTitle.svelte';
  import DialogDescription from './ui/DialogDescription.svelte';
  import DialogFooter from './ui/DialogFooter.svelte';
  
  // Zoom levels
  const ZOOM_LEVELS = {
    VERSE: 0,
    CHAPTER: 1,
    BOOK: 2,
    TESTAMENT: 3,
    BIBLE: 4
  };
  
  // Reactive variables
  let isDarkMode = false;
  let zoomLevel = ZOOM_LEVELS.CHAPTER;
  let scrollContainer;
  let isScrolling = false;
  let startX = 0;
  let scrollLeft = 0;
  let showInfoDialog = false;
  
  // Update isDarkMode when theme changes
  $: isDarkMode = $theme === 'dark';
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // Toggle info dialog
  function toggleInfoDialog() {
    showInfoDialog = !showInfoDialog;
  }
  
  // Zoom in (more detail)
  const handleZoomIn = () => {
    if (zoomLevel > ZOOM_LEVELS.VERSE) {
      zoomLevel -= 1;
    }
  };
  
  // Zoom out (less detail)
  const handleZoomOut = () => {
    if (zoomLevel < ZOOM_LEVELS.BIBLE) {
      zoomLevel += 1;
    }
  };
  
  // Handle mouse down for scrolling
  const handleMouseDown = (e) => {
    isScrolling = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  };
  
  // Handle touch start for mobile scrolling
  const handleTouchStart = (e) => {
    isScrolling = true;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  };
  
  // Handle mouse move for scrolling
  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainer.scrollLeft = scrollLeft - walk;
  };
  
  // Handle touch move for mobile scrolling
  const handleTouchMove = (e) => {
    if (!isScrolling) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainer.scrollLeft = scrollLeft - walk;
  };
  
  // Handle mouse up to stop scrolling
  const handleMouseUpOrLeave = () => {
    isScrolling = false;
  };
  
  // Get zoom level label
  $: zoomLevelLabel = getZoomLevelLabel(zoomLevel);
  
  function getZoomLevelLabel(level) {
    switch (level) {
      case ZOOM_LEVELS.VERSE:
        return "Verse View";
      case ZOOM_LEVELS.CHAPTER:
        return "Chapter View";
      case ZOOM_LEVELS.BOOK:
        return "Book View";
      case ZOOM_LEVELS.TESTAMENT:
        return "Testament View";
      case ZOOM_LEVELS.BIBLE:
        return "Full Bible View";
      default:
        return "Chapter View";
    }
  }
  
  // Generate Bible content based on zoom level
  $: bibleContent = getBibleContent(zoomLevel);
  
  function getBibleContent(level) {
    switch (level) {
      case ZOOM_LEVELS.VERSE:
        return generateVerseView();
      case ZOOM_LEVELS.CHAPTER:
        return generateChapterView();
      case ZOOM_LEVELS.BOOK:
        return generateBookView();
      case ZOOM_LEVELS.TESTAMENT:
        return generateTestamentView();
      case ZOOM_LEVELS.BIBLE:
        return generateBibleView();
      default:
        return generateChapterView();
    }
  }
  
  // Verse view shows individual verses
  function generateVerseView() {
    return Array(50)
      .fill(0)
      .map((_, i) => `
        <div class="verse-container p-6 border-r border-gray-200 dark:border-gray-700 min-w-[300px]">
          <h3 class="text-lg font-semibold mb-2">Verse ${i + 1}</h3>
          <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      `).join('');
  }
  
  // Chapter view shows verses grouped by chapters
  function generateChapterView() {
    return Array(20)
      .fill(0)
      .map((_, i) => `
        <div class="chapter-container p-6 border-r border-gray-200 dark:border-gray-700 min-w-[400px]">
          <h2 class="text-xl font-bold mb-4">Chapter ${i + 1}</h2>
          <div class="space-y-3">
            ${Array(10)
              .fill(0)
              .map((_, j) => `
                <div class="verse p-2 border border-gray-100 dark:border-gray-800 rounded">
                  <span class="font-medium mr-2">${j + 1}</span>
                  <span class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </div>
              `).join('')}
          </div>
        </div>
      `).join('');
  }
  
  // Book view shows chapters grouped by books
  function generateBookView() {
    return Array(10)
      .fill(0)
      .map((_, i) => `
        <div class="book-container p-6 border-r border-gray-200 dark:border-gray-700 min-w-[600px]">
          <h2 class="text-2xl font-bold mb-6">Book ${i + 1}</h2>
          <div class="grid grid-cols-2 gap-4">
            ${Array(8)
              .fill(0)
              .map((_, j) => `
                <div class="chapter p-3 border border-gray-200 dark:border-gray-700 rounded">
                  <h3 class="font-semibold mb-2">Chapter ${j + 1}</h3>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Contains verses 1-30</div>
                </div>
              `).join('')}
          </div>
        </div>
      `).join('');
  }
  
  // Testament view shows books grouped by testament
  function generateTestamentView() {
    return `
      <div class="testament-container p-8 border-r border-gray-200 dark:border-gray-700 min-w-[800px]">
        <h1 class="text-3xl font-bold mb-8">Old Testament</h1>
        <div class="grid grid-cols-4 gap-4">
          ${Array(39)
            .fill(0)
            .map((_, i) => `
              <div class="book p-4 border border-gray-200 dark:border-gray-700 rounded">
                <h3 class="font-medium">Book ${i + 1}</h3>
              </div>
            `).join('')}
        </div>
      </div>
      <div class="testament-container p-8 border-r border-gray-200 dark:border-gray-700 min-w-[800px]">
        <h1 class="text-3xl font-bold mb-8">New Testament</h1>
        <div class="grid grid-cols-4 gap-4">
          ${Array(27)
            .fill(0)
            .map((_, i) => `
              <div class="book p-4 border border-gray-200 dark:border-gray-700 rounded">
                <h3 class="font-medium">Book ${i + 1}</h3>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  }
  
  // Bible view shows the complete bible structure
  function generateBibleView() {
    return `
      <div class="bible-container p-8 min-w-[1200px]">
        <h1 class="text-4xl font-bold mb-10 text-center">Holy Bible</h1>
        <div class="space-y-12">
          <div>
            <h2 class="text-2xl font-bold mb-6">Old Testament</h2>
            <div class="grid grid-cols-3 gap-4 text-sm">
              ${Array(39)
                .fill(0)
                .map((_, i) => `
                  <div class="p-2 border border-gray-200 dark:border-gray-700 rounded">
                    Book ${i + 1}
                  </div>
                `).join('')}
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-6">New Testament</h2>
            <div class="grid grid-cols-3 gap-4 text-sm">
              ${Array(27)
                .fill(0)
                .map((_, i) => `
                  <div class="p-2 border border-gray-200 dark:border-gray-700 rounded">
                    Book ${i + 1}
                  </div>
                `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
</script>

<div class={cn("h-screen w-full flex flex-col", isDarkMode ? "dark" : "")}>
  <div class="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 h-full flex flex-col">
    <!-- Header with view label and buttons -->
    <header class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-xl font-bold">Bible Scroll Viewer</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm">{zoomLevelLabel}</span>
        
        <!-- Information button -->
        <button 
          class="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary shadow-md hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          on:click={toggleInfoDialog}
          on:keydown={(e) => e.key === 'Enter' && toggleInfoDialog()}
          aria-label="Show information"
          tabindex="0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </button>
        
        <!-- Theme Toggle Button -->
        <button 
          class="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary shadow-md hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          on:click={handleThemeToggle}
          on:keydown={(e) => e.key === 'Enter' && handleThemeToggle()}
          aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          tabindex="0"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg 
            class:hidden={!isDarkMode}
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          
          <!-- Moon icon (shown in light mode) -->
          <svg 
            class:hidden={isDarkMode}
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main scroll container -->
    <div
      bind:this={scrollContainer}
      class="flex-1 overflow-x-auto flex items-stretch cursor-grab active:cursor-grabbing"
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUpOrLeave}
      on:mouseleave={handleMouseUpOrLeave}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleMouseUpOrLeave}
    >
      <div class="flex h-full">
        {@html bibleContent}
      </div>
    </div>

    <!-- Zoom controls -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        on:click={handleZoomIn}
        disabled={zoomLevel <= ZOOM_LEVELS.VERSE}
        className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
      >
        <!-- Zoom In icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
          <path d="M8 11h6"></path>
          <path d="M11 8v6"></path>
        </svg>
      </Button>
      <Button
        size="sm"
        variant="outline"
        on:click={handleZoomOut}
        disabled={zoomLevel >= ZOOM_LEVELS.BIBLE}
        className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
      >
        <!-- Zoom Out icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
          <path d="M8 11h6"></path>
        </svg>
      </Button>
    </div>
    
    <!-- Info Dialog -->
    <Dialog bind:open={showInfoDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bible Scroll Viewer</DialogTitle>
          <DialogDescription>
            Explore the Bible with different zoom levels and panning.
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-4">
          <h3 class="text-sm font-medium mb-2">Zoom Levels:</h3>
          <ul class="list-disc pl-5 text-sm space-y-1">
            <li>Verse View - Shows individual verses</li>
            <li>Chapter View - Shows chapters with their verses</li>
            <li>Book View - Shows books with their chapters</li>
            <li>Testament View - Shows testaments with their books</li>
            <li>Bible View - Shows the entire Bible structure</li>
          </ul>
          
          <h3 class="text-sm font-medium mt-4 mb-2">Navigation:</h3>
          <ul class="list-disc pl-5 text-sm space-y-1">
            <li>Click and drag to pan horizontally</li>
            <li>Use the zoom controls to change detail level</li>
            <li>Toggle between light and dark theme using the theme button</li>
          </ul>
        </div>
        
        <DialogFooter>
          <Button on:click={toggleInfoDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>

<style>
  /* Add any component-specific styles here */
  :global(.dark) {
    color-scheme: dark;
  }
</style> 