import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { getAllStudents } from '../../services/connectionService';
import { getCurrentUser } from '../../services/authService';
import StudentCard from './StudentCard';
import { useNavigate } from 'react-router-dom';

function BrowseStudents() {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
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

    const fetchStudents = async () => {
      try {
        const response = await getAllStudents(user.id);
        const studentList = response.students || [];
        setAllStudents(studentList);
        setFilteredStudents(studentList);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, navigate]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student => {
        const searchLower = value.toLowerCase();
        return (
          student.firstName?.toLowerCase().includes(searchLower) ||
          student.lastName?.toLowerCase().includes(searchLower) ||
          student.collegeName?.toLowerCase().includes(searchLower) ||
          student.department?.toLowerCase().includes(searchLower) ||
          (student.skills && student.skills.some(skill => 
            skill.toLowerCase().includes(searchLower)
          )) ||
          (student.interests && student.interests.some(interest => 
            interest.toLowerCase().includes(searchLower)
          ))
        );
      });
      setFilteredStudents(filtered);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading students...</p>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">👥 Browse All Students</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <InputGroup className="mb-4">
          <InputGroup.Text>🔍</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name, college, skills, or interests..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>

        {filteredStudents.length === 0 ? (
          <Alert variant="info">
            {searchTerm ? 'No students match your search.' : 'No students available yet.'}
          </Alert>
        ) : (
          <>
            <p className="text-muted mb-3">
              Showing {filteredStudents.length} students
            </p>
            <Row>
              {filteredStudents.map((student) => (
                <Col key={student._id} md={6} lg={4}>
                  <StudentCard student={student} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default BrowseStudents;