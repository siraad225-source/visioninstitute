
import React, { useState, useEffect, useRef } from 'react';
import { apiService, FullStudentRecord } from '../services/apiService';
import { StudentResult } from '../types';
import * as XLSX from 'xlsx';

interface AdminPortalProps {
  onLogout: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [students, setStudents] = useState<FullStudentRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const COURSE_KEYS = ['WORD', 'EXCEL', 'POWERPOINT', 'ACCESS', 'PUBLISHER', 'WINDOWS'];

  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    password: 'password123',
    course: 'Basic Computer Skills',
    teacher: 'Mokhtaar Foodicay',
    scores: {
      WORD: 0,
      EXCEL: 0,
      POWERPOINT: 0,
      ACCESS: 0,
      PUBLISHER: 0,
      WINDOWS: 0
    }
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await apiService.getAllStudents();
    setStudents(data);
  };

  const handleEdit = (student: FullStudentRecord) => {
    setEditingId(student.profile.id);
    const scores: any = {};
    COURSE_KEYS.forEach(key => {
      const subjectName = key === 'WINDOWS' ? 'WINDOWS & INTERNET' : `MS ${key}`;
      scores[key] = student.results.find(r => r.subject === subjectName)?.score || 0;
    });

    setFormData({
      id: student.profile.id,
      fullName: student.profile.fullName,
      password: student.password,
      course: student.profile.course,
      teacher: student.profile.teacher || 'Mokhtaar Foodicay',
      scores: scores as any
    });
    setIsModalOpen(true);
  };

  const getGrade = (s: number) => {
    if (s >= 90) return 'A+';
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    if (s >= 50) return 'D';
    return '-';
  };

  const createResultsFromScores = (scores: any) => {
    return COURSE_KEYS.map((key, idx) => {
      const score = Number(scores[key]) || 0;
      return {
        id: String(idx + 1),
        subject: key === 'WINDOWS' ? 'WINDOWS & INTERNET' : `MS ${key}`,
        score: score,
        total: 100,
        grade: getGrade(score),
        status: score >= 50 ? 'Pass' : 'Fail',
        remarks: score >= 50 ? 'Gudbay' : 'Natiijo lama hayo'
      } as StudentResult;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = createResultsFromScores(formData.scores);

    const record: FullStudentRecord = {
      profile: {
        id: formData.id,
        fullName: formData.fullName,
        course: formData.course,
        teacher: formData.teacher,
        email: `${formData.id.toLowerCase()}@vision.edu`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.fullName)}&backgroundColor=004182`,
        semester: '2024'
      },
      results,
      password: formData.password
    };

    await apiService.saveStudent(record);
    await loadStudents();
    setIsModalOpen(false);
    resetForm();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "Full Name": "Ali Ahmed Jama",
        "ID": "VIS-001",
        "Password": "pass123",
        "WORD": 85,
        "EXCEL": 90,
        "POWERPOINT": 75,
        "ACCESS": 60,
        "PUBLISHER": 80,
        "WINDOWS": 70,
        "Course": "Basic Computer Skills",
        "Teacher": "Mokhtaar Foodicay"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Vision_Student_Template.xlsx");
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        let count = 0;
        for (const row of data) {
          const fullName = row['Magaca'] || row['Full Name'] || row['fullName'] || row['Name'] || row['name'];
          const id = String(row['ID'] || row['Student ID'] || row['id'] || row['studentId']);
          const password = String(row['Password'] || row['password'] || 'password123');
          
          if (fullName && id && id !== 'undefined') {
            const scores = {
              WORD: row['WORD'] || row['Word'] || row['word'] || 0,
              EXCEL: row['EXCEL'] || row['Excel'] || row['excel'] || 0,
              POWERPOINT: row['POWERPOINT'] || row['PowerPoint'] || row['powerpoint'] || 0,
              ACCESS: row['ACCESS'] || row['Access'] || row['access'] || 0,
              PUBLISHER: row['PUBLISHER'] || row['Publisher'] || row['publisher'] || 0,
              WINDOWS: row['WINDOWS'] || row['Windows'] || row['windows'] || 0
            };

            const record: FullStudentRecord = {
              profile: {
                id,
                fullName,
                course: row['Course'] || row['course'] || 'Basic Computer Skills',
                teacher: row['Teacher'] || row['teacher'] || 'Mokhtaar Foodicay',
                email: `${id.toLowerCase()}@vision.edu`,
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=004182`,
                semester: '2024'
              },
              results: createResultsFromScores(scores),
              password
            };
            await apiService.saveStudent(record);
            count++;
          }
        }
        alert(`Guul! Waxaa la diwaan galiyay ${count} arday.`);
        loadStudents();
      } catch (err) {
        alert("Cillad dhacday! Hubi in Excel-ku leeyahay columns-ka saxda ah.");
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
    if (excelInputRef.current) excelInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData({
      id: '', fullName: '', password: 'password123', course: 'Basic Computer Skills', teacher: 'Mokhtaar Foodicay',
      scores: { WORD: 0, EXCEL: 0, POWERPOINT: 0, ACCESS: 0, PUBLISHER: 0, WINDOWS: 0 }
    });
    setEditingId(null);
  };

  const deleteStudent = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto ardaygan?')) {
      await apiService.deleteStudent(id);
      await loadStudents();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-[#004182] flex items-center justify-center text-white shadow-xl rotate-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
             </div>
             <div>
                <h1 className="text-3xl font-black text-[#004182] tracking-tight">Admin Portal</h1>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Vision Institute Management</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button 
              onClick={downloadTemplate}
              className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-500 px-5 py-3.5 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>
              Template
            </button>

            <input type="file" accept=".xlsx, .xls" className="hidden" ref={excelInputRef} onChange={handleExcelUpload} />
            <button 
              onClick={() => excelInputRef.current?.click()}
              className="flex-1 sm:flex-none bg-[#f9a825] text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-[#e6951d] transition-all flex items-center justify-center gap-2"
            >
              Excel Upload
            </button>

            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="flex-1 sm:flex-none bg-[#004182] text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-[#003366] transition-all"
            >
              Arday Cusub
            </button>

            <button onClick={onLogout} className="flex-1 sm:flex-none bg-red-50 text-red-500 px-6 py-3.5 rounded-2xl font-black hover:bg-red-100 transition-all">
              Bax
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Students</p>
             <h3 className="text-4xl font-black text-[#004182]">{students.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Semester</p>
             <h3 className="text-4xl font-black text-[#f9a825]">2024</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
             <h3 className="text-2xl font-black text-green-500 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                System Online
             </h3>
          </div>
        </div>

        {/* Main List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-slide-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ardayga</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ficilada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => {
                  const valid = s.results.filter(r => r.score > 0);
                  const avg = valid.length > 0 ? valid.reduce((a, b) => a + b.score, 0) / valid.length : 0;
                  return (
                    <tr key={s.profile.id} className="hover:bg-gray-50/80 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={s.profile.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt="Avatar" />
                          <div>
                             <p className="font-black text-gray-700 text-lg group-hover:text-[#004182] transition-colors">{s.profile.fullName}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{s.profile.course}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-sm font-black bg-blue-50 text-[#004182] px-3 py-1.5 rounded-xl border border-blue-100">
                          {s.profile.id}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${avg >= 50 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${avg}%` }}></div>
                            </div>
                            <span className={`text-xs font-black ${avg >= 50 ? 'text-green-500' : 'text-red-500'}`}>{avg.toFixed(1)}%</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(s)} className="p-3 text-[#004182] bg-blue-50 rounded-2xl hover:bg-[#004182] hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => deleteStudent(s.profile.id)} className="p-3 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Arday Cusub / Bedel */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-in border border-white/20">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black text-[#004182]">{editingId ? 'Bedel Xogta' : 'Arday Cusub'}</h2>
                  <p className="text-xs font-bold text-[#f9a825] uppercase tracking-widest mt-1">Natiijooyinka Vision Institute</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-3 rounded-2xl text-gray-400 hover:text-gray-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block ml-1 tracking-widest">Magaca oo Buuxa</label>
                  <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-gray-50 border-none p-5 rounded-3xl font-bold focus:ring-4 focus:ring-[#004182]/5 outline-none text-gray-700" placeholder="Ali Ahmed..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block ml-1 tracking-widest">Student ID</label>
                  <input required disabled={!!editingId} value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full bg-gray-50 border-none p-5 rounded-3xl font-black focus:ring-4 focus:ring-[#004182]/5 outline-none text-[#004182] disabled:opacity-50" placeholder="VIS-2024-001" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block ml-1 tracking-widest">Password</label>
                  <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border-none p-5 rounded-3xl font-bold focus:ring-4 focus:ring-[#004182]/5 outline-none" placeholder="••••••••" />
                </div>
              </div>

              <div className="bg-[#f8faff] p-10 rounded-[2.5rem] border border-blue-50">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-6 bg-[#f9a825] rounded-full"></div>
                    <h3 className="text-sm font-black text-[#004182] uppercase tracking-widest">Natiijooyinka (100%)</h3>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {COURSE_KEYS.map((key) => (
                      <div key={key}>
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block text-center tracking-tighter">{key}</label>
                        <input 
                          type="number" 
                          max="100" 
                          min="0"
                          value={(formData.scores as any)[key]} 
                          onChange={e => setFormData({
                            ...formData, 
                            scores: { ...formData.scores, [key]: parseInt(e.target.value) || 0 }
                          })} 
                          className="w-full bg-white border border-gray-100 p-5 rounded-[1.5rem] text-center font-black text-[#004182] shadow-sm outline-none focus:ring-2 focus:ring-[#004182]/10" 
                        />
                      </div>
                    ))}
                 </div>
              </div>

              <button type="submit" className="w-full bg-[#004182] text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-blue-100 hover:bg-[#003366] active:scale-95 transition-all">
                {editingId ? 'BEDEL NATIIJADA' : 'KEYDI ARDAYGA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
