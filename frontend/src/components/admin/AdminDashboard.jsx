import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import { getAdminStats } from '../../services/adminService';
import Navbar from '../common/Navbar';
import ManageAlumni from './ManageAlumni';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await getAdminStats();
      setStats(response.stats);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">🔧 Admin Dashboard</h2>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center bg-primary text-white">
              <Card.Body>
                <h3>{stats?.totalStudents || 0}</h3>
                <p className="mb-0">👨‍🎓 Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center bg-success text-white">
              <Card.Body>
                <h3>{stats?.activeAlumni || 0}</h3>
                <p className="mb-0">✅ Active Alumni</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center bg-warning text-dark">
              <Card.Body>
                <h3>{stats?.pendingAlumni || 0}</h3>
                <p className="mb-0">⏳ Pending Alumni</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="text-center bg-info text-white">
              <Card.Body>
                <h3>{stats?.activeConnections || 0}</h3>
                <p className="mb-0">🤝 Active Connections</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="text-center bg-secondary text-white">
              <Card.Body>
                <h3>{stats?.totalConnections || 0}</h3>
                <p className="mb-0">📊 Total Connections</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Management Tabs */}
        <Tabs defaultActiveKey="alumni" className="mb-3">
          <Tab eventKey="alumni" title="👥 Manage Alumni">
            <ManageAlumni onUpdate={fetchStats} />
          </Tab>
          <Tab eventKey="insights" title="📊 Insights">
            <Card>
              <Card.Body>
                <h5>Platform Insights</h5>
                <p className="text-muted">Detailed analytics coming soon!</p>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default AdminDashboard;