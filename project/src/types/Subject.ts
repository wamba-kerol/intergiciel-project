export interface Subject {
  id: string;
  name: string;
  coef: number;
}

export type Tab = 'teachers' | 'students' | 'classrooms' | 'courses' | 'subjects';
