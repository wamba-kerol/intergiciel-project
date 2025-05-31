import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BookTable from '../../components/books/bookTable';
import BookModal from '../../components/books/BookModal';

interface BookFormData {
  id?: string;
  title: string;
  author: string;
  description: string;
  available: boolean;
}

const LibraryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { books, loans, addBook, updateBook, deleteBook, borrowBook } = useData();
  
  const [activeView, setActiveView] = useState<'all' | 'my-books'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  const [bookForm, setBookForm] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    available: true
  });

  const getUserBooks = useCallback((userId: string) => {
    return books.filter(book => {
      const bookLoans = loans.filter(loan => loan.bookId === book.id && !loan.returned);
      return bookLoans.some(loan => loan.userId === userId);
    });
  }, [books, loans]);

  const getAvailableBooks = useCallback(() => {
    return books.filter(book => book.available);
  }, [books]);

  const getDisplayedBooks = useCallback(() => {
    if (!currentUser) return [];
    
    let booksToDisplay = activeView === 'my-books' 
      ? getUserBooks(currentUser.id)
      : getAvailableBooks();
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      booksToDisplay = booksToDisplay.filter(book => 
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.description && book.description.toLowerCase().includes(term))
      );
    }
    
    return booksToDisplay;
  }, [activeView, currentUser, getAvailableBooks, getUserBooks, searchTerm]);

  const displayedBooks = useMemo(() => getDisplayedBooks(), [getDisplayedBooks]);

  const resetForm = useCallback(() => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      available: true
    });
    setEditingBookId(null);
  }, []);

  const handleEditBook = useCallback((book: BookFormData) => {
    if (!book.id) return;
    
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      available: book.available
    });
    setEditingBookId(book.id);
    setShowModal(true);
  }, []);

  const handleBookSubmit = useCallback(async (formData: BookFormData) => {
    try {
      if (editingBookId) {
        await updateBook(editingBookId, formData);
      } else {
        await addBook(formData);
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  }, [addBook, editingBookId, resetForm, updateBook]);

  const handleBorrowBook = useCallback(async (bookId: string) => {
    if (currentUser) {
      try {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 14);
        await borrowBook(bookId, currentUser.id, returnDate.toISOString());
      } catch (error) {
        console.error('Error borrowing book:', error);
      }
    }
  }, [borrowBook, currentUser]);

  useEffect(() => {
    const initializeExampleBooks = async () => {
      if (books.length > 0 || initialized) return;

      const exampleBooks: BookFormData[] = [
        {
          title: 'Le Petit Prince',
          author: 'Antoine de Saint-Exupéry',
          description: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.',
          available: true
        },
        {
          title: '1984',
          author: 'George Orwell',
          description: 'Une dystopie classique sur une société totalitaire et la surveillance de masse.',
          available: true
        },
        {
          title: 'Harry Potter à l\'école des sorciers',
          author: 'J.K. Rowling',
          description: 'Le premier tome de la saga fantastique sur le jeune sorcier Harry Potter.',
          available: false
        }
      ];

      try {
        for (const book of exampleBooks) {
          await addBook(book);
        }
        setInitialized(true);
      } catch (err) {
        console.error('Error initializing example books:', err);
      }
    };

    initializeExampleBooks();
  }, [addBook, books.length, initialized]);

  useEffect(() => {
    setSearchTerm('');
  }, [activeView]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar type="library" withSearch={false} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {activeView === 'my-books' ? 'Mes Livres' : 'Catalogue de Livres'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeView === 'my-books' 
                    ? 'Gérez votre collection personnelle de livres' 
                    : 'Parcourez les livres disponibles à l\'emprunt'}
                </p>
              </div>
              
              {activeView === 'my-books' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Ajouter un livre
                </motion.button>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="max-w-lg w-full lg:max-w-xs mb-6">
                <label htmlFor="search" className="sr-only">Rechercher</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
                    placeholder="Rechercher un livre..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <BookTable 
                books={displayedBooks}
                currentUserId={currentUser?.id || ''}
                currentView={activeView}
                onEdit={handleEditBook}
                onDelete={deleteBook}
                onBorrow={handleBorrowBook}
              />
            </div>
          </motion.div>
        </main>
      </div>
      
      <BookModal 
        isOpen={showModal}
        isEditing={!!editingBookId}
        initialData={bookForm}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleBookSubmit}
      />
    </div>
  );
};

export default LibraryDashboard;