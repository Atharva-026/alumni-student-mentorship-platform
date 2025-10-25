import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function StudentProfile({ student }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h3 className="mb-1">{student.firstName} {student.lastName}</h3>
            <p className="text-muted mb-0">{student.email}</p>
          </div>
          <Link to="/student/profile/edit">
            <Button variant="outline-primary" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>College:</strong> {student.collegeName}
            </p>
            <p className="mb-1">
              <strong>Year:</strong> {student.year}
            </p>
            <p className="mb-1">
              <strong>Branch:</strong> {student.branch}
            </p>
            {student.phone && (
              <p className="mb-1">
                <strong>Phone:</strong> {student.phone}
              </p>
            )}
          </div>

          <div className="col-md-6">
            {student.projectTopic && (
              <p className="mb-1">
                <strong>Project:</strong> {student.projectTopic}
              </p>
            )}
            {student.learningGoals && (
              <p className="mb-1">
                <strong>Goals:</strong> {student.learningGoals}
              </p>
            )}
          </div>
        </div>

        {student.skills && student.skills.length > 0 && (
          <div className="mb-3">
            <strong>Skills:</strong>
            <div className="mt-2">
              {student.skills.map((skill, index) => (
                <Badge key={index} bg="primary" className="me-1 mb-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {student.interests && student.interests.length > 0 && (
          <div className="mb-3">
            <strong>Interests:</strong>
            <div className="mt-2">
              {student.interests.map((interest, index) => (
                <Badge key={index} bg="success" className="me-1 mb-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {student.availability && student.availability.length > 0 && (
          <div>
            <strong>Availability:</strong>
            <div className="mt-2">
              {student.availability.map((time, index) => (
                <Badge key={index} bg="info" className="me-1 mb-1">
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default StudentProfile;