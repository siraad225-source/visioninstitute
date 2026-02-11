
import { StudentProfile, StudentResult } from './types';

export const MOCK_STUDENT: StudentProfile = {
  id: "VIS-2024-001",
  fullName: "Mukhtar Adan Mohamed",
  email: "mukhtar.adan@vision.edu",
  course: "Basic Computer Skills",
  semester: "2024",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mukhtar&backgroundColor=004182",
  teacher: "Mokhtaar Foodicay"
};

export const MOCK_RESULTS: StudentResult[] = [
  { id: "1", subject: "MS WORD", score: 85, total: 100, grade: "A", status: "Pass", remarks: "Gudbay" },
  { id: "2", subject: "MS EXCEL", score: 78, total: 100, grade: "B", status: "Pass", remarks: "Gudbay" },
  { id: "3", subject: "MS POWERPOINT", score: 90, total: 100, grade: "A+", status: "Pass", remarks: "Gudbay" },
  { id: "4", subject: "MS ACCESS", score: 65, total: 100, grade: "C", status: "Pass", remarks: "Gudbay" },
  { id: "5", subject: "MS PUBLISHER", score: 82, total: 100, grade: "A", status: "Pass", remarks: "Gudbay" },
  { id: "6", subject: "WINDOWS & INTERNET", score: 0, total: 100, grade: "-", status: "Fail", remarks: "Natiijo lama hayo" }
];
