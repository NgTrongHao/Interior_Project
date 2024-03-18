import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './ProposalList.css';
// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
// import { Link } from 'react-router-dom';
// import './ProposalList.css';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';



export default function ProposalList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const token = Cookies.get('token'); // Lấy token từ cookie
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const apiUrl = `http://localhost:8080/api/v1/request/auth/status/WAITING_FOR_PLANNING?page=1&pageSize=9`;
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data);
      setRows(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Estimated Price</TableCell>
            <TableCell align="right">Customer Name</TableCell>
            <TableCell align="right">Request Status</TableCell>
            <TableCell align="right">View Details</TableCell>
            <TableCell align="right">Upload PDF </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.customer?.full_name}</TableCell>
              <TableCell align="right">{row.customerRequestStatus}</TableCell>
              
              <TableCell align="right">
                <button>
                  <Link to={`/staff/proposalDetails/${row.id}`}>View</Link>
              </button>
              </TableCell>
              <TableCell align="right">
                <button>
                  <Link to={`/staff/proposalPdf/${row.id}`}>Upload Proposal</Link>
              </button>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button component={Link} to="/staff">Back to StaffPage</Button> 
    </TableContainer>
 
  )
}
