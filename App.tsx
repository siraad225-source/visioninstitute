
import React, { useState, useEffect } from 'react';
import { apiService, FullStudentRecord } from './services/apiService';
import { AppState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal';

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { isAdmin: boolean }>({
    isAuthenticated: false,
    isAdmin: false,
    student: null,
    results: [],
  });

  useEffect(() => {
    apiService.init(); 
  }, []);

  const handleLogin = async (id: string, pass: string) => {
    // New Admin Credentials as requested
    if (id.toLowerCase() === 'mukho' && pass === '500') {
      setState({
        isAuthenticated: true,
        isAdmin: true,
        student: null,
        results: [],
      });
      return;
    }

    const record = await apiService.authenticate(id, pass);
    if (record) {
      setState({
        isAuthenticated: true,
        isAdmin: false,
        student: record.profile,
        results: record.results,
      });
    } else {
      alert("Aqoonsi khaldan! Fadlan hubi ID iyo Password-kaaga.");
    }
  };

  const handleLogout = () => {
    setState({
      isAuthenticated: false,
      isAdmin: false,
      student: null,
      results: [],
    });
  };

  if (!state.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (state.isAdmin) {
    return <AdminPortal onLogout={handleLogout} />;
  }

  return (
    <Dashboard 
      student={state.student!} 
      results={state.results} 
      onLogout={handleLogout} 
    />
  );
};

export default App;
