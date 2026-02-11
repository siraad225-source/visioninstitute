
import { StudentProfile, StudentResult } from '../types';
import { MOCK_STUDENT, MOCK_RESULTS } from '../constants';

const DB_KEY = 'vision_institute_db';

export interface FullStudentRecord {
  profile: StudentProfile;
  results: StudentResult[];
  password: string;
}

export const dbService = {
  // Initialize DB with default data if empty
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      const initialData: FullStudentRecord[] = [
        {
          profile: MOCK_STUDENT,
          results: MOCK_RESULTS,
          password: 'password123'
        }
      ];
      localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    }
  },

  getAllStudents: (): FullStudentRecord[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveStudent: (record: FullStudentRecord) => {
    const students = dbService.getAllStudents();
    const index = students.findIndex(s => s.profile.id === record.profile.id);
    
    if (index !== -1) {
      students[index] = record; // Update
    } else {
      students.push(record); // Create
    }
    
    localStorage.setItem(DB_KEY, JSON.stringify(students));
  },

  deleteStudent: (id: string) => {
    const students = dbService.getAllStudents();
    const filtered = students.filter(s => s.profile.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(filtered));
  },

  authenticate: (id: string, pass: string): FullStudentRecord | null => {
    const students = dbService.getAllStudents();
    return students.find(s => s.profile.id === id && s.password === pass) || null;
  }
};
