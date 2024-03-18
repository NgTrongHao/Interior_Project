import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchAvailableWorkspace, fetchAvailableProducts } from './http';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';

function Project() {

    const [availableWorkspace, setAvailableWorkspace] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    // set selected workspace to add at link /{workspaceName}/products to get products of that space
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState();
    const [requestDetails, setRequestDetails] = useState([]);
    const customer = localStorage.getItem('customer');
    const token = Cookies.get('token');
    const userData = JSON.parse(customer);

    const userRequest = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone
    }

    console.log(userRequest);

    // console.log(userData);
    // console.log(token);

    useEffect(() => {
        async function fetchWorkspace() {
            try {
                // call method to get all workspace.
                const workspace = await fetchAvailableWorkspace();
                setAvailableWorkspace(workspace);
            } catch (error) {
                setError({ message: error.message || 'Could not fetch places, please try again later.' });
            }
        }
        fetchWorkspace();
    }, []);

    useEffect(() => {
        async function fetchProducts(workspaceName) {
            try {
                const products = await fetchAvailableProducts(workspaceName);
                setAvailableProducts(products);
            } catch (error) {
                setError({ message: error.message || 'Could not fetch products, please try again later.' });
            }
        }
        if (selectedWorkspace) {
            fetchProducts(selectedWorkspace.workspace_name);
        }
    }, [selectedWorkspace]);
    // work when workspace was selected -> render all products of that space

    const handleAddProduct = (event) => {
        event.preventDefault(); // prevent page load
        const productName = event.target.elements.productName.value;
        const productQuantity = parseInt(event.target.elements.productQuantity.value, 10);
        const description = event.target.elements.description.value;

        if (!productName || !productQuantity || isNaN(productQuantity) || productQuantity <= 0) {
            return;
        }

        const selectedProductId = selectedProducts ? selectedProducts.id : null;
        const existingProductIndex = requestDetails.findIndex(detail => detail.product === selectedProductId);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong danh sách, thì cập nhật số lượng
            const updatedRequestDetails = [...requestDetails];
            updatedRequestDetails[existingProductIndex].quantity += productQuantity;
            setRequestDetails(updatedRequestDetails);
        } else {
            const newRequestDetail = {
                product: selectedProductId, // Sử dụng id của sản phẩm thay vì tên sản phẩm
                quantity: productQuantity,
                workspaceName: selectedWorkspace ? selectedWorkspace.workspace_name : '', // Lấy tên workspace
                description: description
            };
            setRequestDetails(prevDetails => [...prevDetails, newRequestDetail]);
        }

        // Xóa nội dung của các trường input sau khi thêm sản phẩm
        event.target.elements.workspaceName.value = '';
        event.target.elements.productName.value = ''; // Xóa giá trị của trường nhập liệu "Product"
        event.target.elements.productQuantity.value = ''; // Xóa giá trị của trường nhập liệu "Product Quantity"
        event.target.elements.description.value = ''; // Xóa giá trị của trường nhập liệu "Description"
        setSelectedProducts(null);
    };

    const handleSubmitRequest = () => {

        const requestData = {
            customer: userRequest,
            requestDetails: requestDetails
        }

        console.log(requestData);

        axios.post('http://localhost:8080/api/v1/request/auth', requestData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Thêm token vào header Authorization
                'Content-Type': 'application/json' // Đảm bảo loại nội dung là JSON
            }
        }).catch(err => {
            console.log(err);
        });

        // Gửi requestDetails lên server
        if (requestDetails.length == 0) {
            console.log("Nothings to request");
            toast.error("Nothings to request");
            return;
        }
        console.log('Request Details:', requestDetails);
        console.log('Request Details sent successfully');
        toast.success('Request Details sent successfully')
        // Reset requestDetails sau khi gửi thành công
        setRequestDetails([]);
    };

    return (

        <div className='flex flex-col gap-6 border-[2px]'>

            <ToastContainer position='top-center' />

            {/* <TextField
                id="outlined-basic"
                label="Your Name"
                variant="outlined"
                sx={{ width: 300 }}
                InputProps={{ readOnly: true }}
                defaultValue={userData ? userData.fullName : ''}
                fullWidth
            />
            <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                sx={{ width: 300 }}
                InputProps={{ readOnly: true }}
                defaultValue={customer ? userData.email : ''}
                fullWidth
            />
            <TextField
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                sx={{ width: 300 }}
                InputProps={{ readOnly: true }}
                defaultValue={customer ? userData.phone : ''}
                fullWidth
            />
            <div className='flex flex-col gap-5'>
                <form className='flex flex-col gap-4' onSubmit={handleAddProduct}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={availableWorkspace}
                        getOptionLabel={(option) => option.workspace_name}
                        onChange={(event, newValue) => setSelectedWorkspace(newValue)}
                        renderInput={(params) => <TextField {...params} key={availableWorkspace.id} name="workspaceName" label="Room" variant="outlined" sx={{ width: 300 }} />}
                        fullWidth
                    />

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={availableProducts}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => option.id === value.id} // Specify how to compare the selected option with the options in the list
                        onChange={(event, newValue) => setSelectedProducts(newValue)}
                        renderInput={(params) => <TextField {...params} name="productName" label="Product" variant="outlined" sx={{ width: 300 }} />}
                    />

                    <TextField
                        id="number"
                        label="Product Quantity"
                        type="number"
                        name="productQuantity"
                        variant="outlined"
                        sx={{ width: 150 }}
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        multiline
                        size='small'
                        name="description"
                        sx={{ width: 300 }}
                    />
                    <button type="submit" className='px-4 py-2 border-[2px] bg-cyan-700 hover:bg-cyan-900 text-white'>Add Product</button>
                </form>

                <div className='flex gap-6'>
                    {selectedWorkspace && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-4 w-[500px]'>
                                {requestDetails.map((detail, index) => (
                                    <div key={index} className='flex justify-between items-center gap-2'>
                                        <div>{detail.product}</div>
                                        <div>{detail.quantity}</div>
                                        <div>{detail.workspaceName}</div>
                                        <div>{detail.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button className='px-4 py-2 border-[2px] bg-cyan-700 hover:bg-cyan-900 text-white rounded-full' onClick={handleSubmitRequest}>Send Request</button>
            </div> */}

            <div className="isolate bg-white py-24 sm:py-32 lg:px-8 px-12">
                <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                    <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}></div>
                </div>
                <div className="mx-auto max-w-2xl text-center px-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create Request</h2>
                    {/* <p className="mt-2 text-lg leading-8 text-gray-600">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p> */}
                </div>
                <form onSubmit={handleAddProduct} className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className='sm:col-span-2'>
                            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                            <div className="mt-2.5">
                                <input defaultValue={customer ? userData.email : ''} type="text" name="last-name" id="last-name" autocomplete="family-name"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" readOnly />
                            </div>
                            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Full Name
                            </label>
                            <div className="mt-2.5">
                                <input type="text" name="first-name" id="first-name" autocomplete="given-name" defaultValue={userData ? userData.fullName : ''}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
                                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 
                                    sm:text-sm sm:leading-6" readOnly />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label for="company" className="block text-sm font-semibold leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2.5">
                                <input type="text" defaultValue={customer ? userData.phone : ''} name="company" id="company" autocomplete="organization"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                focus:ring-indigo-600 sm:text-sm sm:leading-6" readOnly />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            {/* <label for="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Workspace</label> */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={availableWorkspace}
                                getOptionLabel={(option) => option.workspace_name}
                                onChange={(event, newValue) => setSelectedWorkspace(newValue)}
                                renderInput={(params) => <TextField {...params} key={availableWorkspace.id} name="workspaceName" label="Workspace" variant="outlined" sx={{ width: 360 }} />}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={availableProducts}
                                getOptionLabel={(option) => option.name}
                                getOptionSelected={(option, value) => option.id === value.id} // Specify how to compare the selected option with the options in the list
                                onChange={(event, newValue) => setSelectedProducts(newValue)}
                                renderInput={(params) => <TextField {...params} name="productName" label="Product" variant="outlined" sx={{ width: 360 }} />}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <TextField
                                id="number"
                                label="Product Quantity"
                                type="number"
                                name="productQuantity"
                                variant="outlined"
                                sx={{ width: 150 }}
                                inputProps={{ min: 0 }}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label for="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                            <div className="mt-2.5">
                                <textarea name="description" id="description" rows="4" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add Product
                        </button>
                    </div>
                    <div className='flex gap-6'>
                        {selectedWorkspace && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-4 w-[500px]'>
                                    {requestDetails.map((detail, index) => (
                                        <div key={index} className='flex justify-between items-center gap-2'>
                                            <div>{detail.product}</div>
                                            <div>{detail.quantity}</div>
                                            <div>{detail.workspaceName}</div>
                                            <div>{detail.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-10">
                        <button type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmitRequest}>
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>

        </div>

    );
}

export default Project;
