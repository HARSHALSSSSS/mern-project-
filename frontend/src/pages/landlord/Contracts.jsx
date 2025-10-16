import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Alert } from 'react-bootstrap';
import Loading from '../../components/Loading';

const API_URL = process.env.REACT_APP_API_URL || 'https://mern-project-api.onrender.com/api';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📋 Contracts Response:', response.data);

      // Handle response structure
      const contractsData = response.data.contracts || response.data.data || [];
      setContracts(Array.isArray(contractsData) ? contractsData : []);
    } catch (err) {
      console.error('❌ Error fetching contracts:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load contracts');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (contract) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/contracts/${contract._id}/terminate`,
        { terminationDate: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Contract terminated successfully');
        setShowDetails(false);
        fetchContracts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to terminate contract');
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowDetails(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '-';
  };

  const statusTemplate = (rowData) => {
    const status = rowData?.status || 'unknown';
    const statusClass = status === 'active' ? 'success' : 'secondary';
    return <span className={`badge bg-${statusClass}`}>{status.toUpperCase()}</span>;
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-mr-2"
        onClick={() => handleViewDetails(rowData)}
        tooltip="View Details"
      />
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="container mt-4">
      <h2>💼 Rental Contracts</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {contracts.length === 0 ? (
        <Alert variant="info">No contracts found</Alert>
      ) : (
        <DataTable value={contracts} paginator rows={10} responsive>
          <Column
            field="tenant.name"
            header="Tenant"
            body={(rowData) => rowData?.tenant?.name || '-'}
          />
          <Column
            field="property.title"
            header="Property"
            body={(rowData) => rowData?.property?.title || '-'}
          />
          <Column
            field="startDate"
            header="Start Date"
            body={(rowData) => formatDate(rowData?.startDate)}
          />
          <Column
            field="endDate"
            header="End Date"
            body={(rowData) => formatDate(rowData?.endDate)}
          />
          <Column
            field="rentAmount"
            header="Monthly Rent"
            body={(rowData) => formatCurrency(rowData?.rentAmount)}
          />
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: '100px' }}
          />
        </DataTable>
      )}

      {/* Contract Details Dialog */}
      <Dialog
        visible={showDetails}
        style={{ width: '50vw' }}
        header="Contract Details"
        modal
        onHide={() => setShowDetails(false)}
      >
        {selectedContract && (
          <div>
            <div className="mb-3">
              <h5>Tenant Information</h5>
              <p>
                <strong>Name:</strong> {selectedContract.tenant?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedContract.tenant?.email}
              </p>
            </div>

            <div className="mb-3">
              <h5>Property Information</h5>
              <p>
                <strong>Title:</strong> {selectedContract.property?.title}
              </p>
              <p>
                <strong>Address:</strong> {selectedContract.property?.address}
              </p>
              <p>
                <strong>Type:</strong> {selectedContract.property?.type}
              </p>
            </div>

            <div className="mb-3">
              <h5>Contract Terms</h5>
              <p>
                <strong>Start Date:</strong> {formatDate(selectedContract.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDate(selectedContract.endDate)}
              </p>
              <p>
                <strong>Monthly Rent:</strong> {formatCurrency(selectedContract.rentAmount)}
              </p>
              <p>
                <strong>Security Deposit:</strong> {formatCurrency(selectedContract.depositAmount)}
              </p>
              <p>
                <strong>Payment Day:</strong> {selectedContract.paymentDay}th of each month
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`badge bg-${selectedContract.status === 'active' ? 'success' : 'secondary'}`}>
                  {selectedContract.status.toUpperCase()}
                </span>
              </p>
            </div>

            <div className="mb-3">
              <h5>Terms & Conditions</h5>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
                {selectedContract.terms}
              </p>
            </div>

            <div className="d-flex gap-2">
              <Button
                label="Close"
                icon="pi pi-times"
                onClick={() => setShowDetails(false)}
                className="p-button-secondary"
              />
              {selectedContract.status === 'active' && (
                <Button
                  label="Terminate Contract"
                  icon="pi pi-trash"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to terminate this contract?')) {
                      handleTerminate(selectedContract);
                    }
                  }}
                  className="p-button-danger"
                />
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Contracts;
