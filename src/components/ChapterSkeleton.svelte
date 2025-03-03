<script>
  export let visible = false;
  export let width = 400; // Match chapter-container min-width
  export let height = 300; // Approximate height for chapter view
  export let title = "Chapter X"; // Chapter title to display when visible
  export let onClick = () => {}; // Click handler
  export let label = null; // Optional label (Current, Previous, Next)
  
  // Generate placeholder lines that look like text
  function generateLines() {
    const lines = [];
    const lineHeight = 4;
    const gap = 2;
    const numLines = Math.floor(height / (lineHeight + gap)) - 4; // Leave room for header
    
    for (let i = 0; i < numLines; i++) {
      // Vary line lengths to make it look more natural
      const lineWidth = Math.random() * 0.3 + 0.7; // Between 70% and 100% of width
      lines.push({
        width: lineWidth * (width - 48), // Account for padding
        top: i * (lineHeight + gap) + 40 // Leave space for header
      });
    }
    
    return lines;
  }
  
  const lines = generateLines();
</script>

<div class="chapter-container p-6 border-r border-gray-200 dark:border-gray-700 min-w-[400px] cursor-pointer relative" 
     style="width: {width}px; height: {height}px;" 
     on:click={onClick}>
  
  {#if label}
    <div class="absolute top-2 right-2 {label === 'Current' ? 'bg-green-500' : label === 'Previous' ? 'bg-blue-500' : 'bg-blue-500'} text-white text-xs px-2 py-1 rounded-full">
      {label}
    </div>
  {/if}
  
  {#if !visible}
    <!-- Skeleton header -->
    <div class="bg-gray-300 dark:bg-gray-700 rounded-md h-8 w-2/3 mb-8"></div>
    
    <!-- Skeleton content -->
    <div class="relative w-full h-full">
      {#each lines as line}
        <div 
          class="bg-gray-300 dark:bg-gray-700 rounded-sm absolute"
          style="width: {line.width}px; height: 4px; top: {line.top}px;"
        ></div>
      {/each}
    </div>
  {:else}
    <!-- Actual content -->
    <h2 class="text-xl font-bold mb-4">{title}</h2>
    <div class="space-y-3">
      <slot></slot>
    </div>
  {/if}
</div> 