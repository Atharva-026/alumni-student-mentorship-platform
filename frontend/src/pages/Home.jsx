import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 mb-4">
            Alumni-Student Mentorship Platform
          </h1>
          <p className="lead mb-4">
            Connect with experienced alumni for personalized mentorship and guidance
          </p>
          
          <div className="d-flex justify-content-center gap-3 mt-5">
            <Link to="/student/register">
              <Button variant="primary" size="lg">
                Student Register
              </Button>
            </Link>
            <Link to="/alumni/register">
              <Button variant="success" size="lg">
                Alumni Register
              </Button>
            </Link>
            <Link to="/admin/register">
              <Button variant="warning" size="lg">
                Admin Register
              </Button>
            </Link>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Link to="/student/login">
              <Button variant="outline-primary">
                Student Login
              </Button>
            </Link>
            <Link to="/alumni/login">
              <Button variant="outline-success">
                Alumni Login
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline-warning">
                Admin Login
              </Button>
            </Link>
          </div>

          <div className="mt-5">
            <h3>Features</h3>
            <Row className="mt-4">
              <Col md={4}>
                <h5>🤖 AI Matching</h5>
                <p>Smart recommendations based on skills and interests</p>
              </Col>
              <Col md={4}>
                <h5>💬 Direct Messaging</h5>
                <p>Connect and chat with mentors</p>
              </Col>
              <Col md={4}>
                <h5>📱 Social Feed</h5>
                <p>Share achievements and industry updates</p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;