import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BookOpen, School, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Modal from '../../components/shared/Modal';
import Navbar from '../../components/layout/Navbar';
import StudentForm from '../../components/forms/StudentForm';

// Définition des interfaces pour les types de formulaires
interface TeacherFormData {
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface ClassroomFormData {
  name: string;
  capacity: number;
}

interface MatiereFormData {
  name: string;
  coef: number;
}

interface CourseFormData {
  name: string;
  coef: number;
  teacherId: string;
  classroomId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}

const EducationDashboard: React.FC = () => {
  const { 
    teachers, 
    students, 
    classrooms, 
    courses, 
    subjects, 
    addTeacher, 
    addStudent, 
    addClassroom, 
    addCourse, 
    addSubject,
    updateTeacher,
    deleteTeacher,
    updateStudent,
    deleteStudent,
    updateClassroom,
    deleteClassroom,
    updateCourse,
    deleteCourse,
    updateSubject,
    deleteSubject
  } = useData();

  const [activeTab, setActiveTab] = useState('teachers');
  const [showModal, setShowModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [teacherForm, setTeacherForm] = useState<TeacherFormData>({
    name: '',
    email: '',
    sex: '',
    age: 18,
    address: ''
  });

  const [studentForm, setStudentForm] = useState<StudentFormData>({
    name: '',
    email: '',
    sex: '',
    age: 18,
    address: '',
  });

  const [classroomForm, setClassroomForm] = useState<ClassroomFormData>({
    name: '',
    capacity: 30
  });

  const [courseForm, setCourseForm] = useState<CourseFormData>({
    name: '',
    coef: 1,
    teacherId: '',
    classroomId: '',
    subject: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  const [matiereForm, setMatiereForm] = useState<MatiereFormData>({
    name: '',
    coef: 1
  });

  const handleEdit = (entity: any) => {
    setEditingEntity(entity);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    switch (activeTab) {
      case 'teachers':
        deleteTeacher(id);
        break;
      case 'students':
        deleteStudent(id);
        break;
      case 'classrooms':
        deleteClassroom(id);
        break;
      case 'courses':
        deleteCourse(id);
        break;
      case 'matiere':
        deleteSubject(id);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode) {
      switch (activeTab) {
        case 'teachers':
          updateTeacher(editingEntity.id, teacherForm);
          break;
        case 'students':
          updateStudent(editingEntity.id, studentForm);
          break;
        case 'classrooms':
          updateClassroom(editingEntity.id, classroomForm);
          break;
        case 'courses':
          updateCourse(editingEntity.id, courseForm);
          break;
        case 'matiere':
          updateSubject(editingEntity.id, matiereForm);
          break;
      }
      setIsEditMode(false);
      setEditingEntity(null);
    } else {
      switch (activeTab) {
        case 'teachers':
          addTeacher(teacherForm);
          break;
        case 'students':
          addStudent({
            ...studentForm,
            level: '',
            subjects: []
          });
          break;
        case 'classrooms':
          addClassroom(classroomForm);
          break;
        case 'courses':
          addCourse(courseForm);
          break;
        case 'matiere':
          addSubject(matiereForm);
          break;
      }
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTeacherForm({ name: '', email: '', sex: '', age: 18, address: '' });
    setStudentForm({ name: '', email: '', sex: '', age: 18, address: '' });
    setClassroomForm({ name: '', capacity: 30 });
    setCourseForm({
      name: '',
      coef: 1,
      teacherId: '',
      classroomId: '',
      subject: '',
      day: '',
      startTime: '',
      endTime: ''
    });
    setMatiereForm({ name: '', coef: 1 });
  };

  // Fonction pour gérer les changements dans le formulaire de cours
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'coef') {
      setCourseForm({ ...courseForm, coef: parseInt(value) });
    } else {
      setCourseForm({ ...courseForm, [name]: value });
    }
  };

  // Fonctions pour gérer les changements dans les formulaires
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'age' ? parseInt(e.target.value) : e.target.value;
    setStudentForm({ ...studentForm, [e.target.name]: value });
  };

  const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassroomForm({
      ...classroomForm,
      [e.target.name]: e.target.name === 'capacity' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleMatiereChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatiereForm({
      ...matiereForm,
      [e.target.name]: e.target.name === 'coef' ? parseInt(e.target.value) : e.target.value
    });
  };

  // Render le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (activeTab) {
      case 'teachers':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sexe</label>
              <select
                id="sex"
                name="sex"
                value={teacherForm.sex}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Âge</label>
              <input
                type="number"
                id="age"
                name="age"
                value={teacherForm.age}
                onChange={(e) => setTeacherForm({ ...teacherForm, age: parseInt(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
                min="18"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={teacherForm.address}
                onChange={handleTeacherChange}
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
                {isEditMode ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        );

      case 'students':
        return (
          <StudentForm
            studentForm={studentForm}
            handleStudentChange={handleStudentChange}
            handleSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
            isEditMode={isEditMode}
          />
        );

      case 'classrooms':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                {isEditMode ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        );

      case 'courses':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Enseignant</label>
              <select
                id="teacherId"
                name="teacherId"
                value={courseForm.teacherId}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez un enseignant</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="classroomId" className="block text-sm font-medium text-gray-700">Salle</label>
              <select
                id="classroomId"
                name="classroomId"
                value={courseForm.classroomId}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez une salle</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Matière</label>
              <select
                id="subject"
                name="subject"
                value={courseForm.subject}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez une matière</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">Jour</label>
              <select
                id="day"
                name="day"
                value={courseForm.day}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez un jour</option>
                <option value="monday">Lundi</option>
                <option value="tuesday">Mardi</option>
                <option value="wednesday">Mercredi</option>
                <option value="thursday">Jeudi</option>
                <option value="friday">Vendredi</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Heure de début</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={courseForm.startTime}
                  onChange={handleCourseChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Heure de fin</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={courseForm.endTime}
                  onChange={handleCourseChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                  required
                />
              </div>
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
                {isEditMode ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        );

      case 'matiere':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la matière</label>
              <input
                type="text"
                id="name"
                name="name"
                value={matiereForm.name}
                onChange={handleMatiereChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="coef" className="block text-sm font-medium text-gray-700">Coefficient</label>
              <input
                type="number"
                id="coef"
                name="coef"
                value={matiereForm.coef}
                onChange={handleMatiereChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-800"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                {isEditMode ? 'Modifier' : 'Ajouter'}
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
    switch (activeTab) {
      case 'teachers':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 hover:text-red-800 bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun enseignant trouvé</td>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(student)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-med text-red-800 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun étudiant trouvé</td>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.map((classroom) => (
                  <tr key={classroom.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classroom.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(classroom)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(classroom.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-red-800 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {classrooms.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Aucune salle trouvée</td>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaires</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {teachers.find(t => t.id === course.teacherId)?.name || 'Non spécifié'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classrooms.find(c => c.id === course.classroomId)?.name || 'Non spécifié'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.day.charAt(0).toUpperCase() + course.day.slice(1)}
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.startTime} - {course.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(course)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-red-800 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun cours trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'matiere':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la matière</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{subject.coef}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(subject.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium  text-red-800 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Aucune matière trouvée</td>
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
    switch (activeTab) {
      case 'teachers': return 'Ajouter un enseignant';
      case 'students': return 'Ajouter un élève';
      case 'classrooms': return 'Ajouter une salle';
      case 'courses': return 'Ajouter un cours';
      case 'matiere': return 'Ajouter une matière';
      default: return 'Ajouter';
    }
  };

  const getModalTitle = () => {
    switch (activeTab) {
      case 'teachers': return 'Ajouter un nouvel enseignant';
      case 'students': return 'Ajouter un nouvel élève';
      case 'classrooms': return 'Ajouter une nouvelle salle';
      case 'courses': return 'Ajouter un nouveau cours';
      case 'matiere': return 'Ajouter une nouvelle matière';
      default: return 'Ajouter';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="education" />
      <div className="py-24">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:flex md:items-center md: justify-between"
          >
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Tableau de bord - Gestion des Enseignements
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les enseignants, les élèves, les salles, les cours et les matières
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
          <div className="px-4 py-6 sm:p-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('teachers')}
                    className={`${activeTab === 'teachers'
                      ? 'border-blue-800 text-blue-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Enseignants
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`${activeTab === 'students'
                      ? 'border-blue-800 text-blue-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Élèves
                  </button>
                  <button
                    onClick={() => setActiveTab('classrooms')}
                    className={`${activeTab === 'classrooms'
                      ? 'border-blue-800 text-blue-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <School className="mr-2 h-5 w-5" />
                    Salles
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`${activeTab === 'courses'
                      ? 'border-blue-800 text-blue-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Cours
                  </button>
                  <button
                    onClick={() => setActiveTab('matiere')}
                    className={`${activeTab === 'matiere'
                      ? 'border-blue-800 text-blue-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Matières
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
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={getModalTitle()}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default EducationDashboard;