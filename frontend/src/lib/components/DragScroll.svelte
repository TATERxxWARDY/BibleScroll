<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  // Props
  export let scrollContainer: HTMLElement;
  
  // State
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;
  let velocity = 0;
  let lastX: number;
  let lastTimestamp: number;
  let animationFrame: number;
  
  const dispatch = createEventDispatcher();
  
  // Drag to scroll functionality
  function handleMouseDown(e: MouseEvent) {
    startDrag(e.pageX);
    scrollContainer.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none'; // Prevent text selection during drag
    e.preventDefault();
  }
  
  function handleTouchStart(e: TouchEvent) {
    startDrag(e.touches[0].pageX);
    // Don't prevent default here to allow scrolling on mobile
  }
  
  function startDrag(pageX: number) {
    isDragging = true;
    startX = pageX;
    scrollLeft = scrollContainer.scrollLeft;
    lastX = pageX;
    lastTimestamp = Date.now();
    
    // Stop any ongoing inertia animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    dispatch('dragStart');
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    handleDragMove(e.pageX);
    e.preventDefault(); // Prevent unwanted selections
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    handleDragMove(e.touches[0].pageX);
    e.preventDefault(); // Prevent page scrolling
  }
  
  function handleDragMove(pageX: number) {
    const walk = (startX - pageX) * 2; // Multiplier for scroll speed, matching example
    scrollContainer.scrollLeft = scrollLeft + walk;
    
    // Calculate velocity for inertia
    const now = Date.now();
    const elapsed = now - lastTimestamp;
    if (elapsed > 0) {
      velocity = (pageX - lastX) / elapsed * -15; // Adjust multiplier for inertia strength
    }
    lastX = pageX;
    lastTimestamp = now;
    
    dispatch('dragging', { scrollLeft: scrollContainer.scrollLeft });
  }
  
  function handleMouseUp() {
    endDrag();
  }
  
  function handleTouchEnd() {
    endDrag();
  }
  
  function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
    document.body.style.userSelect = ''; // Re-enable text selection
    
    // Apply inertia
    applyInertia();
    
    dispatch('dragEnd');
  }
  
  function applyInertia() {
    if (Math.abs(velocity) < 0.5) return; // Stop if velocity is too low
    
    const inertiaStep = () => {
      velocity *= 0.95; // Friction factor
      
      if (Math.abs(velocity) < 0.5) {
        cancelAnimationFrame(animationFrame);
        return;
      }
      
      scrollContainer.scrollLeft += velocity;
      animationFrame = requestAnimationFrame(inertiaStep);
      
      dispatch('dragging', { scrollLeft: scrollContainer.scrollLeft });
    };
    
    animationFrame = requestAnimationFrame(inertiaStep);
  }
  
  // Handle mouse leaving the window
  function handleMouseLeave() {
    if (isDragging) {
      endDrag();
    }
  }
  
  // Ensure scrolling works with the mousewheel too
  function handleWheel(e: WheelEvent) {
    // Prevent the default vertical scroll
    e.preventDefault();
    
    // Apply horizontal scrolling instead
    scrollContainer.scrollLeft += e.deltaY;
    
    dispatch('dragging', { scrollLeft: scrollContainer.scrollLeft });
  }
  
  onMount(() => {
    // Set initial cursor style
    scrollContainer.style.cursor = 'grab';
    
    // Add event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      // Clean up event listeners
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
</script>

<style>
  /* Add cursor styles */
  :global(.cursor-grab) {
    cursor: grab;
  }
  
  :global(.cursor-grabbing) {
    cursor: grabbing;
    user-select: none;
  }
</style> 