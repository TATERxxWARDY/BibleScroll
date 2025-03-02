<script>
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils';
  
  // Props
  export let className = '';
  
  // Get accordion item context
  const accordionItem = getContext('accordionItem');
  
  if (!accordionItem) {
    throw new Error('AccordionTrigger must be used within an AccordionItem component');
  }
  
  $: isOpen = accordionItem.isOpen;
  $: disabled = accordionItem.disabled;
  
  // Handle click to toggle
  function handleClick() {
    accordionItem.handleToggle();
  }
  
  // Handle keyboard interaction
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      accordionItem.handleToggle();
    }
  }
</script>

<h3 data-state={isOpen ? 'open' : 'closed'}>
  <button
    type="button"
    class={cn(
      'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
      className
    )}
    {disabled}
    on:click={handleClick}
    on:keydown={handleKeyDown}
    aria-expanded={isOpen}
    tabindex="0"
    {...$$restProps}
  >
    <slot />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4 shrink-0 transition-transform duration-200"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
</h3> 