<script>
  export let visible = false;
  export let width = 100;
  export let height = 100;
  
  // Generate placeholder lines that look like text
  function generateLines() {
    const lines = [];
    const lineHeight = 4;
    const gap = 2;
    const numLines = Math.floor(height / (lineHeight + gap));
    
    for (let i = 0; i < numLines; i++) {
      // Vary line lengths to make it look more natural
      const lineWidth = Math.random() * 0.3 + 0.7; // Between 70% and 100% of width
      lines.push({
        width: lineWidth * width,
        top: i * (lineHeight + gap)
      });
    }
    
    return lines;
  }
  
  const lines = generateLines();
</script>

{#if !visible}
  <div class="w-full h-full">
    {#each lines as line}
      <div 
        class="bg-gray-300 dark:bg-gray-700 rounded-sm absolute"
        style="width: {line.width}px; height: 4px; top: {line.top}px;"
      ></div>
    {/each}
  </div>
{/if}