import React from 'react';
import { motion } from 'framer-motion';
import { Edit, User, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  createdAt?: string;
  updatedAt?: string;
  subjects?: Subject[];
}

interface Subject {
  id: string;
  name: string;
  classroom: string;
  schedule: string;
  studentsCount: number;
}

interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  returnDate: string;
  returned: boolean;
  requestDate?: string;
  status?: string;
  bookTitle: string;
}

// Données mockées
const mockProfile: UserProfile = {
  id: '1',
  name: 'Ced',
  email: 'ced@example.com',
  role: 'teacher',
  createdAt: '2024-06-01T10:00:00Z',
  updatedAt: '2024-06-06T14:30:00Z',
  subjects: [
    {
      id: '1',
      name: 'Introduction à la Programmation',
      classroom: 'Amphi A',
      schedule: 'Lundi 14h-16h',
      studentsCount: 25
    },
    {
      id: '2',
      name: 'Algorithmes et Structures de Données',
      classroom: 'Salle 203',
      schedule: 'Mercredi 10h-12h',
      studentsCount: 30
    },
    {
      id: '3',
      name: 'Réseaux Informatiques',
      classroom: 'Salle 205',
      schedule: 'Vendredi 14h-16h',
      studentsCount: 28
    }
  ]
};

const mockBorrowings: Loan[] = [
  {
    id: '1',
    bookId: '101',
    userId: '1',
    loanDate: '2024-06-06T14:30:00Z',
    returnDate: '2024-06-13T14:30:00Z',
    returned: false,
    requestDate: '2024-06-05T10:00:00Z',
    status: 'pending',
    bookTitle: 'Introduction à la Programmation'
  },
  {
    id: '2',
    bookId: '102',
    userId: '1',
    loanDate: '2024-06-02T14:30:00Z',
    returnDate: '2024-06-09T14:30:00Z',
    returned: false,
    requestDate: '2024-06-01T10:00:00Z',
    status: 'approved',
    bookTitle: 'Algorithmes et Structures de Données'
  }
];

const mockBorrows: Loan[] = [
  {
    id: '3',
    bookId: '103',
    userId: '1',
    loanDate: '2024-05-20T14:30:00Z',
    returnDate: '2024-05-30T14:30:00Z',
    returned: true,
    bookTitle: 'Mathématiques pour l\'Informatique'
  },
  {
    id: '4',
    bookId: '104',
    userId: '1',
    loanDate: '2024-05-01T14:30:00Z',
    returnDate: '2024-05-15T14:30:00Z',
    returned: true,
    bookTitle: 'Réseaux Informatiques'
  }
];

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // États avec données mockées
  const profile = mockProfile;
  const borrowings = mockBorrowings;
  const borrows = mockBorrows;
