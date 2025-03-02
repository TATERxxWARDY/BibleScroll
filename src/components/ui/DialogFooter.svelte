<script>
  import { cn } from '$lib/utils';
  
  export let className = '';
</script>

<div class={cn("mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...$$restProps}>
  <slot />
</div> 