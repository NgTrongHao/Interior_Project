import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid, Pagination, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getRequestByCustomer } from './http';
import Cookies from 'js-cookie';
import RequestDetail from './RequestDetail';
import { formatNumber } from '../../util/helper.js';
import { useRef } from 'react';

function MainContent() {

    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const token = Cookies.get('token');
    const popupRef = useRef();

    useEffect(() => {

        const fetchRequests = async () => {
            try {
                const response = await getRequestByCustomer(currentPage, 6, token);
                setRequests(response);
                // console.log(requests);
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

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            handleClosePopup();
        }
    };

    useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    return (

        <div className='flex flex-col gap-5 border-[2px] h-full'>

            {/* Button add new Request */}
            <div className="p-20 border-gray-800 w-full">
                <div className="grid grid-cols-2 gap-4 mb-4 rounded-full">
                    <Link to='manager' className='w-[135px]'>
                        <button className='bg-cyan-600 px-6 py-4 text-xl text-white rounded-3xl 
                        font-medium text-center hover:bg-cyan-700 hover:shadow-xl w-fit
                        duration-300 ease-in-out'>Tạo báo giá mới</button>
                    </Link>
                </div>
            </div>
            {/* End button add new Request */}

            {/* Main content display all request  */}
            <div className='grid grid-cols-3 gap-10'>
                {requests.map(request => (
                    <div key={request.id} className='border-cyan-800 hover:cursor-pointer   gap-4'
                        onClick={() => handleRequestClick(request)}>
                        {/* Card display card {id, status, price} */}
                        <Card sx={{ maxWidth: 400 }} className='bg-gray-900'>
                            <CardContent className='flex flex-col gap-6 px-5 '>
                                <Typography gutterBottom variant="h5" component="div">
                                    {request.id}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    <span className={`text-lg font-semibold
                                    ${request.customerRequestStatus === 'QUOTATION_COMPLETED' ? 'text-lime-700' :
                                            request.customerRequestStatus === 'CONSTRUCTION_REJECTED' ? 'text-red-600' :
                                                'text-yellow-600'
                                        }`}>
                                        {request.customerRequestStatusDescription}
                                    </span>
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    <span className='text-black text-2xl'>
                                        Giá:</span> <span>{formatNumber(request.price)}</span>
                                    <span>VND</span>
                                </Typography>
                            </CardContent>
                        </Card>
                        {/* End Card display card {id, status, price} */}

                    </div>
                ))}
            </div>
            {/* End main content display all request  */}

            {/* Display Request detail */}
            {selectedRequest && isPopupOpen && (
                <div ref={popupRef} className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 flex 
                items-center justify-center z-50 overflow-scroll">
                    <div className="bg-slate-100 p-10 rounded-2xl relative m-auto z-50 w-5/6">
                        <button onClick={handleClosePopup} className='px-4 py-3 text-zinc-400 hover:text-zinc-800 
                        m-2 rounded-full font-bold absolute top-0 left-0 text-2xl'>
                            &#10005;
                        </button>
                        <RequestDetail closePopup={handleClosePopup} request={selectedRequest} className='bg-transparent' />
                    </div>
                </div>
            )
            }
            {/* End Display Requset detail */}

            <div className='flex justify-content: flex-end 
            mb-auto justify-center my-48'> {/* Positions pagination at bottom, right-aligned */}
                <Pagination count={20} onChange={handlePageChange}
                    color="standard" size="large" /> {/* Increases font size to 1.25rem */}
            </div>
        </div>
    )
}

export default MainContent;
