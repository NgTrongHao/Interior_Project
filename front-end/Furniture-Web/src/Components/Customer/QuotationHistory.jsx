import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getRequestByCustomer } from './http';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Modal } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function QuotationHistory() {
    const { requestId } = useParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [historyData, setHistoryData] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    function formatdate(data) {
        // Chuyển đổi ngày thành chuỗi định dạng dd/MM/yyyy
        console.log(data);
        let date = new Date(data);
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const fetchHistoryData = async (requestId) => {
        try {
            const customerToken = Cookies.get('token');
            const response = await axios.get(`http://localhost:8080/api/v1/request/auth/getRequestHistory/${requestId}`, {
                headers: {
                    'Authorization': 'Bearer ' + customerToken,
                    'Content-Type': 'application/json'
                }
            });
            setHistoryData(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getRequestByCustomer(currentPage, 6, Cookies.get('token'));
                setRequests(response);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        fetchRequests();
    }, [currentPage]);

    useEffect(() => {
        if (historyData) {
            console.log("History Data: ", historyData);
            // Truy cập các thành phần của historyData ở đây
            console.log(`ID: ${historyData[0].versionNumber}`);
            historyData[0].requestStatusHistoryDtoList.map((history) => (
                console.log(history.dateTime),
                console.log(history.requestStatus)
            ))
        }
    }, [historyData]);

    return (
        <div className='flex flex-col justify-between h-full items-center'>
            <div className='w-full'>
                <p className='text-4xl font-bold'>Danh sách báo giá</p>
                <div className='w-full'>
                    <TableContainer component={Paper} width="100%">
                        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                            <TableHead style={{backgroundColor: "#B0C4DE"}}>
                                <TableRow>
                                    <TableCell align='center'>ID</TableCell>
                                    <TableCell align="right">Trạng Thái</TableCell>
                                    <TableCell align="right">Giá (VND)</TableCell>
                                    <TableCell align="right">Lịch Sử</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell align='center' component="th" scope="row">{request.id}</TableCell>
                                        <TableCell align='right' component="th" scope="row" style={{ color: 'green' }}>{request.customerRequestStatusDescription}</TableCell>
                                        <TableCell align='right' component="th" scope="row">{request.price}</TableCell>
                                        <TableCell align='right' component="th" scope="row"><button onClick={() => { fetchHistoryData(request.id); setOpenModal(true); }}>Xem lịch sử</button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Nhân Viên Phê Duyệt</TableCell>
                                    <TableCell align="right">Trạng thái</TableCell>
                                    <TableCell align="right">Date Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyData && historyData.map((item) => (
                                    item.requestStatusHistoryDtoList.map((historyItem, index) => (
                                        <TableRow key={historyItem.id}>
                                            <TableCell align="right">
                                                {historyItem.user.fullName}
                                            </TableCell>
                                            <TableCell align="right">{historyItem.
                                                requestStatusDescription
                                            }</TableCell>
                                            <TableCell align="right">{formatdate(historyItem.dateTime)}</TableCell>
                                        </TableRow>
                                    ))
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>

            <Pagination count={20} onChange={handlePageChange} color="standard" size="large" bottom="0" />

        </div>
    );
}

export default QuotationHistory;
