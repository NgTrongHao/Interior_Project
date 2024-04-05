import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import ProductTable from "./ProductTable.jsx";
import Cookies from "js-cookie";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { fetchProductById } from './http.js';
import axios from "axios";

const getCustomerInfo = () => {

    const customer = JSON.parse(localStorage.getItem('customer'));
    if (customer) {
        const { fullName, phone, email } = customer;
        return { fullName, phone, email };
    } else {
        return null;
    }

}

function Project() {

    const initialCustomerInfo = getCustomerInfo();

    const [workspaces, setWorkspaces] = useState([]);
    const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
    const [productUnit, setProductUnit] = useState('');
    const [requestData, setRequestData] = useState({
        customer: initialCustomerInfo,
        requestDetails: [
            {
                workspaceName: "",
                description: '',
                length: 0,
                width: 0,
                products: []
            }
        ]
    });
    const [selectedWorkspaces, setSelectedWorkspaces] = useState({});
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [isValidLength, setIsValidLength] = useState(true);
    const [isValidWidth, setIsValidWidth] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false); // State để theo dõi trạng thái xác nhận
    const navigate = useNavigate(); // Sử dụng useNavigate để lấy hàm điều hướng


    useEffect(() => {
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        console.log(requestData)
    }, [requestData])

    const fetchWorkspaces = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/workspace");
            if (!response.ok) {
                throw new Error("Failed to fetch workspaces.");
            }
            const data = await response.json();
            setAvailableWorkspaces(data);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
        }
    };

    const getToken = () => {
        return Cookies.get('token');
    };

    const addWorkspace = () => {
        const newWorkspace = {
            workspaceName: "",
            description: '',
            length: 0,
            width: 0,
            products: []
        };
        setRequestData(prevData => ({
            ...prevData,
            requestDetails: [...prevData.requestDetails, newWorkspace]
        }));
    };

    const addProduct = (workspaceIndex) => {
        const updatedRequestData = { ...requestData };
        const products = [...updatedRequestData.requestDetails[workspaceIndex].products, { productId: "", quantity: 0, length: 0, width: 0, height: 0, description: "" }];
        updatedRequestData.requestDetails[workspaceIndex].products = products;
        updatedRequestData.requestDetails[workspaceIndex].workspaceName = selectedWorkspaces[updatedRequestData.requestDetails[workspaceIndex].id].label;
        setRequestData(updatedRequestData);
    };

    // const addProduct = (workspaceIndex) => {

    //     const updatedRequestData = { ...requestData };
    //     const workspaceName = updatedRequestData.requestDetails[workspaceIndex].workspaceName;

    //     // Tìm kiếm workspace có workspaceName tương ứng trong availableWorkspaces
    //     const workspace = availableWorkspaces.find(workspace => workspace.workspace_name === workspaceName);

    //     if (workspace) {
    //         // Tạo một sản phẩm mới với productId, quantity, và description mặc định
    //         const newProduct = { productId: "", quantity: 0, description: "" };

    //         // Thêm sản phẩm mới vào danh sách sản phẩm của workspace tương ứng
    //         updatedRequestData.requestDetails[workspaceIndex].products.push(newProduct);

    //         // Cập nhật requestData
    //         setRequestData(updatedRequestData);
    //     } else {
    //         console.error(`Workspace "${workspaceName}" not found in availableWorkspaces.`);
    //     }
    // };


    const deleteWorkspace = (workspaceIndex) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails.splice(workspaceIndex, 1);
        setRequestData(updatedRequestData);
    };

    const deleteProduct = (workspaceIndex, productIndex) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products.splice(productIndex, 1);
        setRequestData(updatedRequestData);
    };

    const handleWorkspaceChange = (selectedOption, requestDetailId) => {
        setSelectedWorkspaces({
            ...selectedWorkspaces,
            [requestDetailId]: selectedOption
        });
        console.log(selectedOption)
        setSelectedWorkspace(selectedOption);
    };

    const handleEditQuantity = (workspaceIndex, productIndex, newQuantity) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].quantity = newQuantity;
        setRequestData(updatedRequestData);
    };

    const handleEditNote = (workspaceIndex, productIndex, newNote) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].description = newNote;
        setRequestData(updatedRequestData);
    };

    const handleProductLengthChange = (workspaceIndex, productIndex, newLength) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].length = newLength;
        setRequestData(updatedRequestData);
    }

    const handleProductWidthChange = (workspaceIndex, productIndex, newWidth) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].width = newWidth;
        setRequestData(updatedRequestData);
    }

    const handleProductHeightChange = (workspaceIndex, productIndex, newHeight) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].height = newHeight;
        setRequestData(updatedRequestData);
    }

    const handleProductChange = (workspaceIndex, productIndex, productId) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].products[productIndex].productId = productId;
        setRequestData(updatedRequestData);
    };

    const handleWorkspaceDescriptionChange = (workspaceIndex, description) => {
        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].description = description;
        updatedRequestData.requestDetails[workspaceIndex].workspaceName = selectedWorkspaces[updatedRequestData.requestDetails[workspaceIndex].id].label;
        setRequestData(updatedRequestData);
    };

    const handleWorkspaceLengthChange = (workspaceIndex, length) => {
        const parsedLength = parseFloat(length); // Chuyển đổi length thành kiểu số

        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].length = parsedLength;
        updatedRequestData.requestDetails[workspaceIndex].workspaceName = selectedWorkspaces[updatedRequestData.requestDetails[workspaceIndex].id].label;

        // Validate length
        const isValid = !isNaN(parsedLength) && parsedLength > 0;
        setIsValidLength(isValid);

        setRequestData(updatedRequestData);
    };

    // Hàm để cập nhật thông tin của khách hàng vào trong requestData
    const updateCustomerInfo = (field, value) => {
        setRequestData(prevData => ({
            ...prevData,
            customer: {
                ...prevData.customer,
                [field]: value
            }
        }));
    };

    const handleWorkspaceWidthChange = (workspaceIndex, width) => {
        const parsedWidth = parseFloat(width); // Chuyển đổi width thành kiểu số

        const updatedRequestData = { ...requestData };
        updatedRequestData.requestDetails[workspaceIndex].width = parsedWidth;
        console.log(selectedWorkspaces)
        updatedRequestData.requestDetails[workspaceIndex].workspaceName = selectedWorkspaces[updatedRequestData.requestDetails[workspaceIndex].id].label;

        // Validate width
        const isValid = !isNaN(parsedWidth) && parsedWidth > 0;
        setIsValidWidth(isValid);
        console.log(updatedRequestData)
        setRequestData(updatedRequestData);
    };

    const handleConfirmRequest = async () => {
        console.log("Request Data:", requestData);

        if (!requestData || !requestData.customer || !requestData.customer.email) {
            toast.error('Please enter customer email');
            return;
        }


        try {
            // Xử lý requestData ở đây để đảm bảo tất cả các workspace và sản phẩm được bao gồm
            let isValid = true;

            requestData.requestDetails.forEach(workspace => {
                // Kiểm tra xem mỗi workspace có sản phẩm không
                if (workspace.products.length === 0) {
                    isValid = false;
                    toast.error(`Workspace ${workspace.workspaceName} must have at least one product`);
                }

                // Kiểm tra xem các trường thông tin cần thiết đã được điền đầy đủ không
                if (!workspace.description || !workspace.length || !workspace.width) {
                    isValid = false;
                    toast.error(`Please fill in all required fields for workspace ${workspace.workspaceName}`);
                }
            });

            // if (!isValid) {
            //     return;
            // }

            // Cập nhật requestDetail trước khi gửi yêu cầu
            const updatedRequestData = { ...requestData };
            updatedRequestData.requestDetails.forEach(detail => {
                // Xóa các trường không cần thiết trước khi gửi yêu cầu
                // delete detail.workspaceName;
                detail.products.forEach(product => {
                    delete product.description;
                });
            });

            setRequestData(updatedRequestData); // Cập nhật requestData với giá trị mới

            const token = getToken();
            const response = await axios.post('http://localhost:8080/api/v1/request/auth', updatedRequestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            setRequestData({
                customer: initialCustomerInfo,
                requestDetails: [
                    {
                        workspaceName: "",
                        description: '',
                        length: 0,
                        width: 0,
                        products: []
                    }
                ]
            })

            alert('Gửi báo giá thành công');

        } catch (error) {
            console.error('Error confirming request:', error);
            alert('Failed to confirm request. Please try again later.');
        }
    };


    const handleCloseRequest = () => {
        navigate('/customer');
    };

    useEffect(() => {
        if (requestData) {
            const updatedSelectedWorkspaces = {};
            requestData.requestDetails.forEach(detail => {
                const workspace = availableWorkspaces.find(workspace => workspace.workspace_name === detail.workspaceName);
                if (workspace) {
                    updatedSelectedWorkspaces[detail.id] = {
                        value: workspace.id,
                        label: workspace.workspace_name
                    };
                }
            });
            setSelectedWorkspaces(updatedSelectedWorkspaces);
        }
    }, [requestData, availableWorkspaces]);

    return (

        <div className="bg-white w-screen m-0 h-full overscroll-auto p-6">
            <ToastContainer />
            <HiArrowSmallLeft className=" z-10 right-14  text-6xl static font-semibold hover:cursor-pointer" onClick={handleCloseRequest} />

            <h1 className="text-6xl font-bold mb-8 text-center">Quản lí báo giá</h1>

            <div className="mt-8  overflow-auto">
                <h2 className="text-4xl font-bold mb-2">Thông tin khách hàng</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="text"
                            value={getCustomerInfo().email}
                            onChange={(e) => updateCustomerInfo('email', e.target.value)}
                            placeholder="Email"
                            className="border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Số điện thoại:</label>
                        <input
                            type="text"
                            value={getCustomerInfo().phone}
                            onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                            placeholder="Phone"
                            className="border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Họ tên:</label>
                        <input
                            type="text"
                            value={getCustomerInfo().fullName}
                            onChange={(e) => updateCustomerInfo('full_name', e.target.value)}
                            placeholder="Full Name"
                            className="border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>



            {requestData && requestData.requestDetails.map((requestDetail, workspaceIndex) => (
                <div key={requestDetail.id} className="mt-8  border-green-500 border-2 p-20">
                    <div className="grid grid-cols-2 gap-4 ">
                        <div className="mt-4">
                            <h2 className="text-3xl font-bold m-3">Chọn khu vựa thi công</h2>
                            <Select
                                value={selectedWorkspaces[requestDetail.id] || ""}
                                onChange={(selectedOption) => handleWorkspaceChange(selectedOption, requestDetail.id)}
                                options={availableWorkspaces.map((workspace) => ({
                                    value: workspace.id,
                                    label: workspace.workspace_name,
                                    workspace_name: workspace.workspace_name
                                }))}
                                placeholder="Chọn khu vực thi công"
                                className="w-full mr-2 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                            />
                        </div>


                        <div className="mt-4">
                            <label className="block text-gray-700">Mô tả:</label>
                            <input
                                type="text"
                                value={requestDetail.description}
                                onChange={(e) => handleWorkspaceDescriptionChange(workspaceIndex, e.target.value)}
                                placeholder="Workspace Description"
                                className="h-3/5 border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Chiều dài (m):</label>
                            <input
                                type="number"
                                value={requestDetail.length}
                                min={0}
                                onChange={(e) => handleWorkspaceLengthChange(workspaceIndex, e.target.value)}
                                placeholder="Workspace Length"
                                className="border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Chiều rộng (m):</label>
                            <input
                                type="number"
                                value={requestDetail.width}
                                min={0}
                                onChange={(e) => handleWorkspaceWidthChange(workspaceIndex, e.target.value)}
                                placeholder="Workspace Width"
                                className="border border-gray-300 rounded px-4 py-2 mt-2 w-full focus:outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>
                    <button onClick={() => deleteWorkspace(workspaceIndex)} className="text-red-500 hover:text-red-700 text-3xl font-bold">
                        Xóa khu vực thi công
                    </button>

                    <ProductTable
                        products={requestDetail.products}
                        onDeleteProduct={(productIndex) => deleteProduct(workspaceIndex, productIndex)}
                        onEditQuantity={(productIndex, newQuantity) => handleEditQuantity(workspaceIndex, productIndex, newQuantity)}
                        onEditNote={(productIndex, newNote) => handleEditNote(workspaceIndex, productIndex, newNote)}
                        onAddProduct={() => addProduct(workspaceIndex)}
                        onLengthChange={(productIndex, newLength) => handleProductLengthChange(workspaceIndex, productIndex, newLength)}
                        onWidthChange={(productIndex, newWidth) => handleProductWidthChange(workspaceIndex, productIndex, newWidth)}
                        onHeightChange={(productIndex, newHeight) => handleProductHeightChange(workspaceIndex, productIndex, newHeight)}
                        selectedWorkspace={selectedWorkspaces[requestDetail.id] ? selectedWorkspaces[requestDetail.id].label : ""}
                        handleProductChange={(productIndex, productId) => handleProductChange(workspaceIndex, productIndex, productId)}
                    />
                </div>
            ))}

            <button onClick={addWorkspace} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                Thêm khu vực thi công
            </button>
            <button onClick={handleConfirmRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Xác nhận báo giá
            </button>

        </div>

    );
}

export default Project;