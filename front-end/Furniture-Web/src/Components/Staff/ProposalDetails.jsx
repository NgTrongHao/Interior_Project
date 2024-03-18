import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';
import './ProposalDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [workspaceProducts, setWorkspaceProducts] = useState({});
  const [showForm, setShowForm] = useState(true);
  const token = Cookies.get('token');
  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    fetchRequestDetails(id);
    fetchWorkspaceOptions();
  }, [id]);

  const fetchRequestDetails = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const apiUrl = `http://localhost:8080/api/v1/request/auth/${id}`;
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data);
      setSelectedRowData(data); // Update selectedRowData with fetched data
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const fetchWorkspaceOptions = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8080/api/v1/workspace', requestOptions);
      const data = await response.json();
      console.log(data);
      setWorkspaceOptions(data);
      
      data.forEach(workspace => {
        fetchProductsByWorkspace(workspace.workspace_name);
      });
    } catch (error) {
      console.error('Error fetching workspace options:', error);
    }
  };

  const fetchProductsByWorkspace = async (workspaceName) => {
    console.log("Fetching products for workspace:", workspaceName);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/workspace/${workspaceName}/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("Fetched products:", data);
      setWorkspaceProducts(prevProducts => ({
        ...prevProducts,
        [workspaceName]: data
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleBackToList = async () => {
    try {
      await fetch(`http://localhost:8080/api/v1/request/auth/${selectedRowData.id}/lock`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowForm(false);
      navigate('/staff/proposalList'); // Redirect to proposalList
    } catch (error) {
      console.error('Error locking request:', error);
    }
  };

  const renderDetailInputs = () => {
    return selectedRowData?.requestDetails.map((detail, index) => (
      <div className='request-details' key={index}>
        <p className='Req-Component'>Product {index + 1} Quantity: {detail.quantity}</p>
        <p className='Req-Component'>Product {index + 1} - Workspace: {detail.workspaceName}</p>
        <p className='Req-Component'>Product {index + 1} Description: {detail.description}</p>
        <p className='Req-Component'>Product {index + 1}: {workspaceProducts[detail.workspaceName]?.find(product => product.id === detail.product)?.name}</p>
      </div>
    ));
  };

  return (
    <TableContainer component={Paper}>
      {showForm && selectedRowData ? (
        <div className='CusInfo'>
          <div>
            <div className='cusInfo-mainInformation'>
              <p className='CusInfo-Detail ID'>ID: {selectedRowData.id}</p>
              <p className='CusInfo-Detail Es'>Estimated Price: {selectedRowData.price}</p>
              <h3 className='CusInfo-Detail Info'>CUSTOMER'S INFORMATION</h3>
              <p className='CusInfo-Detail'>
                <label>Full Name:</label>
                <span>{selectedRowData.customer?.full_name || ''}</span>
              </p>
              <p className='CusInfo-Detail'>
                <label>Phone:</label>
                <span>{selectedRowData.customer?.phone || ''}</span>
              </p>
              <p className='CusInfo-Detail'>
                <label>Email:</label>
                <span>{selectedRowData.customer?.email || ''}</span>
              </p>
              <p className='CusInfo-Detail'>
                <label>ID Card:</label>
                <span>{selectedRowData.customer?.id_card || ''}</span>
              </p>
              <p className='CusInfo-Detail'>
                <label>Note:</label>
                <span>{selectedRowData.customer?.note || ''}</span>
              </p>
              <p className='CusInfo-Detail'>
                <label>Address:</label>
                <span>{selectedRowData.customer?.address || ''}</span>
              </p>
            </div>
            <h2 className='request-box'>Request details</h2>
            <div className="details-Box">
              {renderDetailInputs()}
            </div>
          </div>
          <div className="button">
            <div className="Main-button">
              <button className='back-button' onClick={handleBackToList}>Back to List</button>
            </div>
          </div>
        </div>
      ) : (
        <p>There are no request details to display</p>
      )}
    </TableContainer>
  );
}
