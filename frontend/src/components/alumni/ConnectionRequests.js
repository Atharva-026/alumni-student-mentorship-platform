import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { getCurrentUser } from '../../services/authService';
import API from '../../services/api';

function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/connection/alumni/${user.id}/requests`);
      setRequests(response.data.connections || []);
    } catch (err) {
      setError('Failed to load connection requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      setProcessingId(connectionId);
      await API.post(`/api/connection/accept/${connectionId}`);
      
      // Remove from pending list
      setRequests(requests.filter(req => req._id !== connectionId));
      alert('Connection accepted successfully!');
    } catch (err) {
      console.error('Accept error:', err);
      alert(err.response?.data?.message || 'Failed to accept connection');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      setProcessingId(connectionId);
      await API.post(`/api/connection/reject/${connectionId}`);
      
      // Remove from pending list
      setRequests(requests.filter(req => req._id !== connectionId));
      alert('Connection rejected');
    } catch (err) {
      console.error('Reject error:', err);
      alert(err.response?.data?.message || 'Failed to reject connection');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (requests.length === 0) {
    return (
      <Alert variant="info">
        📭 No pending connection requests at the moment.
      </Alert>
    );
  }

  return (
    <div>
      <h5 className="mb-3">Pending Connection Requests ({requests.length})</h5>
      
      <Row>
        {requests.map((request) => (
          <Col key={request._id} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <h6>{request.studentName}</h6>
                <p className="text-muted small mb-2">{request.studentEmail}</p>
                <p className="small mb-2">
                  <strong>College:</strong> {request.studentCollege}
                </p>

                {request.matchScore && (
                  <div className="mb-2">
                    <Badge bg="success">
                      Match Score: {request.matchScore}%
                    </Badge>
                  </div>
                )}

                {request.studentSkills && request.studentSkills.length > 0 && (
                  <div className="mb-2">
                    <small><strong>Skills:</strong></small>
                    <div>
                      {request.studentSkills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1 small">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {request.studentInterests && request.studentInterests.length > 0 && (
                  <div className="mb-3">
                    <small><strong>Interests:</strong></small>
                    <div>
                      {request.studentInterests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} bg="info" className="me-1 mb-1 small">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(request._id)}
                    disabled={processingId === request._id}
                    className="flex-fill"
                  >
                    {processingId === request._id ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      '✅ Accept'
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(request._id)}
                    disabled={processingId === request._id}
                    className="flex-fill"
                  >
                    {processingId === request._id ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      '❌ Reject'
                    )}
                  </Button>
                </div>

                <small className="text-muted d-block mt-2">
                  Requested: {new Date(request.createdAt).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ConnectionRequests;