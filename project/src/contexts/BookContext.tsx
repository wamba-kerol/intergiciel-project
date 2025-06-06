import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookType } from '../types/Book';

interface BookContextType {
  borrowedBooks: BookType[];
  lentBooks: BookType[];
  borrowBook: (book: BookType) => void;
  returnBook: (bookId: string) => void;
  lendBook: (book: BookType, borrower: string) => void;
  retrieveBook: (bookId: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<BookType[]>([]);
  const [lentBooks, setLentBooks] = useState<BookType[]>([]);

  const borrowBook = (book: BookType) => {
    setBorrowedBooks(prev => [...prev, { ...book, borrowDate: new Date(), returnDate: undefined }]);
  };

  const returnBook = (bookId: string) => {
    setBorrowedBooks(prev => 
      prev.map(book => 
        book.id === bookId 
          ? { ...book, returnDate: new Date() } 
          : book
      )
    );
  };

  const lendBook = (book: BookType, borrower: string) => {
    setLentBooks(prev => [...prev, { ...book, borrower, borrowDate: new Date(), returnDate: undefined }]);
  };

  const retrieveBook = (bookId: string) => {
    setLentBooks(prev => 
      prev.map(book => 
        book.id === bookId 
          ? { ...book, returnDate: new Date() } 
          : book
      )
    );
  };

  return (
    <BookContext.Provider value={{
      borrowedBooks,
      lentBooks,
      borrowBook,
      returnBook,
      lendBook,
      retrieveBook,
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};
