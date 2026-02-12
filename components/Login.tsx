
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (id: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(studentId, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] relative overflow-hidden">
      {/* Yellow Corner Decorative Element (Left Angle) */}
      <div 
        className="absolute top-0 left-0 w-32 h-32 bg-[#f9a825] z-0" 
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#004182] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f9a825] rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-2xl animate-slide-in relative z-10 mx-4 border border-blue-50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
             <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#f9a825] flex items-center justify-center bg-white shadow-md">
                   <svg className="w-12 h-12 text-[#004182]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                   </svg>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#004182] text-white text-[8px] px-2 py-0.5 rounded font-black uppercase whitespace-nowrap tracking-tighter">
                  Vision Institute
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-black text-[#004182] tracking-tight mb-1">Vision Institute</h1>
          <p className="text-[#f9a825] font-black text-[10px] uppercase tracking-[0.2em]">Learning is limitless</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"> (Student ID)</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#004182]/10 focus:border-[#004182] outline-none transition-all text-gray-700 font-bold"
              placeholder="VIS-2024-001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"> (Password)</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#004182]/10 focus:border-[#004182] outline-none transition-all text-gray-700 font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-[#004182] hover:bg-[#003366] text-white font-black rounded-2xl shadow-xl shadow-blue-100 transform hover:-translate-y-1 transition-all duration-300"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
