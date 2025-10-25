import API from './api';

// Get AI-recommended alumni for student
export const getRecommendedAlumni = async (studentId) => {
  const response = await API.get(`/api/connection/student-matches/${studentId}`);
  return response.data;
};

// Browse all alumni
export const getAllAlumni = async (studentId) => {
  const response = await API.get(`/api/connection/${studentId}/all-alumni`);
  return response.data;
};

// Browse all students (for alumni)
export const getAllStudents = async (alumniId) => {
  const response = await API.get(`/api/connection/alumni/${alumniId}/all-students`);
  return response.data;
};

// Get connected alumni for student
export const getConnectedAlumni = async (studentId) => {
  const response = await API.get(`/api/connection/student/${studentId}/connected`);
  return response.data;
};

// Send connection request
export const sendConnectionRequest = async (studentId, alumniId) => {
  console.log('=== CONNECTION REQUEST DEBUG ===');
  console.log('studentId:', studentId);
  console.log('alumniId:', alumniId);
  
  try {
    const response = await API.post('/api/connection/create', {
      studentId,
      alumniId
    });
    console.log('Success response:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Status:', error.response?.status);
    console.error('Error message:', error.response?.data);
    throw error;
  }
};

// Create connection (keeping for backward compatibility)
export const createConnection = async (studentId, alumniId) => {
  const response = await API.post('/api/connection/create', {
    studentId,
    alumniId
  });
  return response.data;
};

// Send message
export const sendMessage = async (data) => {
  const response = await API.post('/api/connection/send-message', data);
  return response.data;
};

// Get messages
export const getMessages = async (connectionId) => {
  const response = await API.get(`/api/connection/${connectionId}/messages`);
  return response.data;
};