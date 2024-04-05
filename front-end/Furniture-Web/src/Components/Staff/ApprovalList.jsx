
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';
import './RequestList.css';

export default function ApprovalList() {
  const [rows, setRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [token, setToken] = useState('');
  const [workspaceOptions, setWorkspaceOptions] = useState([]);


  useEffect(() => {
    const token = Cookies.get('token');
    setToken(token);
    fetchRequestList(token);
    fetchWorkspaceOptions();
  }, []);

  const fetchRequestList = async (token) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8080/api/v1/request/auth/status/CONSTRUCTION_IN_PROGRESS?page=1&pageSize=9', requestOptions);
      const data = await response.json();
      console.log(data);
      setRows(data);
    } catch (error) {
      console.error('Error fetching data of Request List:', error);
    }
  };

  const fetchWorkspaceOptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/workspace');
      const data = await response.json();
      console.log(data);
      setWorkspaceOptions(data);
    } catch (error) {
      console.error('Error fetching workspace options:', error);
    }
  };

  const handleClickAPI = async (rowId) => {
    try {
      const token = Cookies.get('token');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const apiUrl = `http://localhost:8080/api/v1/request/auth/${rowId}`;
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data);
      setSelectedRowData(data);
    } catch (error) {
      console.error('Error handling click:', error);
    }
  };

  const handleClick = (rowId) => {
    handleClickAPI(rowId);
  };

  const handleBackToList = () => {
    setSelectedRowData(null);
  };

  const handleConfirm = async () => {
    try {
      const token = Cookies.get('token');
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRowData)
      };

      const apiUrl = `http://localhost:8080/api/v1/request/auth/${selectedRowData.id}/confirmRequest`;
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data);

      // You may call fetchRequestList() here to refresh the table after successful confirmation
      setSelectedRowData(null);
    } catch (error) {
      console.error('Error confirming row:', error);
    }
  };



  return (
    <TableContainer component={Paper}>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead style={{backgroundColor: "#B0C4DE"}}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Giá sơ bộ</TableCell>
            <TableCell align="right">Tên khách hàng</TableCell>
            <TableCell align="right">Trạng thái</TableCell>
            <TableCell align="right">Xem chi tiết</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              onClick={() => handleClick(row.id)}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.price} VND</TableCell>
              <TableCell align="right">{row.customer.full_name}</TableCell>
              <TableCell align="right">Báo giá thành công</TableCell>
              <TableCell align="right">
                <button>
                  <Link to={`/staff/proposalDetails/${row.id}`}>View</Link>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </TableContainer>
  );
}
