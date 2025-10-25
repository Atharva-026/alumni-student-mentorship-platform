import API from './api';

// Student Registration
export const registerStudent = async (data) => {
  try {
    const response = await API.post('/api/student/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
      localStorage.setItem('userType', 'student');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Student Login
export const loginStudent = async (data) => {
  try {
    const response = await API.post('/api/student/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
      localStorage.setItem('userType', 'student');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Alumni Registration
export const registerAlumni = async (data) => {
  try {
    const response = await API.post('/api/alumni/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.alumni));
      localStorage.setItem('userType', 'alumni');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Alumni Login
export const loginAlumni = async (data) => {
  try {
    const response = await API.post('/api/alumni/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.alumni));
      localStorage.setItem('userType', 'alumni');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Registration
export const registerAdmin = async (data) => {
  try {
    const response = await API.post('/api/admin/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      localStorage.setItem('userType', 'admin');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Login
export const loginAdmin = async (data) => {
  try {
    const response = await API.post('/api/admin/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      localStorage.setItem('userType', 'admin');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};