<script>
  import { cn } from '$lib/utils';
  
  export let className = '';
</script>

<p class={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...$$restProps}>
  <slot />
</p> 