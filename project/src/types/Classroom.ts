export interface ClassroomFormData {
  name: string;
  capacity: number;
}

export interface Classroom extends ClassroomFormData {
  id: string;
}
