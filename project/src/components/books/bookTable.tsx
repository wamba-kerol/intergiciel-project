import React from 'react';
import { Book, Edit, Trash2 } from 'lucide-react';

interface BookType {
  id: string;
  title: string;
  author: string;
  description: string;
  available: boolean;
  userId?: string;
}

interface BookTableProps {
  books: BookType[];
  currentUserId: string;
  currentView: 'all' | 'my-books';
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
  onBorrow: (id: string) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  currentView,
  onEdit,
  onDelete,
  onBorrow
}) => {
  return (
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
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                   
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
                  {currentView === 'my-books' ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onEdit(book)}
                        className="text-blue-800 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onBorrow(book.id)}
                      disabled={!book.available}
                      className={`text-blue-800 hover:text-blue-900 ${!book.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Emprunter"
                    >
                      <Book className="h-5 w-5" />
                      <span className="ml-1">Emprunter</span>
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                {currentView === 'my-books' 
                  ? 'Vous n\'avez pas encore de livres dans votre bibliothèque' 
                  : 'Aucun livre disponible'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;