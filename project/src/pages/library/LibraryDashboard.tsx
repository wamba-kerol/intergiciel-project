import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Book, Trash2, Edit, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';

const LibraryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { books, loans, addBook, updateBook, deleteBook } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour le formulaire
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    coverUrl: '',
    description: '',
    available: true
  });
  
  // Fonctions pour gérer le formulaire
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookForm({ ...bookForm, [name]: value });
  };
  
  const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookForm({ ...bookForm, available: e.target.checked });
  };
  
  // Fonction pour préparer l'édition d'un livre
  const handleEditBook = (book: typeof books[0]) => {
    setBookForm({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      description: book.description,
      available: book.available
    });
    setEditingBook(book.id);
    setShowModal(true);
  };
  
  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      coverUrl: '',
      description: '',
      available: true
    });
    setEditingBook(null);
  };
  
  // Fonction pour gérer la soumission du formulaire
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBook) {
      updateBook(editingBook, bookForm);
    } else {
      addBook(bookForm);
    }
    
    resetForm();
    setShowModal(false);
  };
  
  // Fonction pour filtrer les livres en fonction du terme de recherche
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="library" withSearch={false} />
      
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:flex md:items-center md:justify-between"
          >
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Tableau de bord - Gestion de Bibliothèque
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Gérez votre catalogue de livres et les emprunts
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Ajouter un livre
              </motion.button>
            </div>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto sm:px-6 lg:px-8"
        >
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {/* Barre de recherche */}
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
                
                {/* Tableau des livres */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Livre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBooks.map((book) => (
                        <tr key={book.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={book.coverUrl} alt={book.title} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{book.author}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">{book.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {book.available ? 'Disponible' : 'Emprunté'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditBook(book)}
                              className="text-blue-800 hover:text-blue-900 mr-3"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteBook(book.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBooks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            {searchTerm ? 'Aucun livre ne correspond à votre recherche' : 'Aucun livre disponible'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingBook ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
                </h3>
                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={bookForm.title}
                      onChange={handleBookChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">Auteur</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={bookForm.author}
                      onChange={handleBookChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700">URL de la couverture</label>
                    <input
                      type="url"
                      id="coverUrl"
                      name="coverUrl"
                      value={bookForm.coverUrl}
                      onChange={handleBookChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={bookForm.description}
                      onChange={handleBookChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={bookForm.available}
                      onChange={handleAvailableChange}
                      className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                      Disponible
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setShowModal(false);
                      }}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                    >
                      {editingBook ? 'Enregistrer' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryDashboard;