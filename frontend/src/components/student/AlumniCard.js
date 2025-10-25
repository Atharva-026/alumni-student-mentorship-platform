import React, { useState } from 'react';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { sendConnectionRequest } from '../../services/connectionService';
import { getCurrentUser } from '../../services/authService';

function AlumniCard({ alumni }) {
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Send connection request with studentId and alumniId
      await sendConnectionRequest(user.id, alumni._id);
      
      setRequestSent(true);
      alert('Connection request sent successfully!');
    } catch (err) {
      console.error('Connection error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send connection request';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-3 h-100">
      <Card.Body>
        <h5>{alumni.firstName} {alumni.lastName}</h5>
        <p className="text-muted mb-2">
          {alumni.designation} at {alumni.company}
        </p>

        {alumni.yearsOfExperience && (
          <p className="mb-2">
            <small>📅 {alumni.yearsOfExperience} years experience</small>
          </p>
        )}

        {alumni.expertise && alumni.expertise.length > 0 && (
          <div className="mb-2">
            {alumni.expertise.slice(0, 3).map((exp, index) => (
              <Badge key={index} bg="info" className="me-1 mb-1">
                {exp}
              </Badge>
            ))}
          </div>
        )}

        {error && <div className="alert alert-danger py-1 px-2 small">{error}</div>}

        <Button
          variant={requestSent ? "success" : "primary"}
          size="sm"
          onClick={handleConnect}
          disabled={loading || requestSent}
          className="w-100"
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Sending...
            </>
          ) : requestSent ? (
            '✅ Request Sent'
          ) : (
            '🤝 Connect'
          )}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AlumniCard;