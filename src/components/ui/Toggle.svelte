<script>
  import { cn } from '$lib/utils';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props with defaults
  export let pressed = false;
  export let variant = "default";
  export let size = "default";
  export let disabled = false;
  export let className = "";
  export let ariaLabel = "Toggle";
  
  // Variant classes
  const variantClasses = {
    default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
  };
  
  // Size classes
  const sizeClasses = {
    default: "h-10 px-3",
    sm: "h-8 px-2",
    lg: "h-12 px-4"
  };
  
  // Construct the class string
  $: toggleClass = cn(
    // Base styles
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    // Variant styles
    variantClasses[variant],
    // Size styles
    sizeClasses[size],
    // Pressed state
    pressed && "bg-accent text-accent-foreground",
    // Custom class passed as prop
    className
  );
  
  function handleToggle() {
    if (!disabled) {
      pressed = !pressed;
      dispatch('pressedChange', pressed);
    }
  }
</script>

<button 
  type="button" 
  class={toggleClass} 
  {disabled} 
  aria-pressed={pressed}
  aria-label={ariaLabel}
  on:click={handleToggle}
  on:keydown={(e) => e.key === 'Enter' && handleToggle()}
  tabindex="0"
  {...$$restProps}
>
  <slot />
</button> 