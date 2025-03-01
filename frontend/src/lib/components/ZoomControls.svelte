<script lang="ts">
  import { ZoomIn, ZoomOut, Book, BookOpen, Library } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  // Props
  export let zoomLevel: string;
  export let setZoomLevel: (level: string) => void;
  
  // Zoom levels in order
  const zoomLevels = ['chapter', 'book', 'testament', 'bible'];
  
  // State
  let showTooltip = false;
  
  function zoomIn() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(zoomLevels[currentIndex - 1]);
      showTooltipBriefly();
    }
  }
  
  function zoomOut() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentIndex + 1]);
      showTooltipBriefly();
    }
  }
  
  function showTooltipBriefly() {
    showTooltip = true;
    setTimeout(() => {
      showTooltip = false;
    }, 2000);
  }
  
  // Get icon based on current zoom level
  function getZoomIcon() {
    switch(zoomLevel) {
      case 'chapter': return BookOpen;
      case 'book': return Book;
      case 'testament': return Library;
      case 'bible': return Library;
      default: return BookOpen;
    }
  }
  
  // Get zoom level label
  function getZoomLabel() {
    switch(zoomLevel) {
      case 'chapter': return 'Chapter View';
      case 'book': return 'Book View';
      case 'testament': return 'Testament View';
      case 'bible': return 'Full Bible View';
      default: return 'Chapter View';
    }
  }
  
  // Get description of zoom level
  function getZoomDescription() {
    switch(zoomLevel) {
      case 'chapter': return 'Viewing individual chapters in detail';
      case 'book': return 'Viewing all chapters within a book';
      case 'testament': return 'Viewing all books within a testament';
      case 'bible': return 'Viewing the entire Bible';
      default: return '';
    }
  }
</script>

<!-- Removed the fixed positioning since we're now using the header controls -->
{#if showTooltip}
  <div 
    class="absolute bottom-6 right-6 z-20 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs border border-gray-200 dark:border-gray-700"
    transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
  >
    <div class="font-bold mb-1">{getZoomLabel()}</div>
    <div class="text-xs opacity-80">{getZoomDescription()}</div>
  </div>
{/if}

<style>
  /* Button styling */
  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  :global(.btn-icon) {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
  }
  
  :global(.btn-ghost) {
    background-color: transparent;
  }
  
  :global(.btn-ghost:hover) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark .btn-ghost:hover) {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>