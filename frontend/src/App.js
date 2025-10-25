import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Student Auth
import StudentRegister from './components/auth/StudentRegister';
import StudentLogin from './components/auth/StudentLogin';

// Student Components
import UpdateProfile from './components/student/UpdateProfile';

// Alumni Auth
import AlumniRegister from './components/auth/AlumniRegister';
import AlumniLogin from './components/auth/AlumniLogin';

// Admin Auth
import AdminRegister from './components/auth/AdminRegister';
import AdminLogin from './components/auth/AdminLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Student Routes */}
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile/edit" element={<UpdateProfile />} />
          
          {/* Alumni Routes */}
          <Route path="/alumni/register" element={<AlumniRegister />} />
          <Route path="/alumni/login" element={<AlumniLogin />} />
          <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;