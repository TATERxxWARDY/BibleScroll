<script>
  import { cn } from '$lib/utils';
  
  export let className = '';
</script>

<h2 class={cn("text-lg font-semibold leading-none tracking-tight", className)} {...$$restProps}>
  <slot />
</h2> 