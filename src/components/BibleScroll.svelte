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
  import ChapterSkeleton from './ChapterSkeleton.svelte';
  
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
  let needsColumnDetection = false;
  let currentChapter = 1; // Track current chapter
  let totalChapters = 20; // Total number of chapters
  
  // Use fixed widths for chapter containers instead of dynamic calculation
  // This avoids constant recalculation and visual flicker
  const CHAPTER_WIDTHS = {
    ACTIVE: 800,  // Fixed width for active chapter
    INACTIVE: 500 // Fixed width for inactive chapters
  };
  
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
  
  // Function to handle changing the current chapter
  function changeCurrentChapter(chapterNum, fetchOptions = {}) {
    if (chapterNum >= 1 && chapterNum <= totalChapters) {
      // Show loading state if needed
      const isLoading = fetchOptions.shouldFetch || false;
      
      // Allow integration with server-side fetching
      if (fetchOptions.fetchFn && typeof fetchOptions.fetchFn === 'function') {
        // Execute the provided fetch function
        fetchOptions.fetchFn(chapterNum, fetchOptions.chapterData)
          .then(() => {
            // Update current chapter after successful fetch
            currentChapter = chapterNum;
            scrollToChapter(chapterNum);
          })
          .catch(error => {
            console.error('Error fetching chapter:', error);
            // Optionally handle the error state
          });
      } else {
        // Default behavior (client-side only)
        currentChapter = chapterNum;
        scrollToChapter(chapterNum);
      }
    }
  }
  
  // Helper function to scroll to the selected chapter
  function scrollToChapter(chapterNum) {
    setTimeout(() => {
      const chapterElement = document.getElementById(`chapter-${chapterNum}`);
      if (chapterElement && scrollContainer) {
        scrollContainer.scrollLeft = chapterElement.offsetLeft - scrollContainer.offsetWidth / 2 + chapterElement.offsetWidth / 2;
      }
    }, 100);
  }
  
  // Generate Bible content based on zoom level
  $: bibleContent = getBibleContent(zoomLevel);
  $: if (zoomLevel === ZOOM_LEVELS.VERSE) {
    needsColumnDetection = true;
  }
  
  function getBibleContent(level) {
    switch (level) {
      case ZOOM_LEVELS.VERSE:
        return generateVerseView();
      case ZOOM_LEVELS.CHAPTER:
        // Return a placeholder - we'll handle chapter view with components
        return null;
      case ZOOM_LEVELS.BOOK:
        return generateBookView();
      case ZOOM_LEVELS.TESTAMENT:
        return generateTestamentView();
      case ZOOM_LEVELS.BIBLE:
        return generateBibleView();
      default:
        return null;
    }
  }
  
  // Verse view shows individual verses
  function generateVerseView() {
    // Create an array of verses with variable lengths for demonstration
    const verses = Array(40).fill(0).map((_, i) => {
      // Vary the length of verses for demonstration purposes
      // Make longer verses more likely for a few specific positions to demonstrate the continuation more clearly
      const isSpecialPosition = [4, 9, 14, 19, 24, 29, 34].includes(i);
      const length = isSpecialPosition 
        ? Math.floor(Math.random() * 3) + 3 // 3, 4, or 5 units of text
        : Math.floor(Math.random() * 2) + 1; // 1 or 2 units of text
      
      return {
        number: i + 1,
        text: Array(length).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.").join(' ')
      };
    });

    // Calculate total width for horizontal scrolling
    const columnCount = 3;
    const columnWidth = 350; // px
    const columnGap = 30; // px
    const containerPadding = 24; // px
    const totalWidth = (columnWidth * columnCount) + (columnGap * (columnCount - 1)) + (containerPadding * 2);

    // We'll use CSS multi-column layout
    return `
      <div id="verse-view-container" class="verse-view-container" style="
        min-width: ${totalWidth}px;
        height: 100%;
        padding: ${containerPadding}px;
        columns: ${columnCount} ${columnWidth}px;
        column-gap: ${columnGap}px;
        column-fill: auto;
        column-rule: 1px solid rgba(128, 128, 128, 0.2);
      ">
        ${verses.map((verse, index) => `
          <div class="verse-container mb-4 p-4 break-inside-avoid-column bg-white/50 dark:bg-gray-800/50 rounded-md" 
               data-verse-number="${verse.number}">
            <div class="verse-header flex items-center mb-2">
              <span class="verse-number font-semibold mr-2">${verse.number}.</span>
              <span class="continued-indicator text-xs text-gray-500 hidden">(continued)</span>
            </div>
            <p class="verse-text text-sm leading-relaxed">${verse.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Handle column continuation detection
  onMount(() => {
    // Set up a watcher for Bible content changes
    const unsubscribe = (() => {
      let prevContent = null;
      return setInterval(() => {
        if (needsColumnDetection && bibleContent !== prevContent) {
          prevContent = bibleContent;
          setTimeout(detectColumnContinuation, 100);
        }
      }, 200);
    })();
    
    // Clean up on unmount
    return () => {
      clearInterval(unsubscribe);
    };
  });
  
  // Function to handle column continuation detection
  function detectColumnContinuation() {
    const container = document.getElementById('verse-view-container');
    if (!container) return;
    
    const verseContainers = Array.from(container.querySelectorAll('.verse-container'));
    if (verseContainers.length === 0) return;
    
    // Get the container's bounding rect
    const containerRect = container.getBoundingClientRect();
    
    // Calculate column width including gap
    const columnCount = 3;
    const columnWidth = containerRect.width / columnCount;
    
    // Group verses by their column
    const columnVerses = {};
    
    // Determine which column each verse is in
    verseContainers.forEach(verse => {
      const rect = verse.getBoundingClientRect();
      const relativeLeft = rect.left - containerRect.left;
      const columnIndex = Math.floor(relativeLeft / columnWidth);
      
      if (!columnVerses[columnIndex]) {
        columnVerses[columnIndex] = [];
      }
      
      columnVerses[columnIndex].push({
        element: verse,
        rect: rect,
        number: parseInt(verse.getAttribute('data-verse-number'))
      });
    });
    
    // Sort verses in each column by their vertical position
    Object.keys(columnVerses).forEach(columnIndex => {
      columnVerses[columnIndex].sort((a, b) => a.rect.top - b.rect.top);
    });
    
    // Now find verses that continue in the next column (by verse number sequence)
    for (let i = 1; i < columnCount; i++) {
      const currentColumnVerses = columnVerses[i] || [];
      const prevColumnVerses = columnVerses[i-1] || [];
      
      if (currentColumnVerses.length > 0 && prevColumnVerses.length > 0) {
        // First verse in this column
        const firstVerseInCol = currentColumnVerses[0];
        
        // If the first verse in this column is the same number as the last verse in previous column + 1,
        // it's a normal continuation, not a wrapped verse
        const lastVerseInPrevCol = prevColumnVerses[prevColumnVerses.length - 1];
        
        if (firstVerseInCol.number !== lastVerseInPrevCol.number + 1) {
          // This indicates a verse continued from the previous column
          const continuedIndicator = firstVerseInCol.element.querySelector('.continued-indicator');
          if (continuedIndicator) {
            continuedIndicator.classList.remove('hidden');
            // Update the text to make it clear which verse is continuing
            continuedIndicator.textContent = `(${firstVerseInCol.number} continued)`;
          }
        }
      }
    }
    
    needsColumnDetection = false;
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
      <div class="bible-container flex flex-row items-stretch border-r border-gray-200 dark:border-gray-700 min-w-[2400px]">
        <div class="testament-section p-8 border-r border-gray-200 dark:border-gray-700 min-w-[1200px]">
          <h1 class="text-3xl font-bold mb-8">Old Testament</h1>
          <div class="grid grid-cols-6 gap-4 text-sm">
            ${Array(39)
              .fill(0)
              .map((_, i) => `
                <div class="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h3 class="font-medium">Book ${i + 1}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chapters: ${Math.floor(Math.random() * 30) + 10}</p>
                </div>
              `).join('')}
          </div>
        </div>
        <div class="testament-section p-8 min-w-[1200px]">
          <h1 class="text-3xl font-bold mb-8">New Testament</h1>
          <div class="grid grid-cols-6 gap-4 text-sm">
            ${Array(27)
              .fill(0)
              .map((_, i) => `
                <div class="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h3 class="font-medium">Book ${i + 1}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chapters: ${Math.floor(Math.random() * 20) + 5}</p>
                </div>
              `).join('')}
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
        {#if zoomLevel === ZOOM_LEVELS.CHAPTER}
          <div id="chapter-view-container" class="chapter-view-container flex flex-row space-x-8">
            {#each Array(totalChapters) as _, i}
              <!-- Replace dynamic width with fixed width based on whether it's the current chapter -->
              <div 
                id="chapter-{i+1}" 
                class="chapter-wrapper" 
                style="width: {i+1 === currentChapter ? CHAPTER_WIDTHS.ACTIVE : CHAPTER_WIDTHS.INACTIVE}px; margin-right: 2rem;"
              >
                {#if i+1 === currentChapter}
                  <!-- Current chapter with full content -->
                  <div class="chapter-container p-6 border-r border-gray-200 dark:border-gray-700 relative">
                    <h2 class="text-xl font-bold mb-4">Chapter {i+1}</h2>
                    <!-- Multi-column layout for verses WITHOUT offsetWidth binding -->
                    <div 
                      class="verses-container" 
                      style="
                        columns: 3 240px;
                        column-gap: 40px;
                        column-fill: balance;
                        height: calc(100vh - 180px);
                      "
                    >
                      {#each Array(20) as _, j}
                        <div class="verse p-2 mb-3 rounded break-inside-avoid-column bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors">
                          <span class="font-medium mr-2 text-blue-600 dark:text-blue-400">{j+1}</span>
                          <span class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. {j % 3 === 0 ? 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' : ''}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {:else}
                  <!-- Other chapters with visible headings but skeleton content -->
                  <div class="chapter-container p-6 border-r border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 transition-opacity">
                    <div class="flex items-center justify-between mb-4">
                      <h2 class="text-xl font-bold cursor-pointer" on:click={() => changeCurrentChapter(i+1)}>Chapter {i+1}</h2>
                      <button 
                        class="view-chapter-btn p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 shadow-md hover:shadow-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 scale-100 hover:scale-105"
                        on:click={() => changeCurrentChapter(i+1, {
                          // Example integration points for server-side fetching
                          shouldFetch: true,
                          chapterData: {
                            id: `chapter-${i+1}`,
                            href: `/api/chapters/${i+1}`,
                            nextHref: i+2 <= totalChapters ? `/api/chapters/${i+2}` : null,
                            prevHref: i > 0 ? `/api/chapters/${i}` : null
                          },
                          // This can be replaced with actual fetch implementation
                          fetchFn: null
                        })}
                        data-chapter-id={i+1}
                        data-chapter-href={`/api/chapters/${i+1}`}
                        aria-label="View chapter {i+1}"
                      >
                        <!-- Eye icon (view) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                    <!-- Multi-column layout for skeleton content WITHOUT offsetWidth binding -->
                    <div 
                      class="skeleton-verses-container" 
                      style="
                        columns: 2 200px;
                        column-gap: 30px;
                        column-fill: auto;
                        height: calc(100vh - 180px);
                      "
                    >
                      {#each Array(Math.floor(Math.random() * 5) + 15) as _, j}
                        <div class="skeleton-verse h-8 mb-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse break-inside-avoid-column"></div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          {@html bibleContent}
        {/if}
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