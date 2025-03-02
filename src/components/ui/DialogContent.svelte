<script>
  import { cn } from '$lib/utils';
  
  export let className = '';
</script>

<div class={cn("relative", className)} {...$$restProps}>
  <slot />
</div> 