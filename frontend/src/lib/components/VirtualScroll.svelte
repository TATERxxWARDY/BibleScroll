<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  
  // Bible data types
  type Chapter = {
    number: number;
    text: string;
  };
  
  type Book = {
    name: string;
    chapters: Chapter[];
  };
  
  type Testament = {
    name: string;
    books: Book[];
  };
  
  type BibleData = {
    testaments: Testament[];
  };
  
  // Props
  export let bibleData: BibleData;
  export let zoomLevel: string;
  export let containerWidth: number;
  export let containerHeight: number;
  export let darkMode: boolean;
  
  // Internal state
  let scrollContainer: HTMLElement;
  let visibleItems: any[] = [];
  let startIndex = 0;
  let endIndex = 0;
  let bufferSize = 3; // Increased buffer size to prevent clipping
  let itemWidth = 0;
  let totalItems = 0;
  let items: any[] = [];
  
  const dispatch = createEventDispatcher();
  
  // Calculate item width based on zoom level
  $: {
    switch(zoomLevel) {
      case 'chapter':
        itemWidth = Math.max(containerWidth * 0.9, 800); // Ensure minimum width
        items = flattenToChapters(bibleData);
        break;
      case 'book':
        itemWidth = Math.max(containerWidth * 0.45, 600); // Ensure minimum width
        items = flattenToBooks(bibleData);
        break;
      case 'testament':
        itemWidth = Math.max(containerWidth * 0.25, 400); // Ensure minimum width
        items = bibleData.testaments;
        break;
      case 'bible':
        itemWidth = Math.max(containerWidth * 0.15, 300); // Ensure minimum width
        items = [bibleData]; // The entire Bible as one item
        break;
      default:
        itemWidth = Math.max(containerWidth * 0.9, 800); // Ensure minimum width
        items = flattenToChapters(bibleData);
    }
    totalItems = items.length;
    updateVisibleItems();
  }
  
  // Flatten Bible data to different levels
  function flattenToChapters(data: BibleData): any[] {
    const chapters: any[] = [];
    data.testaments.forEach(testament => {
      testament.books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapters.push({
            testament: testament.name,
            book: book.name,
            chapter: chapter.number,
            text: chapter.text
          });
        });
      });
    });
    return chapters;
  }
  
  function flattenToBooks(data: BibleData): any[] {
    const books: any[] = [];
    data.testaments.forEach(testament => {
      testament.books.forEach(book => {
        books.push({
          testament: testament.name,
          book: book.name,
          chapters: book.chapters
        });
      });
    });
    return books;
  }
  
  function updateVisibleItems() {
    if (!scrollContainer || items.length === 0) return;
    
    const scrollLeft = scrollContainer?.scrollLeft || 0;
    const viewportWidth = containerWidth;
    
    // Calculate which items should be visible
    startIndex = Math.max(0, Math.floor(scrollLeft / itemWidth) - bufferSize);
    endIndex = Math.min(
      items.length - 1, 
      Math.ceil((scrollLeft + viewportWidth) / itemWidth) + bufferSize
    );
    
    visibleItems = items.slice(startIndex, endIndex + 1);
    
    // Dispatch event with current visible items for tracking
    dispatch('visibilityChange', {
      startIndex,
      endIndex,
      visibleItems
    });
  }
  
  function handleScroll() {
    updateVisibleItems();
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
  
  // Calculate column width based on zoom level and container width
  function getColumnWidth(level: string) {
    switch(level) {
      case 'chapter': 
        return Math.min(containerWidth * 0.4, 500); // Limit max width
      case 'book': 
        return Math.min(containerWidth * 0.25, 350);
      case 'testament': 
        return Math.min(containerWidth * 0.15, 250);
      case 'bible': 
        return Math.min(containerWidth * 0.1, 200);
      default: 
        return Math.min(containerWidth * 0.4, 500);
    }
  }
  
  // Render different content based on zoom level
  function renderItem(item: any, index: number) {
    switch(zoomLevel) {
      case 'chapter':
        return renderChapter(item);
      case 'book':
        return renderBook(item);
      case 'testament':
        return renderTestament(item);
      case 'bible':
        return renderBible(item);
      default:
        return renderChapter(item);
    }
  }
  
  function renderChapter(item: any) {
    const columnWidth = getColumnWidth('chapter');
    return `
      <div class="mb-4">
        <h2 class="font-bold text-lg text-gray-800 dark:text-gray-200">${item.book} ${item.chapter}</h2>
      </div>
      <div class="${getFontSize()} text-gray-700 dark:text-gray-300 h-full overflow-hidden column-text"
           style="column-width: ${columnWidth}px; column-gap: 2.5rem; column-fill: auto; margin-right: 10px; margin-left: 20px;">
        <p class="leading-relaxed">${item.text}</p>
      </div>
    `;
  }
  
  function renderBook(item: any) {
    const columnWidth = getColumnWidth('book');
    return `
      <div class="mb-4">
        <h2 class="font-bold text-xl text-gray-800 dark:text-gray-200">${item.book}</h2>
      </div>
      <div class="${getFontSize()} text-gray-700 dark:text-gray-300 h-full overflow-hidden column-text"
           style="column-width: ${columnWidth}px; column-gap: 1.5rem; column-fill: auto; margin-right: 10px; margin-left: 20px;">
        ${item.chapters.map((ch: Chapter) => `
          <div class="mb-3">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">${ch.number}</h3>
            <p class="leading-relaxed">${ch.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  function renderTestament(item: any) {
    const columnWidth = getColumnWidth('testament');
    return `
      <div class="mb-4">
        <h2 class="font-bold text-2xl text-gray-800 dark:text-gray-200">${item.name}</h2>
      </div>
      <div class="${getFontSize()} text-gray-700 dark:text-gray-300 h-full overflow-hidden column-text"
           style="column-width: ${columnWidth}px; column-gap: 1rem; column-fill: auto; margin-right: 10px; margin-left: 20px;">
        ${item.books.map((book: Book) => `
          <div class="mb-3">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">${book.name}</h3>
            ${book.chapters.map((ch: Chapter) => `
              <div class="mb-1">
                <span class="font-medium">${ch.number}</span>
                <span>${ch.text.substring(0, 50)}...</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  function renderBible(item: any) {
    const columnWidth = getColumnWidth('bible');
    return `
      <div class="mb-4">
        <h2 class="font-bold text-2xl text-center text-gray-800 dark:text-gray-200 mb-6">The Holy Bible</h2>
      </div>
      <div class="grid grid-cols-2 gap-10 ${getFontSize()} text-gray-700 dark:text-gray-300">
        <div>
          <h3 class="text-xl font-bold mb-6">Old Testament</h3>
          <div class="grid grid-cols-3 gap-4 text-sm">
            ${item.testaments[0].books.map((book: Book) => `
              <div class="p-2 border border-gray-200 dark:border-gray-700 rounded">
                ${book.name}
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-6">New Testament</h3>
          <div class="grid grid-cols-3 gap-4 text-sm">
            ${item.testaments[1].books.map((book: Book) => `
              <div class="p-2 border border-gray-200 dark:border-gray-700 rounded">
                ${book.name}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  onMount(() => {
    updateVisibleItems();
  });
  
  afterUpdate(() => {
    updateVisibleItems();
  });
</script>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Column text styling */
  :global(.column-text) {
    text-align: justify;
    hyphens: auto;
    padding: 0 0.5rem;
  }
  
  :global(.column-text p) {
    margin-bottom: 1rem;
    break-inside: avoid;
  }
  
  :global(.column-text) {
    column-rule: 1px solid rgba(128, 128, 128, 0.2);
  }
</style>

<div 
  bind:this={scrollContainer}
  on:scroll={handleScroll}
  class="h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar cursor-grab"
  role="region"
  aria-label="Bible scroll viewer"
>
  <!-- Ensure the container is wide enough to hold all items -->
  <div class="inline-flex h-full relative" style="width: {Math.max(totalItems * itemWidth, containerWidth * 2)}px;">
    {#each visibleItems as item, i}
      <div 
        class="inline-block h-full p-6 border-r border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
        style="width: {itemWidth}px; left: {(startIndex + i) * itemWidth}px; position: absolute;"
        data-index={startIndex + i}
      >
        {@html renderItem(item, startIndex + i)}
      </div>
    {/each}
  </div>
</div>