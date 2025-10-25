import React, { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    alert('Logged out successfully!');
    navigate('/');
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="p-5">
        <h1 className="text-warning mb-4">Welcome, {user.name}! 🏫</h1>
        
        <Card className="mb-3 bg-light">
          <Card.Body>
            <h5>Your Profile</h5>
            <p><strong>Email:</strong> {user.email}</p>
            <p className="text-muted">Full dashboard coming in Phase 5!</p>
          </Card.Body>
        </Card>

        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </Container>
  );
}

export default AdminDashboard;