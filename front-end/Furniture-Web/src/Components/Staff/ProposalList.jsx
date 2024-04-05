import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './ProposalList.css';
// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
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
    console.log(rows);
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
        <TableHead style={{backgroundColor: "#B0C4DE"}}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Giá dự thảo</TableCell>
            <TableCell align="right">Tên khách hàng</TableCell>
            <TableCell align="right">Trạng thái báo giá</TableCell>
            <TableCell align="right">Xem chi tiết</TableCell>
            <TableCell align="right">Tải lên file báo giá </TableCell>
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
              <TableCell align="right">{row.price} VND</TableCell>
              <TableCell align="right">{row.customer?.full_name}</TableCell>
              <TableCell align="right">{row.employeeRequestStatusDescription}</TableCell>

              <TableCell align="right">
                <button>
                  <Link to={`/staff/proposalDetails/${row.id}`}>Xem</Link>
                </button>
              </TableCell>
              <TableCell align="right">
                <button>
                  <Link to={`/staff/proposalPdf/${row.id}`}>Cập nhật</Link>
                </button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

    </TableContainer>

  )
}
