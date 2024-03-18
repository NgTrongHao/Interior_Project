import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import './RequestDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceProducts, setWorkspaceProducts] = useState({});
  const [showForm, setShowForm] = useState(true); // State mới để theo dõi trạng thái hiển thị của form
  const token = Cookies.get('token');

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
      setSelectedRowData(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
  const handleRemoveProduct = (indexToRemove) => {
    const newDetails = selectedRowData.requestDetails.filter((_, index) => index !== indexToRemove);
    setSelectedRowData(prevData => ({ ...prevData, requestDetails: newDetails }));
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
      
      // Fetch sản phẩm cho từng workspace và lưu lại
      data.forEach(workspace => {
        fetchProductsByWorkspace(workspace.workspace_name);
      });
    } catch (error) {
      console.error('Error fetching workspace options:', error);
    }
  };
  const handleAddProduct = () => {
    const newDetails = {
      quantity: 0,
      workspaceName: '',
      description: '',
      product: null
    };
    setSelectedRowData(prevData => ({
      ...prevData,
      requestDetails: [...prevData.requestDetails, newDetails]
    }));
  };
  
  const handleChangeWorkspace = (index, workspaceName) => {
    const newDetails = [...selectedRowData.requestDetails];
    newDetails[index].workspaceName = workspaceName;
    setSelectedRowData(prevData => ({ ...prevData, requestDetails: newDetails }));
    setSelectedWorkspace(workspaceName); 
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

  const renderDetailInputs = () => {
    {
      return selectedRowData.requestDetails.map((detail, index) => (
        
        <div class='request-details' key={index}>
          {/* Các trường khác */}
          <label className='Req-Component'>Product {index + 1} Quantity:</label>
          <input
            type="number"
            placeholder="Input number of product"
            value={detail.quantity || ''}
            onChange={(e) => {
              const newDetails = [...selectedRowData.requestDetails];
              newDetails[index].quantity = parseInt(e.target.value);
              setSelectedRowData(prevData => 
                ({ ...prevData, requestDetails: newDetails }));
            }}
          />
          <label className='Req-Component'>
            Product {index + 1} - Workspace:
          </label>
          <Select
            className="detail-select"
            value={detail.workspaceName || ''}
            onChange={(e) => handleChangeWorkspace(index, e.target.value)}
          >
            <MenuItem value="" disabled hidden>
              Select project's workspace
            </MenuItem>
            {workspaceOptions.map((workspace, index) => (
              <MenuItem key={index} value={workspace.workspace_name}>
                {workspace.workspace_name}
              </MenuItem>
            ))}
          </Select>
          <label className='Req-Component'>
            Product {index + 1} Description:
          </label>
          <input
            type="text"
            placeholder="Customer expectation about this product"
            value={detail.description || ''}
            onChange={(e) => {
              const newDetails = [...selectedRowData.requestDetails];
              newDetails[index].description = e.target.value;
              setSelectedRowData(prevData => 
                ({ ...prevData, requestDetails: newDetails }));
            }}
          />
          <label className='Req-Component'>
            Product {index + 1}:
          </label>
          <Select
            className="detail-select"
            value={detail.product || ''}
            onChange={(e) => {
              const newDetails = [...selectedRowData.requestDetails];
              newDetails[index].product = e.target.value;
              setSelectedRowData(prevData => 
                ({ ...prevData, requestDetails: newDetails }));
            }}
          >
            <MenuItem value="" disabled hidden>
              Select product
            </MenuItem>
            {workspaceProducts[detail.workspaceName]?.map((product, index) => (
              <MenuItem key={index} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
          <div className="Req-Component">
            <button className='remove-button'
              onClick={() => handleRemoveProduct(index)}>
                Remove Product
            </button>

          </div>
        </div>
        
      )
        
      );
    }
  };
  
  


  const handleConfirm = async () => {
    console.log(selectedRowData);
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRowData) // Gửi dữ liệu của yêu cầu đã chọn
      };

      const apiUrl = `http://localhost:8080/api/v1/request/auth/${selectedRowData.id}/confirmRequest`; // Endpoint để xác nhận yêu cầu
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data); // Log response từ API để kiểm tra
      handleBackToList();
      
      // Cập nhật lại trạng thái của yêu cầu hoặc thực hiện các hành động phù hợp khác
      // Ví dụ: Hiển thị thông báo xác nhận thành công, cập nhật UI, vv.
    } catch (error) {
      console.error('Error confirming request:', error);
    }
  };

  const navigate = useNavigate();

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
      navigate('/staff/requestList'); // Thực hiện chuyển hướng tới trang requestList
    } catch (error) {
      console.error('Error locking request:', error);
    }
  };




  return (
    <TableContainer component={Paper}>
      {showForm && selectedRowData ? (
        <div class='CusInfo'>
          <div>
            <div class='cusInfo-mainInformation'>

              <p class='CusInfo-Detail ID'>ID: {selectedRowData.id}</p>
              <p class='CusInfo-Detail Es'>Estimated Price: {selectedRowData.price}</p>
              <h3 class='CusInfo-Detail Info'>CUSTOMER'S INFORMATION</h3>
              <p class='CusInfo-Detail'>
                <label>Full Name:</label>
                <input
                  type="text"
                  placeholder="Input cutomer fullname"
                  value={selectedRowData.customer?.full_name || ''}
                  onChange={(e) => setSelectedRowData(prevData => 
                    ({ ...prevData, customer: { ...prevData.customer, full_name: e.target.value } }))}
                />
              </p>
              <p class='CusInfo-Detail'>
                <label>Phone:</label>
                <input
                  type="text"
                  placeholder="Input customer phone number"
                  value={selectedRowData.customer?.phone || ''}
                  onChange={(e) => setSelectedRowData(prevData => 
                    ({ ...prevData, customer: { ...prevData.customer, phone: e.target.value } }))}
                />
              </p>
              <p class='CusInfo-Detail'>
                <label>Email:</label>
                <input
                  type="text"
                  placeholder="Input customer email"
                  value={selectedRowData.customer?.email || ''}
                  onChange={(e) => setSelectedRowData(prevData =>
                    ({ ...prevData, customer: { ...prevData.customer, email: e.target.value } }))}
                />
              </p>
              <p class='CusInfo-Detail'>
                <label>ID Card:</label>
                <input
                  type="text"
                  placeholder="Input customer ID card number"
                  value={selectedRowData.customer?.id_card || ''}
                  onChange={(e) => setSelectedRowData(prevData => 
                    ({ ...prevData, customer: { ...prevData.customer, id_card: e.target.value } }))}
                />
              </p>  
              <p class='CusInfo-Detail'>
                <label>Note:</label>
                <input
                  type="text"
                  placeholder="Input notes for the project"
                  value={selectedRowData.customer?.note || ''}
                  onChange={(e) => setSelectedRowData(prevData => 
                    ({ ...prevData, customer: { ...prevData.customer, note: e.target.value } }))}
                />
              </p>
              <p class='CusInfo-Detail'>
                <label>Address:</label>
                <input
                  type="text"
                  placeholder="Input this project's address"
                  value={selectedRowData.customer?.address || ''}
                  onChange={(e) => setSelectedRowData(prevData => 
                    ({ ...prevData, customer: { ...prevData.customer, address: e.target.value } }))}
                />
              </p>
            </div>
            <h2 className='request-box'>Request details</h2>
            <div className="details-Box">
              {renderDetailInputs()}

            </div>
          </div>
          <div className="button">
            <div key="add-product">
              <button className='add-product-button' onClick={handleAddProduct}>Add Product</button>
            </div>
            <div className="Main-button">
              <button className='confirm-button' onClick={handleConfirm}>Confirm</button>
              <button className='back-button' onClick={handleBackToList}>Back to List</button>

            </div>
          </div>
        </div>
      ) : (
        <p> There are no request Detail to Display</p>
      )}
    </TableContainer>
  );
}
