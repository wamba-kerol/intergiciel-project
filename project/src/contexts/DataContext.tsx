import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject } from '../types/Subject';

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface Student {
  sex: ReactNode;
  age: ReactNode;
  address: ReactNode;
  id: string;
  name: string;
  email: string;
  level: string;
  subjects: string[];
  grades: Record<string, number>;
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
}
interface Matiere{
  id: string;
  name: string;
  coef: number;
}

interface Course {
  id: string;
  name: string;
  coef: number;
  teacherId: string;
  classroomId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  available: boolean;
}

interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  returnDate: string;
  returned: boolean;
}

interface DataContextType {
  // Education data
  teachers: Teacher[];
  students: Student[];
  classrooms: Classroom[];
  courses: Course[];
  subjects:Matiere[];
  
  // Library data
  books: Book[];
  loans: Loan[];
  
  // Education methods
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id' | 'grades'>) => void;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateGrade: (studentId: string, subject: string, grade: number) => void;
  updateTeacher: (id: string, updatedTeacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  updateStudent: (id: string, updatedStudent: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateClassroom: (id: string, updatedClassroom: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  updateSubject: (id: string, updatedSubject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Library methods
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  borrowBook: (bookId: string, userId: string, returnDate: string) => void;
  returnBook: (loanId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  // États pour le système d'éducation
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // États pour le système de bibliothèque
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  
  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    
    const savedClassrooms = localStorage.getItem('classrooms');
    if (savedClassrooms) setClassrooms(JSON.parse(savedClassrooms));
    
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    
    const savedLoans = localStorage.getItem('loans');
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    
    // Initialiser avec des données de démonstration si vide
    if (!savedTeachers) {
      const initialTeachers = [
        { 
          id: '1', 
          name: 'Marie Dupont', 
          email: 'marie@example.com', 
          sex: 'Femme', 
          age: 35,
          address: '123 Rue Principale'
        },
        { 
          id: '2', 
          name: 'Jean Martin', 
          email: 'jean@example.com', 
          sex: 'Homme', 
          age: 42,
          address: '456 Avenue Secondaire'
        }
      ];
      setTeachers(initialTeachers);
      localStorage.setItem('teachers', JSON.stringify(initialTeachers));
    }
    
    if (!savedBooks) {
      const initialBooks = [
        { 
          id: '1', 
          title: 'Les Misérables', 
          author: 'Victor Hugo', 
          description: 'Un chef-d\'œuvre de la littérature française qui suit la vie et les luttes de Jean Valjean.', 
          available: true 
        },
        { 
          id: '2', 
          title: 'Le Petit Prince', 
          author: 'Antoine de Saint-Exupéry', 
          description: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.', 
          available: true 
        },
        { 
          id: '3', 
          title: 'Candide', 
          author: 'Voltaire', 
          description: 'Un conte philosophique qui remet en question l\'optimisme leibnizien.', 
          available: true 
        }
      ];
      setBooks(initialBooks);
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }
    
    if (!savedSubjects) {
      const initialSubjects = [
        { 
          id: '1', 
          name: 'Mathématiques', 
          coef: 2
        },
        { 
          id: '2', 
          name: 'Français', 
          coef: 2
        },
        { 
          id: '3', 
          name: 'Histoire', 
          coef: 1
        }
      ];
      setSubjects(initialSubjects);
      localStorage.setItem('subjects', JSON.stringify(initialSubjects));
    }
  }, []);
  
  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);
  
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);
  
  useEffect(() => {
    localStorage.setItem('classrooms', JSON.stringify(classrooms));
  }, [classrooms]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);
  
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);
  
  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);
  
  // Méthodes pour le système d'éducation
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setTeachers([...teachers, newTeacher]);
  };
  
  const addStudent = (student: Omit<Student, 'id' | 'grades'>) => {
    const newStudent = { 
      ...student, 
      id: Date.now().toString(),
      grades: {} 
    };
    setStudents([...students, newStudent]);
  };
  
  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    const newClassroom = { ...classroom, id: Date.now().toString() };
    setClassrooms([...classrooms, newClassroom]);
  };
  
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = {
      id: Date.now().toString(),
      ...course
    };
    setCourses([...courses, newCourse]);
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      id: Date.now().toString(),
      ...subject
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateGrade = (studentId: string, subject: string, grade: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [subject]: grade
          }
        };
      }
      return student;
    }));
  };

  const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const updateClassroom = (id: string, updatedClassroom: Partial<Classroom>) => {
    setClassrooms(classrooms.map(classroom => 
      classroom.id === id ? { ...classroom, ...updatedClassroom } : classroom
    ));
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(classroom => classroom.id !== id));
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateSubject = (id: string, updatedSubject: Partial<Subject>) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, ...updatedSubject } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };
  
  // Méthodes pour le système de bibliothèque
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: Date.now().toString() };
    setBooks([...books, newBook]);
  };
  
  const updateBook = (id: string, book: Partial<Book>) => {
    setBooks(books.map(b => {
      if (b.id === id) {
        return { ...b, ...book };
      }
      return b;
    }));
  };
  
  const deleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };
  
  const borrowBook = (bookId: string, userId: string, returnDate: string) => {
    // Marquer le livre comme non disponible
    setBooks(books.map(book => {
      if (book.id === bookId) {
        return { ...book, available: false };
      }
      return book;
    }));
    
    // Créer un nouvel emprunt
    const newLoan = {
      id: Date.now().toString(),
      bookId,
      userId,
      loanDate: new Date().toISOString(),
      returnDate,
      returned: false
    };
    
    setLoans([...loans, newLoan]);
  };
  
  const returnBook = (loanId: string) => {
    // Trouver l'emprunt et marquer comme retourné
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    setLoans(loans.map(l => {
      if (l.id === loanId) {
        return { ...l, returned: true };
      }
      return l;
    }));
    
    // Marquer le livre comme disponible
    setBooks(books.map(book => {
      if (book.id === loan.bookId) {
        return { ...book, available: true };
      }
      return book;
    }));
  };
  
  const value = {
    teachers,
    students,
    classrooms,
    courses,
    books,
    loans,
    addTeacher,
    addStudent,
    addClassroom,
    addCourse,
    addSubject,
    updateGrade,
    updateTeacher,
    deleteTeacher,
    updateStudent,
    deleteStudent,
    updateClassroom,
    deleteClassroom,
    updateCourse,
    deleteCourse,
    updateSubject,
    deleteSubject,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
  };
  
  return (
    <DataContext.Provider value={{
      // Education data
      teachers,
      students,
      classrooms,
      courses,
      subjects,
      
      // Library data
      books,
      loans,
      
      // Education methods
      addTeacher,
      addStudent,
      addClassroom,
      addCourse,
      addSubject,
      updateGrade,
      updateTeacher,
      deleteTeacher,
      updateStudent,
      deleteStudent,
      updateClassroom,
      deleteClassroom,
      updateCourse,
      deleteCourse,
      updateSubject,
      deleteSubject,
      
      // Library methods
      addBook,
      updateBook,
      deleteBook,
      borrowBook,
      returnBook
    }}>
      {children}
    </DataContext.Provider>
  );
}