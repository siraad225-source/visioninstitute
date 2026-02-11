
import React from 'react';
import { StudentProfile, StudentResult } from '../types';

interface DashboardProps {
  student: StudentProfile;
  results: StudentResult[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ student, results, onLogout }) => {
  const totalObtained = results.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = results.length * 100;
  
  // Logic: Pass if average >= 50%
  const average = totalObtained / results.length;
  const overallStatus = average >= 50 ? "Baasay" : "Hadhay";

  return (
    <div className="min-h-screen bg-white text-[#444] font-sans pb-12">
      {/* Header with Logo */}
      <div className="max-w-4xl mx-auto px-4 pt-10 text-center animate-slide-in">
        <div className="flex justify-center mb-6">
           <div className="w-24 h-24 rounded-full border-4 border-[#f9a825] p-1 shadow-md bg-white flex items-center justify-center">
              <svg className="w-12 h-12 text-[#004182]" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                 <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
           </div>
        </div>
        <h1 className="text-3xl font-black text-[#004182] mb-1">{student.fullName}</h1>
        <p className="text-[#f9a825] font-black text-[10px] uppercase tracking-[0.2em] mb-10">Vision Institute Student Portal</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-[#f8faff] p-5 rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[#004182]/40 uppercase tracking-widest mb-2">Macalinkaaga</span>
            <span className="text-lg font-bold text-gray-500">{student.teacher || "-"}</span>
          </div>
          <div className="bg-[#f8faff] p-5 rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[#004182]/40 uppercase tracking-widest mb-2">Total Score</span>
            <span className="text-lg font-bold text-[#004182]">{totalObtained}/{totalPossible}</span>
          </div>
          <div className="bg-[#f7fffb] p-5 rounded-2xl border border-green-50 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-green-300 uppercase tracking-widest mb-2">Xaalada</span>
            <span className={`text-lg font-black ${overallStatus === 'Baasay' ? 'text-green-500' : 'text-red-500'}`}>
              {overallStatus}
            </span>
          </div>
        </div>

        {/* Results Header */}
        <div className="text-left mb-6 flex items-center gap-2">
            <div className="flex gap-0.5">
                <div className="w-2 h-2 bg-red-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-[#f9a825] rounded-sm"></div>
                <div className="w-2 h-2 bg-[#004182] rounded-sm"></div>
            </div>
            <h3 className="text-sm font-bold text-gray-600">natiijada courses kaaga (Basic Computer)</h3>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {results.map((res) => (
            <div key={res.id} className="bg-white p-6 rounded-2xl border border-[#edf3ff] shadow-sm text-left hover:border-[#004182]/20 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-wide">{res.subject}</h4>
                <span className={`text-sm font-black ${res.score > 0 ? 'text-[#004182]' : 'text-gray-200'}`}>
                  {res.score > 0 ? `${res.score}%` : '-'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-50 rounded-full mb-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${res.score >= 50 ? 'bg-[#004182]' : (res.score > 0 ? 'bg-red-400' : 'bg-gray-100')}`}
                  style={{ width: `${res.score}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${res.score >= 50 ? 'text-green-500' : 'text-gray-300'}`}>
                  {res.score > 0 ? (res.score >= 50 ? 'Gudbay' : 'Hadhay') : 'Natiijo lama hayo'}
                </span>
                {res.score > 0 && <span className="text-[10px] font-black text-[#f9a825]">Grade: {res.grade}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Centered Sign Out */}
        <div className="flex justify-center mt-12">
          <button 
            onClick={onLogout}
            className="px-8 py-3 rounded-xl border border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
          >
            Ka bax bogga (Sign Out)
          </button>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center pb-10">
            <p className="text-[10px] font-black text-[#004182]/20 uppercase tracking-[0.3em] mb-4">Vision Institute • Learning is Limitless</p>
            <p className="text-sm font-black text-[#444]">Developed by <span className="text-[#004182]">Mokhtaar Foodicay</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
