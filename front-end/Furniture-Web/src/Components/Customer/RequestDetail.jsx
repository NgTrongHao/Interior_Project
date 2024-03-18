import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getProductDetail } from '../../util/managerHandle';
import { TabUnselected } from '@mui/icons-material';

function RequestDetail({ request }) {
    const [productDetails, setProductDetails] = useState({}); // State to store product details

    const requestDetail = request.requestDetails;
    const customer = request.customer;

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

    const getProductPrice = (productId) => {
        // Get product price from productDetails
        const product = productDetails[productId];
        return product ? product.price : 'Loading...';
    };

    return (

        <div className="p-6">
            <Card className="w-full mx-auto">
                <CardContent>
                    <Typography variant="h5" className="mb-4">Request Detail</Typography>
                    <Typography variant="body2 h5" className="mb-2">Customer</Typography>
                    <Typography variant="body2" className="mb-2">Email: {customer.email}</Typography>
                    <Typography variant="body2" className="mb-2">Phone: {customer.phone}</Typography>
                </CardContent>
            </Card>
            <Typography variant="h6" className="mt-6 mb-4">Request Details</Typography>
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>REQUEST ID</TableCell>
                            <TableCell align="right">Workspace</TableCell>
                            <TableCell align="right">Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestDetail.map((requested) => (
                            <TableRow key={requested.id}>
                                <TableCell>{requested.id}</TableCell>
                                <TableCell align="right">{requested.workspaceName}</TableCell>
                                <TableCell align="right">{getProductName(requested.product)}</TableCell>
                                <TableCell align="right">{getProductPrice(requested.product)}</TableCell>
                                <TableCell align="right">{requested.quantity}</TableCell>
                                <TableCell align="right">{requested.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h6" className="mt-6 mb-4">Total</Typography>
            <Typography variant="h3" className="text-black font-semibold">{request.price}</Typography>
        </div>
    );
}

export default RequestDetail;
