import API from './api';

// Get student profile by ID
export const getStudentProfile = async (studentId) => {
  const response = await API.get(`/api/student/${studentId}`);
  return response.data;
};

// Update student profile
export const updateStudentProfile = async (studentId, data) => {
  const response = await API.put(`/api/student/${studentId}`, data);
  return response.data;
};

// Get student connections
export const getStudentConnections = async (studentId) => {
  const response = await API.get(`/api/student/${studentId}/connections`);
  return response.data;
};