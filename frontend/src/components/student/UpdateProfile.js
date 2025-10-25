import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import { getStudentProfile, updateStudentProfile } from '../../services/studentService';
import Navbar from '../common/Navbar';

function UpdateProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    skills: '',
    interests: '',
    projectTopic: '',
    learningGoals: '',
    availability: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile(user.id);
        const student = response.student;
        setFormData({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          phone: student.phone || '',
          skills: student.skills ? student.skills.join(', ') : '',
          interests: student.interests ? student.interests.join(', ') : '',
          projectTopic: student.projectTopic || '',
          learningGoals: student.learningGoals || '',
          availability: student.availability ? student.availability.join(', ') : ''
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        projectTopic: formData.projectTopic,
        learningGoals: formData.learningGoals,
        availability: formData.availability.split(',').map(a => a.trim()).filter(a => a)
      };

      await updateStudentProfile(user.id, dataToSend);
      setSuccess('Profile updated successfully!');
      
      // Update localStorage
      const updatedUser = {
        ...user,
        name: `${dataToSend.firstName} ${dataToSend.lastName}`
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <p>Loading...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Card>
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Update Your Profile</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Skills (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Python, React, JavaScript"
                />
                <Form.Text className="text-muted">
                  Separate multiple skills with commas
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Interests (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g., AI, Web Development, Startups"
                />
                <Form.Text className="text-muted">
                  Separate multiple interests with commas
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Project Topic</Form.Label>
                <Form.Control
                  type="text"
                  name="projectTopic"
                  value={formData.projectTopic}
                  onChange={handleChange}
                  placeholder="e.g., E-commerce Chatbot"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Learning Goals</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleChange}
                  placeholder="What do you want to learn?"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Availability (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Evenings, Weekends"
                />
                <Form.Text className="text-muted">
                  When are you available for mentorship?
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/student/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default UpdateProfile;