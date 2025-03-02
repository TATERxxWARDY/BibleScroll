<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { cn } from '$lib/utils';
  
  // Props
  export let type = 'single'; // 'single' or 'multiple'
  export let defaultValue = undefined;
  export let collapsible = false;
  export let value = undefined;
  export let className = '';
  
  const dispatch = createEventDispatcher();
  
  // Internal state
  let accordionItems = [];
  let openItems = new Set(Array.isArray(value || defaultValue) ? (value || defaultValue) : [(value || defaultValue)]);
  
  // Register an accordion item
  function registerItem(id) {
    accordionItems = [...accordionItems, id];
    return function unregister() {
      accordionItems = accordionItems.filter(item => item !== id);
    };
  }
  
  // Toggle an accordion item
  function toggleItem(id) {
    if (type === 'single') {
      if (openItems.has(id) && collapsible) {
        openItems.delete(id);
      } else {
        openItems = new Set([id]);
      }
    } else if (type === 'multiple') {
      if (openItems.has(id)) {
        openItems.delete(id);
      } else {
        openItems.add(id);
      }
    }
    
    // Create a new set to trigger reactivity
    openItems = new Set(openItems);
    
    // Dispatch change event
    const valueToEmit = type === 'multiple' 
      ? Array.from(openItems) 
      : Array.from(openItems)[0] || undefined;
    
    dispatch('valueChange', valueToEmit);
    value = valueToEmit;
  }
  
  // Update open items when value changes externally
  $: {
    if (value !== undefined) {
      openItems = new Set(Array.isArray(value) ? value : [value]);
    }
  }
  
  // Context for child components
  const context = {
    registerItem,
    toggleItem,
    isOpen: (id) => openItems.has(id)
  };
  
  // Set context
  import { setContext } from 'svelte';
  setContext('accordion', context);
</script>

<div class={cn('space-y-1', className)} {...$$restProps}>
  <slot />
</div> 