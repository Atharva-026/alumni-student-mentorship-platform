import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function AlumniProfile({ alumni }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h3 className="mb-3">{alumni.firstName} {alumni.lastName}</h3>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Company:</strong> {alumni.company}
            </p>
            <p className="mb-1">
              <strong>Designation:</strong> {alumni.designation}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {alumni.email}
            </p>
            {alumni.phone && (
              <p className="mb-1">
                <strong>Phone:</strong> {alumni.phone}
              </p>
            )}
          </div>

          <div className="col-md-6">
            {alumni.yearsOfExperience && (
              <p className="mb-1">
                <strong>Experience:</strong> {alumni.yearsOfExperience} years
              </p>
            )}
            {alumni.department && (
              <p className="mb-1">
                <strong>Department:</strong> {alumni.department}
              </p>
            )}
          </div>
        </div>

        {alumni.expertise && alumni.expertise.length > 0 && (
          <div className="mb-3">
            <strong>Expertise:</strong>
            <div className="mt-2">
              {alumni.expertise.map((exp, index) => (
                <Badge key={index} bg="info" className="me-1 mb-1">
                  {exp}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {alumni.skills && alumni.skills.length > 0 && (
          <div>
            <strong>Skills:</strong>
            <div className="mt-2">
              {alumni.skills.map((skill, index) => (
                <Badge key={index} bg="secondary" className="me-1 mb-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AlumniProfile;