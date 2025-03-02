<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { cn } from '$lib/utils';
  
  // Props
  export let open = false;
  export let closeOnEscape = true;
  export let closeOnOutsideClick = true;
  export let className = '';
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Dialog elements
  let dialog;
  let overlay;
  let previousActiveElement;
  
  // Focus trap logic
  let focusableElements = [];
  
  $: if (open) {
    showDialog();
  } else {
    hideDialog();
  }
  
  // When the component is first mounted
  onMount(() => {
    if (open) showDialog();
    
    return () => {
      // Cleanup on component destruction
      if (previousActiveElement) previousActiveElement.focus();
    };
  });
  
  // Show the dialog
  async function showDialog() {
    // Store the currently focused element to restore later
    previousActiveElement = document.activeElement;
    
    // Set up event listeners
    document.addEventListener('keydown', handleKeyDown);
    
    // Wait for DOM update
    await tick();
    
    // Get all focusable elements in the dialog
    if (dialog) {
      focusableElements = [...dialog.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )].filter(el => !el.hasAttribute('disabled'));
      
      // Focus the first element or the dialog itself
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        dialog.focus();
      }
    }
    
    // Prevent body scrolling
    document.body.classList.add('overflow-hidden');
    
    // Animate in
    if (overlay) overlay.classList.add('opacity-100');
    if (dialog) dialog.classList.add('opacity-100', 'translate-y-0');
  }
  
  // Hide the dialog
  function hideDialog() {
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    
    // Allow body scrolling again
    document.body.classList.remove('overflow-hidden');
    
    // Restore focus
    if (previousActiveElement) previousActiveElement.focus();
  }
  
  // Close the dialog
  function handleClose() {
    open = false;
    dispatch('close');
  }
  
  // Handle key presses
  function handleKeyDown(e) {
    if (!open) return;
    
    // Handle Escape key
    if (e.key === 'Escape' && closeOnEscape) {
      e.preventDefault();
      handleClose();
      return;
    }
    
    // Handle Tab key for focus trapping
    if (e.key === 'Tab' && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift+tab on first element, focus the last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab on last element, focus the first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  // Handle overlay click
  function handleOverlayClick(e) {
    if (closeOnOutsideClick && e.target === overlay) {
      handleClose();
    }
  }
</script>

{#if open}
  <div 
    bind:this={overlay}
    class="fixed inset-0 z-50 bg-black/50 opacity-0 transition-opacity duration-200 ease-in-out"
    on:click={handleOverlayClick}
    role="presentation"
    aria-hidden="true"
  >
    <div 
      bind:this={dialog}
      class={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg opacity-0 -translate-y-4 transition-all duration-200 ease-in-out dark:bg-gray-800", 
        className
      )}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <slot />
      
      <button 
        type="button"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
        on:click={handleClose}
        aria-label="Close dialog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  </div>
{/if}

<slot name="trigger">
  <!-- This slot is used to render a trigger for the dialog -->
</slot> 