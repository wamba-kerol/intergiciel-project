export interface Course {
  id: string;
  name: string;
  coef: number;
}

export interface CourseFormData {
  name: string;
  coef: number;
  teacherId: string;
  classroomId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}
