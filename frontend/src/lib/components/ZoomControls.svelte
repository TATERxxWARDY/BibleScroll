<script lang="ts">
  import { ZoomIn, ZoomOut, Book, BookOpen, Library } from 'lucide-svelte';
  
  // Props
  export let zoomLevel: string;
  export let setZoomLevel: (level: string) => void;
  
  // Zoom levels in order
  const zoomLevels = ['chapter', 'book', 'testament', 'bible'];
  
  function zoomIn() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(zoomLevels[currentIndex - 1]);
    }
  }
  
  function zoomOut() {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentIndex + 1]);
    }
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
    return zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1) + ' View';
  }
</script>

<div class="fixed bottom-4 right-4 z-10 flex flex-col items-end">
  <div class="mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm text-gray-700 dark:text-gray-300">
    {getZoomLabel()}
  </div>
  
  <div class="flex gap-2">
    <button 
      on:click={zoomIn}
      disabled={zoomLevel === 'chapter'}
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 disabled:opacity-50"
      aria-label="Zoom in"
    >
      <ZoomIn size={20} />
    </button>
    
    <button 
      on:click={zoomOut}
      disabled={zoomLevel === 'bible'}
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 disabled:opacity-50"
      aria-label="Zoom out"
    >
      <ZoomOut size={20} />
    </button>
  </div>
</div>