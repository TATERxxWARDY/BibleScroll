<script lang="ts">
  // Props
  export let lines: number = 10;
  export let density: 'high' | 'medium' | 'low' = 'medium';
  export let width: string = '100%';
  export let fontSize: string = 'text-base';
  
  // Calculate line height based on font size
  function getLineHeight() {
    switch(fontSize) {
      case 'text-xs': return 'h-1';
      case 'text-sm': return 'h-1.5';
      case 'text-base': return 'h-2';
      case 'text-lg': return 'h-2.5';
      case 'text-xl': return 'h-3';
      default: return 'h-2';
    }
  }
  
  // Calculate gap between lines
  function getGap() {
    switch(fontSize) {
      case 'text-xs': return 'gap-0.5';
      case 'text-sm': return 'gap-1';
      case 'text-base': return 'gap-1.5';
      case 'text-lg': return 'gap-2';
      case 'text-xl': return 'gap-2.5';
      default: return 'gap-1.5';
    }
  }
  
  // Calculate line width variations based on density
  function getLineWidths() {
    const widths = [];
    for (let i = 0; i < lines; i++) {
      let lineWidth;
      
      // Last line is usually shorter
      if (i === lines - 1) {
        lineWidth = Math.random() * 30 + 40; // 40-70%
      } else {
        switch(density) {
          case 'high':
            lineWidth = Math.random() * 10 + 90; // 90-100%
            break;
          case 'medium':
            lineWidth = Math.random() * 20 + 80; // 80-100%
            break;
          case 'low':
            lineWidth = Math.random() * 40 + 60; // 60-100%
            break;
          default:
            lineWidth = Math.random() * 20 + 80; // 80-100%
        }
      }
      
      widths.push(`${lineWidth}%`);
    }
    return widths;
  }
  
  const lineWidths = getLineWidths();
</script>

<div class="flex flex-col {getGap()}" style="width: {width};">
  {#each lineWidths as lineWidth, i}
    <div 
      class="bg-gray-300 dark:bg-gray-700 rounded {getLineHeight()} transition-colors duration-300"
      style="width: {lineWidth};"
    ></div>
  {/each}
</div>