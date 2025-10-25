import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function StudentCard({ student }) {
  return (
    <Card className="mb-3 h-100">
      <Card.Body>
        <h5>{student.firstName} {student.lastName}</h5>
        
        <p className="text-muted mb-2">
          🎓 {student.collegeName}
        </p>

        {student.department && (
          <p className="mb-2">
            <small>📚 {student.department}</small>
          </p>
        )}

        {student.graduationYear && (
          <p className="mb-2">
            <small>📅 Class of {student.graduationYear}</small>
          </p>
        )}

        {student.skills && student.skills.length > 0 && (
          <div className="mb-2">
            <small><strong>Skills:</strong></small>
            <div>
              {student.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} bg="secondary" className="me-1 mb-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {student.interests && student.interests.length > 0 && (
          <div className="mb-2">
            <small><strong>Interests:</strong></small>
            <div>
              {student.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} bg="info" className="me-1 mb-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            ✉️ {student.email}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default StudentCard;