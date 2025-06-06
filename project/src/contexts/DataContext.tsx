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
  requestDate?: string; // Added for Borrowing entity
  status?: string; // Added for Borrowing entity
}

// Added User type for profile page
interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
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
  
  // Added for profile page
  fetchUserById: (userId: string) => Promise<User | null>;
  fetchUserBorrowings: (userId: string) => Promise<Loan[]>;
  fetchUserBorrows: (userId: string) => Promise<Loan[]>;
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
  
  // Added: State for users
  const [users, setUsers] = useState<User[]>([]);

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

    const savedBooks = localStorage.getItem('books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));

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

    // Added: Initialize users from teachers and students
    const initialUsers: User[] = [
      ...teachers.map(t => ({ id: t.id, name: t.name, email: t.email, role: 'teacher' as const })),
      ...students.map(s => ({ id: s.id, name: s.name, email: s.email, role: 'student' as const })),
    ];
    setUsers(initialUsers);
  }, [teachers, students]);

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

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  // Added: Save users to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Méthodes pour le système d'éducation
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setTeachers([...teachers, newTeacher]);
    setUsers([...users, { id: newTeacher.id, name: newTeacher.name, email: newTeacher.email, role: 'teacher' }]);
  };

  const addStudent = (student: Omit<Student, 'id' | 'grades'>) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      grades: {},
    };
    setStudents([...students, newStudent]);
    setUsers([...users, { id: newStudent.id, name: newStudent.name, email: newStudent.email, role: 'student' }]);
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
    setUsers(
      users.map(user =>
        user.id === id && user.role === 'teacher'
          ? { ...user, name: updatedTeacher.name || user.name, email: updatedTeacher.email || user.email }
          : user
      )
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
    setUsers(users.filter(user => !(user.id === id && user.role === 'teacher')));
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(
      students.map(student =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    );
    setUsers(
      users.map(user =>
        user.id === id && user.role === 'student'
          ? { ...user, name: updatedStudent.name || user.name, email: updatedStudent.email || user.email }
          : user
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    setUsers(users.filter(user => !(user.id === id && user.role === 'student')));
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
      localStorage.setItem('books', JSON.stringify(mappedBooks));
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
      localStorage.setItem('books', JSON.stringify([...books, newBook]));
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

      const updatedBooks = books.map(b => (b.id === id ? updatedBook : b));
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
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

      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
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

      const newLoan: Loan = {
        id: response.data.id?.toString() || Date.now().toString(),
        bookId,
        userId,
        loanDate: new Date().toISOString(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        returned: false,
        requestDate: new Date().toISOString(),
        status: 'pending',
      };

      setLoans([...loans, newLoan]);
      setBooks(books.map(book => book.id === bookId ? { ...book, available: false } : book));
      localStorage.setItem('loans', JSON.stringify([...loans, newLoan]));
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

      const updatedLoans = loans.map(l => {
        if (l.id === loanId) {
          return { ...l, returned: true, returnDate: new Date().toISOString() };
        }
        return l;
      });
      setLoans(updatedLoans);
      localStorage.setItem('loans', JSON.stringify(updatedLoans));

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

  // Added: Methods for profile page
  const fetchUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Try to find in local state first
      let user = users.find(u => u.id === userId);
      if (user) return user;

      // Fallback to API if available (adjust endpoint as needed)
      const response = await axios.get(`http://localhost:8006/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      user = {
        id: response.data.id.toString(),
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || 'student', // Adjust based on API response
      };

      setUsers([...users, user]);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }, [users]);

  const fetchUserBorrowings = useCallback(async (userId: string): Promise<Loan[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Filter loans where status is 'pending' (loan requests)
      const userLoans = loans.filter(loan => loan.userId === userId && loan.status === 'pending');

      // Fetch from API if needed (adjust endpoint)
      const response = await axios.get(`http://localhost:8006/api/ressources/loan/requests/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiLoans: Loan[] = response.data.map((loan: any) => ({
        id: loan.id.toString(),
        bookId: loan.bookId.toString(),
        userId: loan.userId.toString(),
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        returned: loan.returned,
        requestDate: loan.requestDate,
        status: loan.status,
      }));

      const combinedLoans = [...userLoans, ...apiLoans.filter(l => !userLoans.some(ul => ul.id === l.id))];
      return combinedLoans.map(loan => ({
        ...loan,
        bookTitle: books.find(book => book.id === loan.bookId)?.title || 'Inconnu',
      }));
    } catch (error) {
      console.error('Error fetching user borrowings:', error);
      return loans.filter(loan => loan.userId === userId && loan.status === 'pending').map(loan => ({
        ...loan,
        bookTitle: books.find(book => book.id === loan.bookId)?.title || 'Inconnu',
      }));
    }
  }, [loans, books]);

  const fetchUserBorrows = useCallback(async (userId: string): Promise<Loan[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Filter all loans for the user (active and past)
      const userLoans = loans.filter(loan => loan.userId === userId);

      // Fetch from API if needed (adjust endpoint)
      const response = await axios.get(`http://localhost:8006/api/ressources/loan/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiLoans: Loan[] = response.data.map((loan: any) => ({
        id: loan.id.toString(),
        bookId: loan.bookId.toString(),
        userId: loan.userId.toString(),
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        returned: loan.returned,
        requestDate: loan.requestDate,
        status: loan.status,
      }));

      const combinedLoans = [...userLoans, ...apiLoans.filter(l => !userLoans.some(ul => ul.id === l.id))];
      return combinedLoans.map(loan => ({
        ...loan,
        bookTitle: books.find(book => book.id === loan.bookId)?.title || 'Inconnu',
      }));
    } catch (error) {
      console.error('Error fetching user borrows:', error);
      return loans.filter(loan => loan.userId === userId).map(loan => ({
        ...loan,
        bookTitle: books.find(book => book.id === loan.bookId)?.title || 'Inconnu',
      }));
    }
  }, [loans, books]);

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
    fetchUserById,
    fetchUserBorrowings,
    fetchUserBorrows,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}