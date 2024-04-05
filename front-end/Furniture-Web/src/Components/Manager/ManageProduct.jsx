import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { fetchAvailableProducts, fetchAvailableWorkspace } from '../Customer/http';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'antd';
import EditIcon from '@mui/icons-material/Edit';

import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';

export default function ManageProduct() {
    const [workspaceProducts, setWorkspaceProducts] = useState([]);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false); // Thêm state để kiểm soát việc mở modal chỉnh sửa sản phẩm
    const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);
    const [area, setArea] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); // State lưu trữ sản phẩm được chọn để chỉnh sửa

    const [newProductData, setNewProductData] = useState({
        name: '',
        price: '',
        description: ''
    });
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [availableAreas, setAvailableAreas] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Lấy dữ liệu workspace
                const workspaceData = await fetchAvailableWorkspace();
                console.log('Workspace:', workspaceData);

                // Duyệt qua từng workspace và lấy sản phẩm tương ứng
                const productsPromises = workspaceData.map(async (workspace) => {
                    const productData = await fetchAvailableProducts(workspace.workspace_name);
                    return { workspace: workspace.workspace_name, products: productData };
                });

                // Đợi tất cả các promises hoàn thành và set state cho workspaceProducts
                const allProducts = await Promise.all(productsPromises);
                setWorkspaceProducts(allProducts);

                // Lấy dữ liệu khu vực từ API
                const areasResponse = await axios.get('URL_GET_AREAS', {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                setAvailableAreas(areasResponse.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, []);


    const openAddProductModal = () => {
        setIsAddProductModalOpen(true);
    };
    const openAddWorkspaceModal = () => {
        setIsAddWorkspaceModalOpen(true);
    };

    const closeAddProductModal = () => {
        setIsAddProductModalOpen(false);
        // Đặt lại dữ liệu của sản phẩm mới về trạng thái ban đầu
        setNewProductData({
            name: '',
            price: '',
            description: ''
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProductData({
            ...newProductData,
            [name]: value
        });
    };

    const handleWorkspaceInputChange = (e) => {
        setNewWorkspaceName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = getToken(); // Lấy token từ cookie
            const { name, price, description } = newProductData;
            console.log(newProductData);
            console.log(area);
            const response = await axios.post(`http://localhost:8080/api/v1/workspace/${area}/products`, { name, price, description }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('New Product Response:', response.data);
            // Sau khi xử lý xong, đóng modal
            alert('Thêm sản phẩm thành công!');
            closeAddProductModal();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddWorkspaceSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = getToken(); // Lấy token từ cookie
            const response = await axios.post(`http://localhost:8080/api/v1/workspace/addWorkspace`, { workspace_name: newWorkspaceName }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('New Workspace Response:', response.data);
            // Sau khi xử lý xong, đóng modal
            alert('Thêm khu vực thi công mới thành công!');
            setIsAddWorkspaceModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseWorkspace = () => {
        setIsAddWorkspaceModalOpen(false);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const token = getToken(); // Lấy token từ cookie
            const response = await axios.delete(`http://localhost:8080/api/v1/product/delete/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Delete Product Response:', response.data);
            // Thực hiện các bước cần thiết sau khi xóa sản phẩm (ví dụ: làm mới dữ liệu)
            alert('Xóa sản phẩm thành công!');
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openEditProductModal = (product) => {
        setSelectedProduct(product); // Lưu thông tin sản phẩm được chọn vào state selectedProduct
        setIsEditProductModalOpen(true); // Mở modal chỉnh sửa sản phẩm
    };

    // const handleEditInputChange = (e) => {
    //     const { name, value } = e.target;
    //     const updatedProduct = { ...selectedProduct, [name]: value };
    //     setSelectedProduct(updatedProduct);
    //     console.log(updatedProduct); // Kiểm tra giá trị của updatedProduct sau khi cập nhật
    // };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        const updatedProduct = { ...selectedProduct, [name]: value };
        setSelectedProduct(updatedProduct);
    };


    // const handleUpdateProduct = async (productID) => {
    //     try {
    //         console.log(selectedProduct);
    //         const token = getToken(); // Lấy token từ cookie
    //         const { id, name, price, description, unit } = selectedProduct;
    //         const priceValue = parseFloat(price); // Chuyển đổi giá trị thành số
    //         console.log(selectedProduct);
    //         const response = await axios.put(`http://localhost:8080/api/v1/product/update/${productID}`, { id, name, price: priceValue, description, unit }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         // console.log('Update Product Response:', response.data);
    //         // Thực hiện các bước cần thiết sau khi cập nhật sản phẩm (ví dụ: làm mới dữ liệu)
    //         if (response.status === 200) {
    //             alert('Cập nhật sản phẩm thành công!');
    //             // setIsEditProductModalOpen(false); // Đóng modal sau khi cập nhật
    //             // window.location.reload();
    //         }

    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const handleUpdateProduct = async (productId) => {
        try {
            console.log(productId);
            console.log(`http://localhost:8080/api/v1/product/update/${productId}`);

            const token = getToken();
            const { id, name, price, description, unit } = selectedProduct;
            const priceValue = parseFloat(price);
            const response = await axios.put(`http://localhost:8080/api/v1/product/update/${productId}`,
                { id, name, price: priceValue, description, unit },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Update Product Response:', response.data);
            alert('Cập nhật sản phẩm thành công!');
            // setIsEditProductModalOpen(false);
            // window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };


    // Hàm lấy token từ cookie
    function getToken() {
        return Cookies.get('token');
    }

    return (
        <div className='overflow-auto'>
            <div className="flex ">
                <div className="addProduct">
                    <Button style={{ backgroundColor: "#25D366" }} onClick={openAddProductModal}>Thêm mới sản phẩm</Button>
                </div>
                <div className="addWorkspace">
                    <Button style={{ backgroundColor: "#B0C4DE" }} onClick={openAddWorkspaceModal}>Thêm mới khu vực thi công</Button>
                </div>
            </div>

            {workspaceProducts.map((workspace, index) => (
                <div key={index}>
                    <h2 className='text-4xl font-bold m-3 '>{workspace.workspace}</h2>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead style={{ backgroundColor: "#B0C4DE", fontSize: "30px" }}>
                                <TableRow>
                                    <TableCell style={{ width: "10%" }}>ID Sản phẩm</TableCell>
                                    <TableCell style={{ width: "20%" }}>Tên sản phẩm</TableCell>
                                    <TableCell style={{ width: "45%" }}>Mô tả chi tiết</TableCell>
                                    <TableCell style={{ width: "15%" }}>Giá</TableCell>
                                    <TableCell style={{ width: "10%" }}>Cập nhật</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workspace.products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{product.price}VND</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center space-x-2">
                                                <>
                                                    <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-red-500 text-white" onClick={() => handleDeleteProduct(product.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </button>
                                                    <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-blue-500 text-white" onClick={() => openEditProductModal(product)}>
                                                        <EditIcon fontSize="small" />
                                                    </button>
                                                </>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}
            {isAddWorkspaceModalOpen && (
                <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-[#DFE9F4] opacity-100 z-50">
                    <div className="modal-content bg-white w-2/3 h-2/3 rounded-xl p-6">
                        <span className="close text-6xl text-red-600 font-bold cursor-pointer" onClick={handleCloseWorkspace}>&times;</span>
                        <h2 className='text-6xl font-bold text-center'>Thêm khu vực thi công mới</h2>
                        <form className='flex flex-col items-center justify-Center'>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Tên khu vực:</label>
                                <TextField
                                    type="text"
                                    name="workspaceName"
                                    value={newWorkspaceName}
                                    onChange={handleWorkspaceInputChange}
                                    sx={{ width: "100%", '& input': { fontSize: '16px' } }}
                                />
                            </div>
                            <Button style={{ backgroundColor: "#008000", color: "#fff" }} type="submit" onClick={handleAddWorkspaceSubmit}>Thêm khu vực</Button>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal để thêm sản phẩm mới */}
            {isAddProductModalOpen && (
                <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-[#DFE9F4] opacity-100 z-50">
                    <div className="modal-content bg-white w-2/3 h-2/3 rounded-xl p-6">
                        <span className="close text-6xl text-red-600 font-bold cursor-pointer" onClick={closeAddProductModal}>&times;</span>
                        <h2 className='text-6xl font-bold text-center'>Thêm sản phẩm mới</h2>
                        <form className='flex flex-col items-center justify-Center'>
                            <div className='w-1/2 leading-loose m-3'>
                                <label className='text-3xl font-bold text-cyan-600'>Khu vực thi công:</label>
                                <select
                                    name="area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                >
                                    <option className='h-full' value="">Chọn khu vực</option>
                                    {workspaceProducts.map((workspace, index) => (
                                        <option className='leading-4 text-3xl' key={index} value={workspace.workspace}>

                                            {workspace.workspace}


                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Tên sản phẩm:</label>
                                <TextField
                                    type="text"
                                    name="name"
                                    value={newProductData.name}
                                    onChange={handleInputChange}
                                    sx={{ width: "100%", '& input': { fontSize: '16px' } }}
                                />
                            </div>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Giá:</label>
                                <TextField
                                    type="text"
                                    name="price"
                                    value={newProductData ? newProductData.price : ''}
                                    onChange={handleInputChange}
                                    sx={{ width: "100%", '& input': { fontSize: '16px' } }}
                                />
                            </div>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Mô tả:</label>
                                <TextField
                                    name="description"
                                    value={newProductData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    InputProps={{
                                        style: { fontSize: '16px' }
                                    }}
                                />
                            </div>
                            <Button style={{ backgroundColor: "#008000", color: "#fff" }} type="submit" onClick={handleSubmit}>Thêm sản phẩm</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal để chỉnh sửa sản phẩm */}
            {isEditProductModalOpen && (
                <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-[#DFE9F4] opacity-100 z-50">
                    <div className="modal-content bg-white w-2/3 h-2/3 rounded-xl p-6">
                        <span className="close text-6xl text-red-600 font-bold cursor-pointer" onClick={() => setIsEditProductModalOpen(false)}>&times;</span>
                        <h2 className='text-6xl font-bold text-center'>Chỉnh sửa sản phẩm</h2>
                        <form className='flex flex-col items-center justify-Center'>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Tên sản phẩm:</label>
                                <TextField
                                    type="text"
                                    name="name"
                                    value={selectedProduct.name}
                                    onChange={handleEditInputChange}
                                    sx={{ width: "100%", '& input': { fontSize: '16px' } }}
                                />
                            </div>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Giá:</label>
                                <TextField
                                    type="text"
                                    name="price"
                                    value={selectedProduct.price} VND
                                    onChange={handleEditInputChange}
                                    sx={{ width: "100%", '& input': { fontSize: '16px' } }}
                                />
                            </div>
                            <div className='w-1/2 leading-loose m-3'>
                                <label>Mô tả:</label>
                                <TextField
                                    name="description"
                                    value={selectedProduct.description}
                                    onChange={handleEditInputChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    InputProps={{
                                        style: { fontSize: '16px' }
                                    }}
                                />
                            </div>
                            <Button style={{ backgroundColor: "#008000", color: "#fff" }} type="submit" onClick={() => handleUpdateProduct(selectedProduct.id)}>Cập nhật sản phẩm</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
