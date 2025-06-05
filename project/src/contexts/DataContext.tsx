import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { Subject } from '../types/Subject';

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
  subject?: string;
  classroom?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  subjects: string[];
  grades: Record<string, number>;
  sex?: ReactNode;
  age?: ReactNode;
  address?: ReactNode;
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
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
  publication_date?: string;
  genre?: string;
  description?: string;
  available: boolean;
  owner_id?: string;
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
  subjects: Subject[];
  
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
  fetchBooks: () => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<Book[]>;
  addBook: (book: Omit<Book, 'id'>, userId: string) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (bookId: string, userId: string) => Promise<void>;
  returnBook: (loanId: string) => Promise<void>;
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
          address: '123 Rue Principale',
          subject: 'Mathématiques',
          classroom: 'Salle 101',
        },
        {
          id: '2',
          name: 'Jean Martin',
          email: 'jean@example.com',
          sex: 'Homme',
          age: 42,
          address: '456 Avenue Secondaire',
          subject: 'Français',
          classroom: 'Salle 102',
        },
      ];
      setTeachers(initialTeachers);
      localStorage.setItem('teachers', JSON.stringify(initialTeachers));
    }

    if (!savedSubjects) {
      const initialSubjects = [
        { id: '1', name: 'Mathématiques', coef: 2 },
        { id: '2', name: 'Français', coef: 2 },
        { id: '3', name: 'Histoire', coef: 1 },
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
      grades: {},
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
      ...course,
    };
    setCourses([...courses, newCourse]);
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      id: Date.now().toString(),
      ...subject,
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateGrade = (studentId: string, subject: string, grade: number) => {
    setStudents(
      students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            grades: {
              ...student.grades,
              [subject]: grade,
            },
          };
        }
        return student;
      })
    );
  };

  const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>) => {
    setTeachers(
      teachers.map(teacher =>
        teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
      )
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(
      students.map(student =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const updateClassroom = (id: string, updatedClassroom: Partial<Classroom>) => {
    setClassrooms(
      classrooms.map(classroom =>
        classroom.id === id ? { ...classroom, ...updatedClassroom } : classroom
      )
    );
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(classroom => classroom.id !== id));
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(
      courses.map(course =>
        course.id === id ? { ...course, ...updatedCourse } : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateSubject = (id: string, updatedSubject: Partial<Subject>) => {
    setSubjects(
      subjects.map(subject =>
        subject.id === id ? { ...subject, ...updatedSubject } : subject
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Méthodes pour le système de bibliothèque
  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8006/api/ressources/book/index', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookData = Array.isArray(response.data) ? response.data : response.data.data || [];

      const mappedBooks: Book[] = bookData.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        publication_date: book.publication_date,
        genre: book.genre,
        description: book.description,
        available: book.status === 'available',
        owner_id: book.owner_id?.toString(),
      }));

      setBooks(mappedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, []);

  const fetchUserBooks = useCallback(async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:8006/api/usecases/user/getbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API response for user books:', response.data);

      const bookData = Array.isArray(response.data) ? response.data : response.data.data || [];

      const mappedBooks: Book[] = bookData.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        publication_date: book.publication_date,
        genre: book.genre,
        description: book.description,
        available: book.status === 'available',
        owner_id: book.owner_id?.toString(),
      }));

      return mappedBooks;
    } catch (error) {
      console.error('Error fetching user books:', error);
      return [];
    }
  }, []);

  const addBook = async (book: Omit<Book, 'id'>, userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        description: book.description || null,
        status: book.available ? 'available' : 'borrowed',
        owner_id: userId,
      };

      const response = await axios.post('http://localhost:8006/api/ressources/book/store', bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newBook: Book = {
        id: response.data.id.toString(),
        title: response.data.title,
        author: response.data.author,
        publication_date: response.data.publication_date,
        genre: response.data.genre,
        description: response.data.description,
        available: response.data.status === 'available',
        owner_id: response.data.owner_id?.toString(),
      };

      setBooks([...books, newBook]);
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, book: Partial<Book>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        description: book.description || null,
        status: book.available ? 'available' : 'borrowed',
      };

      const response = await axios.put(`http://localhost:8006/api/ressources/book/update/${id}`, bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedBook: Book = {
        id: response.data.id.toString(),
        title: response.data.title,
        author: response.data.author,
        publication_date: response.data.publication_date,
        genre: response.data.genre,
        description: response.data.description,
        available: response.data.status === 'available',
        owner_id: response.data.owner_id?.toString(),
      };

      setBooks(books.map(b => (b.id === id ? updatedBook : b)));
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`http://localhost:8006/api/ressources/book/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const borrowBook = async (bookId: string, userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Borrow book params:', { bookId, userId, token: token.substring(0, 10) + '...' });

      const response = await axios.post(
        `http://localhost:8006/api/usecases/notification/loanrequest/${bookId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Loan request response:', response.data);
    } catch (error: any) {
      console.error('Error requesting loan:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };

  const returnBook = async (loanId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const loan = loans.find(l => l.id === loanId);
      if (!loan) {
        throw new Error('Loan not found');
      }

      await axios.post(
        `http://localhost:8006/api/ressources/loan/return/${loanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoans(
        loans.map(l => {
          if (l.id === loanId) {
            return { ...l, returned: true };
          }
          return l;
        })
      );

      setBooks(
        books.map(book => {
          if (book.id === loan.bookId) {
            return { ...book, available: true };
          }
          return book;
        })
      );
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    teachers,
    students,
    classrooms,
    courses,
    subjects,
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
    fetchBooks,
    fetchUserBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}