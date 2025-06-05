export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  level: string;
  classroomId: string;
}

export interface Student extends StudentFormData {
  id: string;
  grades: Record<string, number>;
}
