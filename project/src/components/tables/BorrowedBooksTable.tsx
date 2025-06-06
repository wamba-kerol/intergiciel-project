import { BookType } from '@/types/Book';
import { useBookContext } from '../../contexts/BookContext';

interface BorrowedBooksTableProps {
  books: BookType[];
}

const BorrowedBooksTable: React.FC<BorrowedBooksTableProps> = ({ books }: { books: BookType[] }) => {
  const { returnBook } = useBookContext();

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'emprunt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date de retour
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {book.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {book.borrowDate?.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {book.returnDate ? book.returnDate.toLocaleDateString() : 'Non retourné'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => returnBook(book.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  disabled={!!book.returnDate}
                >
                  Rendre
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedBooksTable;
