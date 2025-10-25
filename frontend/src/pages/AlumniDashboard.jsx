import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import API from '../services/api';
import Navbar from '../components/common/Navbar';
import AlumniProfile from '../components/alumni/AlumniProfile';
import ConnectionRequests from '../components/alumni/ConnectionRequests';
import BrowseStudents from '../components/alumni/BrowseStudents';

function AlumniDashboard() {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.get(`/api/alumni/${user.id}`);
        setAlumni(response.data.alumni);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <p>Loading dashboard...</p>
        </Container>
      </>
    );
  }

  if (!alumni) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <p>Failed to load profile</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">👨‍💼 Alumni Dashboard</h2>

        <AlumniProfile alumni={alumni} />

        <Tabs defaultActiveKey="requests" className="mb-3">
          <Tab eventKey="requests" title="📬 Connection Requests">
            <ConnectionRequests />
          </Tab>
          <Tab eventKey="students" title="👥 Browse Students">
            <BrowseStudents />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default AlumniDashboard;