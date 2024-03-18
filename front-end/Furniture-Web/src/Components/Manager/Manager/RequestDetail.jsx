import React, { useState, useEffect } from 'react';
import { Popper, Fade, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { confirmProposal, rejectProposal } from '../../../util/managerHandle.js';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { getProductDetail } from '../../../util/managerHandle.js';

function RequestDetail({ project, close }) {
    console.log(project);
    const customer = project.customer;
    const requestDetail = project.requestDetails;
    const proposal = project.proposal;

    const [productDetails, setProductDetails] = useState({}); // State to store product details

    const [productNames, setProductNames] = useState({});

    console.log(requestDetail);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const details = {};
            for (const requested of requestDetail) {
                try {
                    const productDetail = await getProductDetail(requested.product);
                    details[requested.product] = productDetail;
                } catch (error) {
                    console.error(`Error fetching product details for product ID ${requested.product}:`, error);
                    // Handle the error as needed
                    details[requested.product] = { name: 'Error', price: 'Error' };
                }
            }
            setProductDetails(details);
        };

        fetchProductDetails();
    }, [requestDetail]);

    const getProductName = (productId) => {
        // Get product name from productDetails
        const product = productDetails[productId];
        return product ? product.name : 'Loading...';
    };


    const handleConfirm = async (proposalId) => {
        try {
            console.log(proposalId);
            await confirmProposal(proposalId);
            toast.success('Confirmed Proposal successfully');
            close(proposalId);
            // console.log(response);
            // Optionally, you can perform further actions based on the response
        } catch (error) {
            console.log(error);
            // Handle error if needed
        }
        // console.log("Clicked");
    };

    const handleReject = async (proposalId) => {
        try {
            console.log(proposalId);
            await rejectProposal(proposalId);
            toast.success('Proposal with Id: ' + proposalId + ' was Rejected !');
            close(proposalId);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <Popper open={true} transition>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Box className='my-10 mx-96 border-[2px] w-4/5 bg-white rounded-lg shadow-lg z-auto'>
                        <button onClick={close} className='absolute text-6xl ml-72 top-1 right-4 px-5 py-3 text-cyan-800 font-semibold hover:text-sky-600'>&times;</button>
                        <div className='flex flex-col w-2/3 justify-center p-8'>
                            <h1 className='font-bold text-4xl text-cyan-800'>Customer Information</h1>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Full Name:</label>
                                <h2 className='text-xl'>{customer.full_name}</h2>
                            </div>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Email</label>
                                <p className='text-xl'>{customer.email}</p>
                            </div>
                            <div className='my-1'>
                                <label className='text-2xl font-bold text-cyan-800'>Phone Number</label>
                                <p className='text-xl'>{customer.phone}</p>
                            </div>
                        </div>
                        <div className='mx-8'>
                            <h1 className='font-bold text-4xl text-cyan-800'>Project</h1>
                            <h1 className='text-2xl text-cyan-800'><span className='font-bold'>Project Id: </span><span>{project.id}</span></h1>
                            <h1 className='text-xl text-cyan-800'><span className='font-bold'>Status: </span>
                                <span className='text-yellow-700'>
                                    {project.employeeRequestStatus === 'PROPOSAL_AWAITING_APPROVAL' ? 'WAITING APPROVAL' : ''}
                                </span>
                            </h1>
                            <ToastContainer closeButton />
                            <Table aria-label="collapsible table" className='mt-4'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Workspace</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requestDetail.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{getProductName(item.product)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.workspaceName}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='mt-8 mx-8'>
                            <h1 className='text-2xl text-cyan-800 font-bold'>Proposal</h1>
                            <p className='text-2xl text-cyan-800'><span className='font-semibold'>Code: </span>{proposal.id}</p>
                            <p><span className='text-cyan-800'><span className='font-bold'>Status:</span> </span> <span className='text-xl text-yellow-700'>
                                {proposal.employeeStatus}
                            </span></p>
                            {/* <h2 className='text-cyan-800'><span className='font-bold'>Data:</span> {proposal.file_path}</h2> */}
                            <iframe
                                src={proposal.file_path}
                                title="Proposal File"
                                width="100%"
                                height="500px"
                                frameBorder="0"
                            />
                            <p className='text-cyan-800'><span className='font-bold'>File Type:</span> {proposal.fileType}</p>
                            <p className='text-cyan-800'><span className='font-bold'>File Name</span> {proposal.fileName}</p>
                            <h1 className='font-bold text-6xl text-cyan-800'><span>Total: </span> {project.price}</h1>
                            <div className='text-center mb-8'>
                                <button onClick={() => handleConfirm(proposal.id)} className='w-1/3 px-5 py-3 bg-cyan-700 text-white font-semibold text-2xl hover:bg-cyan-800 rounded-full'>
                                    <span>Confirm Proposal</span>
                                </button>
                                <button onClick={() => handleReject(proposal.id)} className='w-1/3 px-5 py-3 bg-cyan-700 text-white font-semibold text-2xl hover:bg-cyan-800 rounded-full'>
                                    <span>Reject Request</span>
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
