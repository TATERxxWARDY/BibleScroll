// formatText.ts - Replace with your content
// Utility functions for formatting Bible text 

/**
 * Formats Bible text with verse numbers and proper spacing
 * @param text Raw Bible text
 * @returns Formatted text with verse numbers
 */
export function formatBibleText(text: string): string {
  // This is a placeholder - in a real implementation, you would parse the text
  // and add verse numbers, formatting, etc.
  return text;
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats a Bible reference (book, chapter, verse)
 * @param book Book name
 * @param chapter Chapter number
 * @param verse Optional verse number
 * @returns Formatted reference
 */
export function formatReference(book: string, chapter: number, verse?: number): string {
  if (verse) {
    return `${book} ${chapter}:${verse}`;
  }
  return `${book} ${chapter}`;
}

/**
 * Determines if text should be rendered or replaced with a placeholder
 * based on zoom level and performance considerations
 * @param zoomLevel Current zoom level
 * @param textLength Length of text to render
 * @returns Boolean indicating if text should be rendered
 */
export function shouldRenderText(zoomLevel: string, textLength: number): boolean {
  // These thresholds can be adjusted based on performance testing
  switch(zoomLevel) {
    case 'chapter':
      return true; // Always render at chapter level
    case 'book':
      return textLength < 10000;
    case 'testament':
      return textLength < 1000;
    case 'bible':
      return textLength < 100;
    default:
      return true;
  }
} 