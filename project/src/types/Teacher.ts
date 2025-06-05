export interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
}

export interface Teacher extends TeacherFormData {
  id: string;
}
