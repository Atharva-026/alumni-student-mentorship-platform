import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getRecommendedAlumni } from '../../services/connectionService';
import { getCurrentUser } from '../../services/authService';
import AlumniCard from './AlumniCard';
import { useNavigate } from 'react-router-dom';

function RecommendedAlumni() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user || !user.id) {
      navigate('/');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await getRecommendedAlumni(user.id);
        setRecommendations(response.matches || []);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // Empty dependency - only run once

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Finding best matches for you...</p>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">🤖 AI-Recommended Alumni</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {recommendations.length === 0 ? (
          <Alert variant="info">
            No recommendations yet. Complete your profile to get better matches!
          </Alert>
        ) : (
          <>
            <p className="text-muted mb-3">
              Based on your skills, interests, and goals - {recommendations.length} matches found
            </p>
            <Row>
              {recommendations.map((match, index) => (
                <Col key={match.alumni._id || index} md={6} lg={4}>
                  <AlumniCard 
                    alumni={match.alumni} 
                    matchScore={match.matchScore}
                    showMatchScore={true}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecommendedAlumni;