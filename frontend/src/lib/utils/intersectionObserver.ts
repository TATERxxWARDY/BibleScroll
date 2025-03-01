/**
 * Sets up an intersection observer to track which Bible chapters are currently visible
 * @param scrollContainer The container element that scrolls
 * @param callback Function to call when visibility changes
 * @returns Object with observe and disconnect methods
 */
export function setupIntersectionObserver(
  scrollContainer: HTMLElement, 
  callback: (visibleChapters: Record<string, boolean>) => void
) {
  const observer = new IntersectionObserver((entries) => {
    const visibleChapters: Record<string, boolean> = {};
    
    entries.forEach(entry => {
      const chapterId = (entry.target as HTMLElement).dataset.chapterId;
      if (chapterId) {
        visibleChapters[chapterId] = entry.isIntersecting;
      }
    });
    
    callback(visibleChapters);
  }, {
    root: scrollContainer,
    threshold: [0.1, 0.5, 0.9], // Track different visibility thresholds
    rootMargin: '0px'
  });
  
  /**
   * Start observing chapter elements
   */
  function observe() {
    document.querySelectorAll('[data-chapter-id]').forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Stop observing all elements
   */
  function disconnect() {
    observer.disconnect();
  }
  
  /**
   * Update the observer with new elements
   */
  function update() {
    disconnect();
    observe();
  }
  
  return { observe, disconnect, update };
}

/**
 * Creates a unique ID for a Bible chapter
 * @param testament Testament name
 * @param book Book name
 * @param chapter Chapter number
 * @returns Unique chapter ID
 */
export function createChapterId(testament: string, book: string, chapter: number): string {
  return `${testament.toLowerCase().replace(/\s+/g, '-')}_${book.toLowerCase().replace(/\s+/g, '-')}_${chapter}`;
}

/**
 * Parses a chapter ID into its components
 * @param chapterId Chapter ID to parse
 * @returns Object with testament, book, and chapter
 */
export function parseChapterId(chapterId: string): { testament: string, book: string, chapter: number } | null {
  const parts = chapterId.split('_');
  if (parts.length !== 3) return null;
  
  return {
    testament: parts[0].replace(/-/g, ' '),
    book: parts[1].replace(/-/g, ' '),
    chapter: parseInt(parts[2], 10)
  };
}