
import { StudentProfile, StudentResult } from '../types';
import { MOCK_STUDENT, MOCK_RESULTS } from '../constants';

const LOCAL_DB_KEY = 'vision_institute_db';

export interface FullStudentRecord {
  profile: StudentProfile;
  results: StudentResult[];
  password: string;
}

// In a real app, set this to your Render/Heroku URL
const API_BASE_URL = ''; 

export const apiService = {
  init: () => {
    if (!localStorage.getItem(LOCAL_DB_KEY)) {
      const initialData: FullStudentRecord[] = [
        {
          profile: MOCK_STUDENT,
          results: MOCK_RESULTS,
          password: 'password123'
        }
      ];
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialData));
    }
  },

  getAllStudents: async (): Promise<FullStudentRecord[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/students`);
        return await res.json();
      } catch (e) {
        console.error("Fetch failed, falling back to local storage", e);
      }
    }
    const data = localStorage.getItem(LOCAL_DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveStudent: async (record: FullStudentRecord): Promise<void> => {
    if (API_BASE_URL) {
      // Real API implementation would go here
    }
    const students = await apiService.getAllStudents();
    const index = students.findIndex(s => s.profile.id === record.profile.id);
    
    if (index !== -1) {
      students[index] = record;
    } else {
      students.push(record);
    }
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(students));
  },

  deleteStudent: async (id: string): Promise<void> => {
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error("API delete failed", e);
      }
    }
    const students = await apiService.getAllStudents();
    const filtered = students.filter(s => s.profile.id !== id);
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(filtered));
  },

  authenticate: async (id: string, pass: string): Promise<FullStudentRecord | null> => {
    const students = await apiService.getAllStudents();
    return students.find(s => s.profile.id === id && s.password === pass) || null;
  }
};
