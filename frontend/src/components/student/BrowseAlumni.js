import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { getAllAlumni } from '../../services/connectionService';
import { getCurrentUser } from '../../services/authService';
import AlumniCard from './AlumniCard';
import { useNavigate } from 'react-router-dom';

function BrowseAlumni() {
  const [allAlumni, setAllAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/');
      return;
    }

    const fetchAlumni = async () => {
      try {
        const response = await getAllAlumni(user.id);
        const alumniList = response.alumni || [];
        setAllAlumni(alumniList);
        setFilteredAlumni(alumniList);
      } catch (err) {
        setError('Failed to load alumni');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []); // Empty dependency - only run once

  // Separate useEffect for search filtering
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredAlumni(allAlumni);
    } else {
      const filtered = allAlumni.filter(alumni => {
        const searchLower = value.toLowerCase();
        return (
          alumni.firstName?.toLowerCase().includes(searchLower) ||
          alumni.lastName?.toLowerCase().includes(searchLower) ||
          alumni.company?.toLowerCase().includes(searchLower) ||
          alumni.designation?.toLowerCase().includes(searchLower) ||
          (alumni.expertise && alumni.expertise.some(exp => 
            exp.toLowerCase().includes(searchLower)
          )) ||
          (alumni.skills && alumni.skills.some(skill => 
            skill.toLowerCase().includes(searchLower)
          ))
        );
      });
      setFilteredAlumni(filtered);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading alumni...</p>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">👥 Browse All Alumni</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <InputGroup className="mb-4">
          <InputGroup.Text>🔍</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name, company, expertise, or skills..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>

        {filteredAlumni.length === 0 ? (
          <Alert variant="info">
            {searchTerm ? 'No alumni match your search.' : 'No alumni available yet.'}
          </Alert>
        ) : (
          <>
            <p className="text-muted mb-3">
              Showing {filteredAlumni.length} alumni
            </p>
            <Row>
              {filteredAlumni.map((alumni) => (
                <Col key={alumni._id} md={6} lg={4}>
                  <AlumniCard alumni={alumni} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default BrowseAlumni;