//   const activeView = 'all' as const;

  const isOwnProfile = currentUser?.id === userId;
  const canEdit = isOwnProfile;

  const handleEdit = () => {
    if (userId) {
      navigate(`/profile/${userId}/edit`);
    }
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-2">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
//           <p className="text-gray-500">Chargement du profil...</p>
//         </div>
//       </div>
//     );
//   }
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar type="education" withSearch={false} />
      <div className="flex flex-1 overflow-hidden pt-16">
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-800 mr-2" />
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Profil de {profile?.name || 'Utilisateur'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {profile?.email} {profile?.role && `(${profile?.role})`}
                    {profile?.createdAt && (
                      <span className="ml-2">
                        <small className="text-gray-500">
                          Inscrit depuis {new Date(profile.createdAt).toLocaleDateString()}
                        </small>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {canEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="ml-2 mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  <Edit className="-ml-1 mr-2 h-5 w-5" />
                  Modifier le profil
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
            {profile?.role === 'teacher' ? (
              <>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Mes matières enseignées
                  </h3>
                  {profile?.subjects?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune matière enseignée actuellement.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Matière
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Salle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Horaires
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Étudiants
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {profile?.subjects?.map((subject) => (
                            <tr key={subject.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {subject.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subject.classroom}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subject.schedule}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subject.studentsCount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Demandes d'emprunt
                  </h3>
                  {borrowings.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune demande d'emprunt trouvée.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Livre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date de demande
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {borrowings.map((borrowing) => (
                            <tr key={borrowing.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {borrowing.bookTitle || 'Inconnue'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {borrowing.requestDate
                                  ? new Date(borrowing.requestDate).toLocaleString()
                                  : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {borrowing.status || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="px-4 py-5 sm:p-6">
                  <h3 className="sm:text-lg font-medium text-gray-900 mb-4">
                    Historique des emprunts
                  </h3>
                  {borrows.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucun emprunt trouvé.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Livre
                            </th>
                            <th className="px-6 py-3 text-left sm:text-xs font-medium text-gray-500 sm:uppercase tracking-wider">
                              Date d'emprunt
                            </th>
                            <th className="px-6 py-3 text-left sm:text-xs font-medium text-gray-500 sm:uppercase tracking-wider">
                              Date de retour prévue
                            </th>
                            <th className="px-6 py-3 text-left sm:text-xs font-medium text-gray-500 sm:uppercase tracking-wider">
                              Date de retour
                            </th>
                          </tr>
                        </thead>
                        <tbody className="sm:bg-white sm:divide-y divide-gray-200">
                          {borrows.map((borrow) => (
                            <tr key={borrow.id}>
                              <td className="px-6 py-4 sm:whitespace-nowrap text-sm font-medium sm:text-gray-900">
                                {borrow.bookTitle || 'Inconnue'}
                              </td>
                              <td className="px-6 py-4 sm:whitespace-nowrap text-sm text-gray-500">
                                {borrow.loanDate
                                  ? new Date(borrow.loanDate).toLocaleString()
                                  : 'N/A'}
                              </td>
                              <td className="sm:px-0 py-6 py-4 sm:whitespace-nowrap text-sm text-gray-500">
                                {borrow.returnDate
                                  ? new Date(borrow.returnDate).toLocaleString()
                                  : 'N/A'}
                              </td>
                              <td className="px-6 py-4 sm:whitespace-nowrap sm:text-sm text-gray-500">
                                {borrow.returned && borrow.returnDate
                                  ? new Date(borrow.returnDate).toLocaleString()
                                  : 'Non retourné'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Demandes d'emprunt
              </h3>
              {borrowings.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucune demande d'emprunt trouvée.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Livre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de demande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {borrowings.map((borrowing) => (
                        <tr key={borrowing.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {borrowing.bookTitle || 'Inconnue'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {borrowing.requestDate
                              ? new Date(borrowing.requestDate).toLocaleString()
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {borrowing.status || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="sm:text-lg font-medium text-gray-900 mb-4">
                Historique des emprunts
              </h3>
              {borrows.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun emprunt trouvé.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Livre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'emprunt
                          </th>
                        <th className="px-6 py-3 text-left sm:text-xs font-medium text-gray-500 sm:uppercase tracking-wider">
                          Date de retour prévue
                        </th>
                        <th className="px-6 py-3 text-left sm:text-xs font-medium text-gray-500 sm:uppercase tracking-wider">
                          Date de retour
                        </th>
                      </tr>
                    </thead>
                    <tbody className="sm:bg-white sm:divide-y divide-gray-200">
                      {borrows.map((borrow) => (
                        <tr key={borrow.id}>
                          <td className="px-6 py-4 sm:whitespace-nowrap text-sm font-medium sm:text-gray-900">
                            {borrow.bookTitle || 'Inconnue'}
                          </td>
                          <td className="px-6 py-4 sm:whitespace-nowrap text-sm text-gray-500">
                          {borrow.loanDate
                            ? new Date(borrow.loanDate).toLocaleString()
                            : 'N/A'}
                          </td>
                          <td className="sm:px-0 py-6 py-4 sm:whitespace-nowrap text-sm text-gray-500">
                            {borrow.returnDate
                              ? new Date(borrow.returnDate).toLocaleString()
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 sm:whitespace-nowrap sm:text-sm text-gray-500">
                            {borrow.returned && borrow.returnDate
                              ? new Date(borrow.returnDate).toLocaleString()
                              : 'Non retourné'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfilePage);