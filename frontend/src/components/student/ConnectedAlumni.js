import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { getConnectedAlumni } from '../../services/connectionService';
import { getCurrentUser } from '../../services/authService';

function ConnectedAlumni() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await getConnectedAlumni(user.id);
      setConnections(response.connections || []);
    } catch (err) {
      setError('Failed to load connected alumni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading connections...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (connections.length === 0) {
    return (
      <Alert variant="info">
        🔗 You haven't connected with any alumni yet. Browse alumni and send connection requests!
      </Alert>
    );
  }

  return (
    <div>
      <h5 className="mb-3">✅ Your Connected Alumni ({connections.length})</h5>
      
      <Row>
        {connections.map((connection) => (
          <Col key={connection._id} md={6} lg={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h6>{connection.alumniName}</h6>
                <p className="text-muted small mb-2">
                  {connection.alumniDesignation} at {connection.alumniCompany}
                </p>

                {connection.alumniExperience && (
                  <p className="small mb-2">
                    📅 {connection.alumniExperience} years experience
                  </p>
                )}

                {connection.matchScore && (
                  <div className="mb-2">
                    <Badge bg="success">
                      Match Score: {connection.matchScore}%
                    </Badge>
                  </div>
                )}

                {connection.alumniExpertise && connection.alumniExpertise.length > 0 && (
                  <div className="mb-2">
                    <small><strong>Expertise:</strong></small>
                    <div>
                      {connection.alumniExpertise.slice(0, 3).map((exp, index) => (
                        <Badge key={index} bg="info" className="me-1 mb-1 small">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {connection.alumniSkills && connection.alumniSkills.length > 0 && (
                  <div className="mb-2">
                    <small><strong>Skills:</strong></small>
                    <div>
                      {connection.alumniSkills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1 small">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <hr />
                
                <small className="text-muted">
                  ✉️ {connection.alumniEmail}
                </small>
                
                <small className="text-muted d-block mt-1">
                  Connected: {new Date(connection.connectedAt).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ConnectedAlumni;