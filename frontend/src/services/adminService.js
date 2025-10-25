import API from './api';

// Get platform statistics
export const getAdminStats = async () => {
  const response = await API.get('/api/admin/stats');
  return response.data;
};

// Get all alumni
export const getAllAlumniForAdmin = async () => {
  const response = await API.get('/api/admin/alumni');
  return response.data;
};

// Approve alumni
export const approveAlumni = async (alumniId) => {
  const response = await API.put(`/api/admin/alumni/${alumniId}/approve`);
  return response.data;
};

// Reject alumni
export const rejectAlumni = async (alumniId) => {
  const response = await API.put(`/api/admin/alumni/${alumniId}/reject`);
  return response.data;
};

// Delete alumni
export const deleteAlumni = async (alumniId) => {
  const response = await API.delete(`/api/admin/alumni/${alumniId}`);
  return response.data;
};