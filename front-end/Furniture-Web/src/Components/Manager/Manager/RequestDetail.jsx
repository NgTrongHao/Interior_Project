import React, { useState, useEffect } from 'react';
import { Popper, Fade, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { confirmProposal, rejectProposal } from '../../../util/managerHandle.js';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { getProductDetail } from '../../../util/managerHandle.js';
import axios from 'axios';
import Cookies from 'js-cookie';

function RequestDetail({ project, close }) {
    console.log(project);
    const customer = project.customer;
    const requestDetail = project.requestDetails;
    const proposal = project.proposal;
    const [productDetails, setProductDetails] = useState({}); // State to store product details
    console.log("Proposal Detail: ", proposal);

    const handleConfirm = async (proposalId) => {
        try {
            console.log(proposalId);
            await confirmProposal(proposalId);
            toast.success('Đã đồng ý hợp đồng');
            close(proposalId);
            // console.log(response);
            // Optionally, you can perform further actions based on the response
        } catch (error) {
            console.log(error);
            // Handle error if needed
        }
    };

    const handleReject = async (proposalId) => {
        try {
            console.log(proposalId);
            await rejectProposal(proposalId);
            toast.success(`Đã từ chối hợp đồng`);
            close(proposalId);
        } catch (error) {
            console.error('Error handling reject proposal:', error);
            toast.error('Failed to reject proposal. Please try again later.');
        }
    };
    console.log(proposal.file_path);
    return (

        <Popper open={true} transition className='fixed h-full'>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Box className='border-[2px] w-screen h-full bg-white overflow-y-scroll rounded-lg shadow-lg z-50'>
                        <button onClick={close} className='absolute text-6xl ml-72 top-1 right-4 px-5 py-3 text-cyan-800 font-semibold hover:text-sky-600'>&times;</button>
                        <div className='flex flex-col w-2/3 justify-center p-8'>
                            <h1 className='font-bold text-4xl text-cyan-800'>Thông tin khách hàng</h1>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Họ tên: </label>
                                <h2 className='text-xl'>{customer.full_name}</h2>
                            </div>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Email: </label>
                                <p className='text-xl'>{customer.email}</p>
                            </div>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Số điện thoại: </label>
                                <p className='text-xl'>{customer.phone}</p>
                            </div>
                        </div>
                        <div className='mx-8'>
                            <h1 className='font-bold text-4xl text-cyan-800'>Dự án: </h1>
                            <h1 className='text-2xl text-cyan-800'><span className='font-bold'>Id: </span><span>{project.id}</span></h1>
                            <h1 className='text-xl text-cyan-800'><span className='font-bold'>Trạng Thái: </span>
                                <span className='text-yellow-700'>
                                    {project.employeeRequestStatusDescription}
                                </span>
                            </h1>

                            <ToastContainer closeButton />

                            <Table aria-label="collapsible table" className='mt-4'>
                                <TableHead style={{backgroundColor: "#B0C4DE"}}>
                                    <TableRow>
                                        <TableCell>Khu vực thi công</TableCell>
                                        <TableCell align='center'>Sản phẩm: </TableCell>
                                        <TableCell>Mô tả</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requestDetail.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.workspaceName}</TableCell>
                                            <TableCell>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align='center'>Tên sản phẩm</TableCell>
                                                            <TableCell align='center'>Số lượng</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {item.products.map((product) => (
                                                            <TableRow key={item.workspace}>
                                                                <TableCell align='center'>{product.productName}</TableCell>
                                                                <TableCell align='center'>{product.quantity}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                            <TableCell>{item.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='mx-8'>
                            <h1 className='text-2xl text-cyan-800 font-bold'>Báo cáo sơ bộ</h1>
                            <p className='text-2xl text-cyan-800'>
                                <span className='font-semibold'>Code: </span>{proposal.id}</p>
                            <p><span className='text-cyan-800'>
                                <span className='font-bold'>Trạng thái:</span> </span> <span className='text-xl text-yellow-700'>
                                    {proposal.employeeStatusDescription}
                                </span></p>

                            <iframe
                                src={proposal.file_path}
                                title="Proposal File"
                                width="100%"
                                height="800px"
                                className='mx-auto'
                            />

                            <h1 className='font-bold text-6xl text-cyan-800 flex justify-end p-3.5'><span className="text-6xl">Tổng giá: </span> {proposal.price}</h1>
                            <div className='text-center mb-8'>
                                <button onClick={() => handleConfirm(proposal.id)} className='w-1/3 px-5 py-3 bg-cyan-700 
                                text-white font-semibold text-2xl hover:bg-cyan-800 rounded-full'>
                                    <span>Đồng ý</span>
                                </button>
                                <button onClick={() => handleReject(proposal.id)} className='w-1/3 px-5 py-3 bg-cyan-700 
                                text-white font-semibold text-2xl hover:bg-cyan-800 rounded-full'>
                                    <span>Từ chối</span>
                                </button>
                            </div>
                        </div>
                    </Box>
                </Fade>
            )}
        </Popper>
    );
}

export default RequestDetail;
