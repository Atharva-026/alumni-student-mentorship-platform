import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import API from '../services/api';

import Navbar from '../components/common/Navbar';
import StudentProfile from '../components/student/StudentProfile';
import RecommendedAlumni from '../components/student/RecommendedAlumni';
import BrowseAlumni from '../components/student/BrowseAlumni';
import ConnectedAlumni from '../components/student/ConnectedAlumni';

function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.get(`/api/student/${user.id}`);
        setStudent(response.data.student);
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

  if (!student) {
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
        <h2 className="mb-4">Student Dashboard</h2>

        <StudentProfile student={student} />

        <Tabs defaultActiveKey="connected" className="mb-3">
          <Tab eventKey="connected" title="My Connections">
            <ConnectedAlumni />
          </Tab>
          <Tab eventKey="recommended" title="Recommended">
            <RecommendedAlumni />
          </Tab>
          <Tab eventKey="browse" title="Browse Alumni">
            <BrowseAlumni />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default StudentDashboard;
