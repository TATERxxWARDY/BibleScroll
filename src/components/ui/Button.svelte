<script>
  import { cn } from '$lib/utils';
  
  // Props with defaults
  export let type = "button";
  export let variant = "default";
  export let size = "default";
  export let disabled = false;
  export let className = "";
  
  // Variant classes
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  };
  
  // Size classes
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };
  
  // Construct the class string
  const buttonClass = cn(
    // Base styles
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    // Variant styles
    variantClasses[variant],
    // Size styles
    sizeClasses[size],
    // Custom class passed as prop
    className
  );
</script>

<button 
  type={type} 
  class={buttonClass} 
  {disabled} 
  on:click 
  on:keydown 
  on:focus 
  on:blur
  {...$$restProps}
>
  <slot />
</button> 