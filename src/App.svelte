<script>
  import { onMount } from 'svelte';
  import BibleScroll from './components/BibleScroll.svelte';
  import Dialog from './components/ui/Dialog.svelte';
  import DialogContent from './components/ui/DialogContent.svelte';
  import DialogHeader from './components/ui/DialogHeader.svelte';
  import DialogTitle from './components/ui/DialogTitle.svelte';
  import DialogDescription from './components/ui/DialogDescription.svelte';
  import DialogFooter from './components/ui/DialogFooter.svelte';
  import Button from './components/ui/Button.svelte';
  import './styles/global.css';
  
  let showInfoDialog = false;
  let isDarkTheme = false;
  
  // Any app-level setup can go here
  onMount(() => {
    // Check initial theme on page load
    const theme = localStorage.getItem('theme') || 'light';
    isDarkTheme = theme === 'dark';
    
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    }
  });
  
  // Toggle info dialog
  function toggleInfoDialog() {
    showInfoDialog = !showInfoDialog;
  }

  // Toggle theme between light and dark
  function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<main>
  <BibleScroll />
  
  <!-- Info Dialog -->
  <Dialog bind:open={showInfoDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Bible Scroll Viewer</DialogTitle>
        <DialogDescription>
          Explore the Bible with different zoom levels and panning.
        </DialogDescription>
      </DialogHeader>
      
      <div class="py-4">
        <h3 class="text-sm font-medium mb-2">Zoom Levels:</h3>
        <ul class="list-disc pl-5 text-sm space-y-1">
          <li>Verse View - Shows individual verses</li>
          <li>Chapter View - Shows chapters with their verses</li>
          <li>Book View - Shows books with their chapters</li>
          <li>Testament View - Shows testaments with their books</li>
          <li>Bible View - Shows the entire Bible structure</li>
        </ul>
        
        <h3 class="text-sm font-medium mt-4 mb-2">Navigation:</h3>
        <ul class="list-disc pl-5 text-sm space-y-1">
          <li>Click and drag to pan horizontally</li>
          <li>Use the zoom controls to change detail level</li>
          <li>Toggle between light and dark theme using the theme button</li>
        </ul>
      </div>
      
      <DialogFooter>
        <Button on:click={toggleInfoDialog}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</main> 