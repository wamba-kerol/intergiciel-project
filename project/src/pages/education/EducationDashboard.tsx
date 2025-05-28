import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BookOpen, School, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';

const EducationDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { teachers, students, classrooms, courses, addTeacher, addStudent, addClassroom, addCourse } = useData();
  
  const [activeTab, setActiveTab] = useState('teachers');
  const [showModal, setShowModal] = useState(false);
  
  // États pour les formulaires
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', subject: '', classroom: '' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', level: '', subjects: [] });
  const [classroomForm, setClassroomForm] = useState({ name: '', capacity: 30 });
  const [courseForm, setCourseForm] = useState({ name: '', level: '', teacher: '' });
  
  // Fonctions pour gérer les changements dans les formulaires
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
  };
  
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  
  const handleStudentSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setStudentForm({ ...studentForm, subjects: selectedOptions });
  };
  
  const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassroomForm({ 
      ...classroomForm, 
      [e.target.name]: e.target.name === 'capacity' ? parseInt(e.target.value) : e.target.value 
    });
  };
  
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };
  
  // Fonctions pour gérer les soumissions
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher(teacherForm);
    setTeacherForm({ name: '', email: '', subject: '', classroom: '' });
    setShowModal(false);
  };
  
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent(studentForm);
    setStudentForm({ name: '', email: '', level: '', subjects: [] });
    setShowModal(false);
  };
  
  const handleClassroomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClassroom(classroomForm);
    setClassroomForm({ name: '', capacity: 30 });
    setShowModal(false);
  };
  
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse(courseForm);
    setCourseForm({ name: '', level: '', teacher: '' });
    setShowModal(false);
  };
  
  // Render le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch(activeTab) {
      case 'teachers':
        return (
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={teacherForm.name}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={teacherForm.email}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Matière</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={teacherForm.subject}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="classroom" className="block text-sm font-medium text-gray-700">Salle</label>
              <select
                id="classroom"
                name="classroom"
                value={teacherForm.classroom}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez une salle</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.name}>{classroom.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Ajouter
              </button>
            </div>
          </form>
        );
        
      case 'students':
        return (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={studentForm.name}
                onChange={handleStudentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={studentForm.email}
                onChange={handleStudentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau</label>
              <input
                type="text"
                id="level"
                name="level"
                value={studentForm.level}
                onChange={handleStudentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Matières</label>
              <select
                id="subjects"
                name="subjects"
                multiple
                value={studentForm.subjects}
                onChange={handleStudentSubjectChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                {courses.map(course => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs matières.</p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Ajouter
              </button>
            </div>
          </form>
        );
        
      case 'classrooms':
        return (
          <form onSubmit={handleClassroomSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la salle</label>
              <input
                type="text"
                id="name"
                name="name"
                value={classroomForm.name}
                onChange={handleClassroomChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacité</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={classroomForm.capacity}
                onChange={handleClassroomChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Ajouter
              </button>
            </div>
          </form>
        );
        
      case 'courses':
        return (
          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du cours</label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseForm.name}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau</label>
              <input
                type="text"
                id="level"
                name="level"
                value={courseForm.level}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">Enseignant</label>
              <select
                id="teacher"
                name="teacher"
                value={courseForm.teacher}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez un enseignant</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>{teacher.name} - {teacher.subject}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Ajouter
              </button>
            </div>
          </form>
        );
        
      default:
        return null;
    }
  };
  
  // Render le contenu de l'onglet actif
  const renderTabContent = () => {
    switch(activeTab) {
      case 'teachers':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.classroom}</td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Aucun enseignant trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
        
      case 'students':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matières</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.subjects.join(', ')}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Aucun élève trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
        
      case 'classrooms':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.map((classroom) => (
                  <tr key={classroom.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classroom.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.capacity}</td>
                  </tr>
                ))}
                {classrooms.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">Aucune salle trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
        
      case 'courses':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.teacher}</td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Aucun cours trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const getAddButtonText = () => {
    switch(activeTab) {
      case 'teachers': return 'Ajouter un enseignant';
      case 'students': return 'Ajouter un élève';
      case 'classrooms': return 'Ajouter une salle';
      case 'courses': return 'Ajouter un cours';
      default: return 'Ajouter';
    }
  };
  
  const getModalTitle = () => {
    switch(activeTab) {
      case 'teachers': return 'Ajouter un nouvel enseignant';
      case 'students': return 'Ajouter un nouvel élève';
      case 'classrooms': return 'Ajouter une nouvelle salle';
      case 'courses': return 'Ajouter un nouveau cours';
      default: return 'Ajouter';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="education" />
      
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
                Tableau de bord - Gestion des Enseignements
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les enseignants, les élèves, les salles et les cours
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                {getAddButtonText()}
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
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('teachers')}
                    className={`${
                      activeTab === 'teachers'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Enseignants
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`${
                      activeTab === 'students'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Élèves
                  </button>
                  <button
                    onClick={() => setActiveTab('classrooms')}
                    className={`${
                      activeTab === 'classrooms'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <School className="mr-2 h-5 w-5" />
                    Salles
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`${
                      activeTab === 'courses'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Cours
                  </button>
                </nav>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {renderTabContent()}
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
                  {getModalTitle()}
                </h3>
                {renderForm()}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationDashboard;