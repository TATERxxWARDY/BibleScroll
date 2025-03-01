<script lang="ts">
  import '$lib/styles/transitions.css';
  import { onMount } from 'svelte';
  import ZoomControls from '$lib/components/ZoomControls.svelte';
  import VirtualScroll from '$lib/components/VirtualScroll.svelte';
  import { setupIntersectionObserver } from '$lib/utils/intersectionObserver';
  import { Moon, Sun } from 'lucide-svelte';
  
  // State management
  let darkMode = false;
  let zoomLevel: string = 'chapter'; // 'chapter', 'book', 'testament', 'bible'
  let scrollContainer: HTMLElement;
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;
  let containerWidth = 0;
  let containerHeight = 0;
  
  // Sample Bible data structure (would be replaced with actual data from backend)
  const bibleData = {
    testaments: [
      {
        name: 'Old Testament',
        books: [
          {
            name: 'Genesis',
            chapters: [
              { number: 1, text: 'In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep...' },
              { number: 2, text: 'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God ended his work which he had made...' },
              // More chapters would be here
            ]
          },
          // More books would be here
        ]
      },
      {
        name: 'New Testament',
        books: [
          {
            name: 'Matthew',
            chapters: [
              { number: 1, text: 'The book of the generation of Jesus Christ, the son of David, the son of Abraham...' },
              // More chapters would be here
            ]
          },
          // More books would be here
        ]
      }
    ]
  };
  
  // Handle dark mode toggle
  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Handle zoom level change
  function setZoomLevel(level: string) {
    zoomLevel = level;
  }
  
  // Drag to scroll functionality
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = 'grabbing';
    e.preventDefault();
  }
  
  function handleTouchStart(e: TouchEvent) {
    isDragging = true;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    e.preventDefault();
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainer.scrollLeft = scrollLeft - walk;
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
    e.preventDefault(); // Prevent page scrolling
  }
  
  function handleMouseUp() {
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
  }
  
  function handleTouchEnd() {
    isDragging = false;
  }
  
  // Calculate column width based on zoom level
  function getColumnWidth() {
    switch(zoomLevel) {
      case 'chapter': return 'w-[90vw]';
      case 'book': return 'w-[45vw]';
      case 'testament': return 'w-[25vw]';
      case 'bible': return 'w-[15vw]';
      default: return 'w-[90vw]';
    }
  }
  
  // Calculate font size based on zoom level
  function getFontSize() {
    switch(zoomLevel) {
      case 'chapter': return 'text-base';
      case 'book': return 'text-sm';
      case 'testament': return 'text-xs';
      case 'bible': return 'text-[0.6rem]';
      default: return 'text-base';
    }
  }
  
  // Handle window resize
  function handleResize() {
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight;
  }
  
  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Prevent default scroll behavior
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<svelte:window on:mouseup={handleMouseUp} on:touchend={handleTouchEnd} />

<div class="fixed top-4 right-4 z-10">
  <button 
    on:click={toggleDarkMode}
    class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {#if darkMode}
      <Sun size={20} />
    {:else}
      <Moon size={20} />
    {/if}
  </button>
</div>

<div 
  class="h-screen w-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
  class:dark={darkMode}
>
  <div
    bind:this={scrollContainer}
    on:mousedown={handleMouseDown}
    on:touchstart={handleTouchStart}
    on:mousemove={handleMouseMove}
    on:touchmove={handleTouchMove}
    class="h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap cursor-grab"
    style="scrollbar-width: none; -ms-overflow-style: none;"
  >
    <div class="inline-flex h-full">
      {#each bibleData.testaments as testament}
        <div class="inline-block h-full">
          {#each testament.books as book}
            <div class="inline-block h-full">
              {#each book.chapters as chapter}
                <div 
                  class={`inline-block h-full ${getColumnWidth()} p-4 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}
                >
                  <div class="mb-2">
                    <h2 class="font-bold text-gray-800 dark:text-gray-200">{book.name} {chapter.number}</h2>
                  </div>
                  <div 
                    class={`${getFontSize()} text-gray-700 dark:text-gray-300 h-full overflow-hidden column-text`}
                    style="column-width: {containerWidth * 0.9}px; column-gap: 2rem; column-fill: auto;"
                  >
                    <p>{chapter.text}</p>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  
  <ZoomControls {zoomLevel} {setZoomLevel} />
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  div::-webkit-scrollbar {
    display: none;
  }
  
  /* Custom styling for multi-column text */
  .column-text {
    text-align: justify;
    hyphens: auto;
  }
  
  /* Prevent text selection during dragging */
  .cursor-grab {
    user-select: none;
  }
  
  /* Ensure smooth transitions */
  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  
  /* Global dark mode */
  :global(.dark) {
    color-scheme: dark;
  }
</style>