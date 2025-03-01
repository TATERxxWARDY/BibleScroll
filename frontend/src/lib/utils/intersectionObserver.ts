export function setupIntersectionObserver(scrollContainer: HTMLElement, callback: (visibleChapters: Record<string, boolean>) => void) {
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
      threshold: 0.1
    });
    
    function observe() {
      document.querySelectorAll('.chapter-container').forEach(el => {
        observer.observe(el);
      });
    }
    
    function disconnect() {
      observer.disconnect();
    }
    
    return { observe, disconnect };
  }