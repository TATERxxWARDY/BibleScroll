<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  
  export let items: any[] = [];
  export let itemWidth: number;
  export let renderItem: (item: any, index: number) => string;
  
  let container: HTMLElement;
  let visibleItems: any[] = [];
  let startIndex = 0;
  let endIndex = 0;
  let bufferSize = 3; // Number of items to render outside visible area
  
  function updateVisibleItems() {
    if (!container) return;
    
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    
    // Calculate which items should be visible
    startIndex = Math.max(0, Math.floor(scrollLeft / itemWidth) - bufferSize);
    endIndex = Math.min(
      items.length - 1, 
      Math.ceil((scrollLeft + containerWidth) / itemWidth) + bufferSize
    );
    
    visibleItems = items.slice(startIndex, endIndex + 1);
  }
  
  function handleScroll() {
    updateVisibleItems();
  }
  
  onMount(() => {
    updateVisibleItems();
  });
  
  afterUpdate(() => {
    updateVisibleItems();
  });
</script>

<div 
  bind:this={container}
  on:scroll={handleScroll}
  class="h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap"
>
  <div class="inline-flex h-full" style:padding-left="{startIndex * itemWidth}px" >
    {#each visibleItems as item, i}
      <div class="inline-block h-full" style:width="{itemWidth}px" >
        {#if renderItem}
          {@html renderItem(item, startIndex + i)}
        {/if}
      </div>
    {/each}
  </div>
</div>