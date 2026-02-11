
export interface StudentResult {
  id: string;
  subject: string;
  score: number;
  total: number;
  grade: string;
  status: 'Pass' | 'Fail';
  remarks: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  course: string;
  semester: string;
  avatar: string;
  teacher?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  student: StudentProfile | null;
  results: StudentResult[];
}
