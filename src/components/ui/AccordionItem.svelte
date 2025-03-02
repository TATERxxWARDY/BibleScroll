<script>
  import { onMount, onDestroy } from 'svelte';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils';
  
  // Props
  export let value = '';
  export let disabled = false;
  export let className = '';
  
  // Get accordion context
  const accordion = getContext('accordion');
  
  if (!accordion) {
    throw new Error('AccordionItem must be used within an Accordion component');
  }
  
  // Check if this item is open
  $: isOpen = accordion.isOpen(value);
  
  // Register this item with the accordion
  let unregister;
  onMount(() => {
    unregister = accordion.registerItem(value);
  });
  
  onDestroy(() => {
    if (unregister) unregister();
  });
  
  // Toggle this item
  function handleToggle() {
    if (!disabled) {
      accordion.toggleItem(value);
    }
  }
  
  // Context for child components
  const itemContext = {
    isOpen,
    handleToggle,
    disabled
  };
  
  // Set context for children
  import { setContext } from 'svelte';
  setContext('accordionItem', itemContext);
</script>

<div 
  class={cn(
    'border-b',
    className
  )}
  data-state={isOpen ? 'open' : 'closed'}
  data-disabled={disabled ? true : undefined}
  {...$$restProps}
>
  <slot />
</div> 