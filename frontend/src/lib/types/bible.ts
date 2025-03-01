export interface Chapter {
    number: number;
    text: string;
  }
  
  export interface Book {
    name: string;
    chapters: Chapter[];
  }
  
  export interface Testament {
    name: string;
    books: Book[];
  }
  
  export interface Bible {
    testaments: Testament[];
  }