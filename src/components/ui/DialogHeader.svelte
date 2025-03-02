<script>
  import { cn } from '$lib/utils';
  
  export let className = '';
</script>

<div class={cn("mb-4 flex flex-col space-y-1.5 text-center sm:text-left", className)} {...$$restProps}>
  <slot />
</div> 