import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Pagination, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getRequestByCustomer } from './http';
import Cookies from 'js-cookie';
import RequestDetail from './RequestDetail';

function MainContent() {

    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getRequestByCustomer(currentPage, 9, token);
                setRequests(response);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, [currentPage, token]);

    const handleRequestClick = (request) => {
        setSelectedRequest(request);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <div className='flex flex-col gap-5 border-[2px] ml-7 mb-6'>
            <div className="p-20 border-gray-800">
                <div className="grid grid-cols-2 gap-4 mb-4 rounded-full">
                    <Link to='manager' className='w-[135px]'>
                        <button className='bg-cyan-600 px-6 py-4 text-xl text-white rounded-3xl font-medium text-center hover:bg-cyan-700 hover:shadow-2xl w-fit'>Add New Request</button>
                    </Link>
                </div>
            </div>
            <ul className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-4'>
                {requests.map(request => (
                    <li key={request.id} className='px-10 py-6 border-cyan-800 hover:cursor-pointer hover:bg-sky-50 gap-4' onClick={() => handleRequestClick(request)}>
                        <Card sx={{ maxWidth: 345 }} className='bg-gray-900'>
                            <CardContent className='flex flex-col gap-6 px-5 py-4'>
                                <Typography gutterBottom variant="h5" component="div">
                                    {request.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <span className='text-black'>STATUS:</span> <span className={`${request.customerRequestStatus === 'QUOTATION_COMPLETED' ? 'text-lime-700' : 'text-yellow-600'} font-semibold text-xl`}>{request.customerRequestStatus}</span>
                                </Typography>
                            </CardContent>
                        </Card>
                    </li>
                ))}
            </ul>


            {selectedRequest && isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-slate-100 p-10 rounded-xl relative"> {/* Sử dụng relative để đặt vị trí tương đối cho con */}
                        <button onClick={handleClosePopup} className='px-4 py-3 text-zinc-400 hover:text-zinc-800 m-2 rounded-full font-bold absolute top-0 left-0 text-2xl'>&#10005;</button> {/* Sử dụng absolute để đặt vị trí tuyệt đối cho nút */}
                        <RequestDetail request={selectedRequest} className='bg-transparent' />
                    </div>
                </div>

            )}

            <div className='flex justify-content: flex-end mt-auto justify-center my-48'> {/* Positions pagination at bottom, right-aligned */}
                <Pagination count={20} onChange={handlePageChange} color="secondary" size="large" className='text-xl' /> {/* Increases font size to 1.25rem */}
            </div>
        </div>
    )
}

export default MainContent;
