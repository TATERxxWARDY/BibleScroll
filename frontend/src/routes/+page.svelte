<script lang="ts">
  import '$lib/styles/transitions.css';
  import '../app.css';
  import { onMount } from 'svelte';
  import ZoomControls from '$lib/components/ZoomControls.svelte';
  import VirtualScroll from '$lib/components/VirtualScroll.svelte';
  import DragScroll from '$lib/components/DragScroll.svelte';
  import TextPlaceholder from '$lib/components/TextPlaceholder.svelte';
  import { setupIntersectionObserver } from '$lib/utils/intersectionObserver';
  import { Moon, Sun, ZoomIn, ZoomOut } from 'lucide-svelte';
  
  // Constants for zoom levels (matching the example)
  const ZOOM_LEVELS = {
    CHAPTER: 'chapter',
    BOOK: 'book',
    TESTAMENT: 'testament',
    BIBLE: 'bible',
  };
  
  // State management
  let darkMode = false;
  let zoomLevel: string = ZOOM_LEVELS.CHAPTER;
  let scrollContainer: HTMLElement;
  let containerWidth = 0;
  let containerHeight = 0;
  let currentVisibleItems: any[] = [];
  let isScrolling = false;
  let isLoading = true;
  
  // Sample Bible data structure (would be replaced with actual data from backend)
  const bibleData = {
    testaments: [
      {
        name: 'Old Testament',
        books: [
          {
            name: 'Genesis',
            chapters: [
              { number: 1, text: 'In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. And God said, Let there be light: and there was light. And God saw the light, that it was good: and God divided the light from the darkness. And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day. And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so. And God called the firmament Heaven. And the evening and the morning were the second day.' },
              { number: 2, text: 'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made. And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made. These are the generations of the heavens and of the earth when they were created, in the day that the LORD God made the earth and the heavens, And every plant of the field before it was in the earth, and every herb of the field before it grew: for the LORD God had not caused it to rain upon the earth, and there was not a man to till the ground.' },
              { number: 3, text: 'Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden? And the woman said unto the serpent, We may eat of the fruit of the trees of the garden: But of the fruit of the tree which is in the midst of the garden, God hath said, Ye shall not eat of it, neither shall ye touch it, lest ye die. And the serpent said unto the woman, Ye shall not surely die: For God doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil.' },
              // More chapters would be here
            ]
          },
          {
            name: 'Exodus',
            chapters: [
              { number: 1, text: 'Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob. Reuben, Simeon, Levi, and Judah, Issachar, Zebulun, and Benjamin, Dan, and Naphtali, Gad, and Asher. And all the souls that came out of the loins of Jacob were seventy souls: for Joseph was in Egypt already. And Joseph died, and all his brethren, and all that generation. And the children of Israel were fruitful, and increased abundantly, and multiplied, and waxed exceeding mighty; and the land was filled with them.' },
              { number: 2, text: 'And there went a man of the house of Levi, and took to wife a daughter of Levi. And the woman conceived, and bare a son: and when she saw him that he was a goodly child, she hid him three months. And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid it in the flags by the river\'s brink. And his sister stood afar off, to wit what would be done to him.' },
              // More chapters would be here
            ]
          },
          // More books would be here
        ]
      },
      {
        name: 'New Testament',
        books: [
          {
            name: 'Matthew',
            chapters: [
              { number: 1, text: 'The book of the generation of Jesus Christ, the son of David, the son of Abraham. Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren; And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram; And Aram begat Aminadab; and Aminadab begat Naasson; and Naasson begat Salmon; And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth; and Obed begat Jesse; And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;' },
              { number: 2, text: 'Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men from the east to Jerusalem, Saying, Where is he that is born King of the Jews? for we have seen his star in the east, and are come to worship him. When Herod the king had heard these things, he was troubled, and all Jerusalem with him. And when he had gathered all the chief priests and scribes of the people together, he demanded of them where Christ should be born.' },
              // More chapters would be here
            ]
          },
          {
            name: 'Mark',
            chapters: [
              { number: 1, text: 'The beginning of the gospel of Jesus Christ, the Son of God; As it is written in the prophets, Behold, I send my messenger before thy face, which shall prepare thy way before thee. The voice of one crying in the wilderness, Prepare ye the way of the Lord, make his paths straight. John did baptize in the wilderness, and preach the baptism of repentance for the remission of sins.' },
              { number: 2, text: 'And again he entered into Capernaum after some days; and it was noised that he was in the house. And straightway many were gathered together, insomuch that there was no room to receive them, no, not so much as about the door: and he preached the word unto them. And they come unto him, bringing one sick of the palsy, which was borne of four. And when they could not come nigh unto him for the press, they uncovered the roof where he was: and when they had broken it up, they let down the bed wherein the sick of the palsy lay.' },
              // More chapters would be here
            ]
          },
          // More books would be here
        ]
      }
    ]
  };
  
  // Toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Zoom in (more detail)
  function zoomIn() {
    if (zoomLevel === ZOOM_LEVELS.BOOK) {
      setZoomLevel(ZOOM_LEVELS.CHAPTER);
    } else if (zoomLevel === ZOOM_LEVELS.TESTAMENT) {
      setZoomLevel(ZOOM_LEVELS.BOOK);
    } else if (zoomLevel === ZOOM_LEVELS.BIBLE) {
      setZoomLevel(ZOOM_LEVELS.TESTAMENT);
    }
  }
  
  // Zoom out (less detail)
  function zoomOut() {
    if (zoomLevel === ZOOM_LEVELS.CHAPTER) {
      setZoomLevel(ZOOM_LEVELS.BOOK);
    } else if (zoomLevel === ZOOM_LEVELS.BOOK) {
      setZoomLevel(ZOOM_LEVELS.TESTAMENT);
    } else if (zoomLevel === ZOOM_LEVELS.TESTAMENT) {
      setZoomLevel(ZOOM_LEVELS.BIBLE);
    }
  }
  
  // Handle zoom level change
  function setZoomLevel(level: string) {
    zoomLevel = level;
  }
  
  // Handle visibility change from VirtualScroll
  function handleVisibilityChange(event: CustomEvent) {
    currentVisibleItems = event.detail.visibleItems;
  }
  
  // Handle drag events
  function handleDragStart() {
    isScrolling = true;
    if (scrollContainer) {
      scrollContainer.classList.remove('cursor-grab');
      scrollContainer.classList.add('cursor-grabbing');
    }
  }
  
  function handleDragging() {
    isScrolling = true;
  }
  
  function handleDragEnd() {
    if (scrollContainer) {
      scrollContainer.classList.add('cursor-grab');
      scrollContainer.classList.remove('cursor-grabbing');
    }
    
    setTimeout(() => {
      isScrolling = false;
    }, 300); // Small delay to prevent flickering
  }
  
  // Handle window resize
  function handleResize() {
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight;
  }
  
  // Get zoom level label
  function getZoomLevelLabel() {
    switch(zoomLevel) {
      case ZOOM_LEVELS.CHAPTER:
        return "Chapter View";
      case ZOOM_LEVELS.BOOK:
        return "Book View";
      case ZOOM_LEVELS.TESTAMENT:
        return "Testament View";
      case ZOOM_LEVELS.BIBLE:
        return "Full Bible View";
      default:
        return "Chapter View";
    }
  }
  
  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Prevent default scroll behavior
    document.body.style.overflow = 'hidden';
    
    // Simulate loading
    setTimeout(() => {
      isLoading = false;
    }, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<svelte:window on:resize={handleResize} />

<div 
  class="h-screen w-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
  class:dark={darkMode}
>
  {#if isLoading}
    <div class="h-full w-full flex items-center justify-center">
      <div class="text-gray-700 dark:text-gray-300 text-center">
        <div class="inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-500 dark:border-t-gray-300 rounded-full animate-spin mb-4"></div>
        <div>Loading Bible text...</div>
      </div>
    </div>
  {:else}
    <!-- Header with controls -->
    <div class="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-200">Bible Scroll</h1>
        <span class="text-sm text-gray-500 dark:text-gray-400">{getZoomLevelLabel()}</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Zoom controls -->
        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-2">
          <button 
            on:click={zoomIn}
            class="btn btn-icon btn-ghost rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            disabled={zoomLevel === ZOOM_LEVELS.CHAPTER}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          
          <button 
            on:click={zoomOut}
            class="btn btn-icon btn-ghost rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            disabled={zoomLevel === ZOOM_LEVELS.BIBLE}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
        </div>
        
        <!-- Dark mode toggle -->
        <button 
          on:click={toggleDarkMode}
          class="btn btn-icon btn-ghost rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if darkMode}
            <Sun size={18} />
          {:else}
            <Moon size={18} />
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Main scroll container - fixed to allow proper horizontal scrolling -->
    <div 
      bind:this={scrollContainer}
      class="absolute inset-0 pt-14 w-full h-full overflow-x-scroll overflow-y-hidden whitespace-nowrap cursor-grab hide-scrollbar"
      role="region"
      aria-label="Bible scroll viewer"
    >
      {#if scrollContainer}
        <DragScroll 
          {scrollContainer} 
          on:dragStart={handleDragStart}
          on:dragging={handleDragging}
          on:dragEnd={handleDragEnd}
        />
        
        <VirtualScroll 
          {bibleData}
          {zoomLevel}
          {containerWidth}
          {containerHeight}
          {darkMode}
          on:visibilityChange={handleVisibilityChange}
        />
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Global dark mode */
  :global(.dark) {
    color-scheme: dark;
  }
  
  /* Ensure smooth transitions */
  :global(*) {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  
  /* Prevent text selection during dragging */
  .cursor-grab {
    cursor: grab;
    user-select: none;
  }
  
  .cursor-grabbing {
    cursor: grabbing !important;
    user-select: none;
  }
  
  /* Additional text spacing */
  :global(.column-text) {
    column-rule: 1px solid rgba(128, 128, 128, 0.2);
    column-gap: 3rem !important;
  }
  
  :global(p) {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
</style>