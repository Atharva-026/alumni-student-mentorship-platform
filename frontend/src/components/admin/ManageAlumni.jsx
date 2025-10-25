import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { getAllAlumniForAdmin, approveAlumni, rejectAlumni, deleteAlumni } from '../../services/adminService';

function ManageAlumni({ onUpdate }) {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [filter, alumni]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await getAllAlumniForAdmin();
      setAlumni(response.alumni || []);
    } catch (err) {
      setError('Failed to load alumni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAlumni = () => {
    if (filter === 'all') {
      setFilteredAlumni(alumni);
    } else {
      setFilteredAlumni(alumni.filter(a => a.accountStatus === filter));
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this alumni?')) return;
    
    try {
      setProcessingId(id);
      await approveAlumni(id);
      await fetchAlumni();
      if (onUpdate) onUpdate();
      alert('Alumni approved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve alumni');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this alumni?')) return;
    
    try {
      setProcessingId(id);
      await rejectAlumni(id);
      await fetchAlumni();
      if (onUpdate) onUpdate();
      alert('Alumni rejected');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject alumni');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete the alumni and all their connections!')) return;
    
    try {
      setProcessingId(id);
      await deleteAlumni(id);
      await fetchAlumni();
      if (onUpdate) onUpdate();
      alert('Alumni deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete alumni');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading alumni...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>All Alumni ({filteredAlumni.length})</h5>
        <Form.Select 
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
        </Form.Select>
      </div>

      {filteredAlumni.length === 0 ? (
        <Alert variant="info">No alumni found</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((alum) => (
                <tr key={alum._id}>
                  <td>{alum.firstName} {alum.lastName}</td>
                  <td>{alum.email}</td>
                  <td>{alum.company}</td>
                  <td>{alum.designation}</td>
                  <td>{alum.yearsOfExperience} years</td>
                  <td>{getStatusBadge(alum.accountStatus)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {alum.accountStatus === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(alum._id)}
                            disabled={processingId === alum._id}
                          >
                            {processingId === alum._id ? <Spinner size="sm" /> : '✓'}
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleReject(alum._id)}
                            disabled={processingId === alum._id}
                          >
                            {processingId === alum._id ? <Spinner size="sm" /> : '✗'}
                          </Button>
                        </>
                      )}
                      {alum.accountStatus === 'rejected' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(alum._id)}
                          disabled={processingId === alum._id}
                        >
                          {processingId === alum._id ? <Spinner size="sm" /> : 'Approve'}
                        </Button>
                      )}
                      {alum.accountStatus === 'active' && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleReject(alum._id)}
                          disabled={processingId === alum._id}
                        >
                          {processingId === alum._id ? <Spinner size="sm" /> : 'Deactivate'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(alum._id)}
                        disabled={processingId === alum._id}
                      >
                        {processingId === alum._id ? <Spinner size="sm" /> : '🗑️'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ManageAlumni;