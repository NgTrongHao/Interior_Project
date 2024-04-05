import { Cookie } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";

export async function fetchAvailableWorkspace() {
    try {
        // /workspace get list of workspace
        const response = await axios.get('http://localhost:8080/api/v1/workspace');
        const resData = response.data;

        // Kiểm tra trạng thái của response
        if (response.status !== 200) {
            throw new Error('Fail to fetch places');
        }

        return resData;
    } catch (error) {
        console.error('Error fetching workspace:', error);
        throw error;
    }
}

export async function fetchAvailableProducts(workspaceName) {
    // /api/v1/workspace/{workspaceName}/products
    // get product by workspace
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/workspace/${workspaceName}/products`);
        const resData = response.data;

        // Kiểm tra trạng thái của response
        if (response.status !== 200) {
            throw new Error('Fail to fetch product');
        }

        return resData;

    } catch (error) {
        console.error('Error fetching workspace:', error);
        throw error;
    }
}


/**
 * get request by customer
 * customerToken is stored in cookie
 */
export async function getRequestByCustomer(pageNumber, pageSize, customerToken) {
    try {
        // /api/v1/request/auth/customer?page=<pageInt>&pageSize=<pageSize>
        const response = await axios.get(`http://localhost:8080/api/v1/request/auth/customer?page=${pageNumber}&pageSize=${pageSize}`, {
            headers: {
                'Authorization': 'Bearer ' + customerToken,
                'Content-Type': 'application/json'
            }
        });

        // Nếu status là 200, trả về dữ liệu
        if (response.status === 200) {
            return response.data;
        } else {
            // Nếu status không phải là 200, xử lý lỗi hoặc trả về một giá trị phù hợp
            console.error('Error fetching requests. Status:', response.status);
            return null; // hoặc trả về một giá trị khác phù hợp
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
    }
}

// manager confirmation proposal
export async function customerConfirmation(proposalId) {
    try {
        const response = await axios.patch(`http://localhost:8080/api/v1/request/auth/customer/${proposalId}/confirmProposal`, {}, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token'), // Cần có khoảng trắng sau 'Bearer'
                'Content-Type': 'application/json'
            }
        });
        console.log("Customer confirm ???:", response);
        return response.data; // Trả về dữ liệu nếu cần
    } catch (error) {
        console.log(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
}


export async function fetchProductName(productId) {
    try {
        // Gửi yêu cầu HTTP GET để lấy thông tin sản phẩm
        const response = await axios.get(`http://localhost:8080/api/v1/product/${productId}`);

        // Trích xuất tên sản phẩm từ phản hồi
        const productName = response.data.name;

        return productName;
    } catch (error) {
        console.error('Error fetching product name:', error);
        // Trả về null hoặc một giá trị mặc định nếu có lỗi
        return null;
    }
}

// manager confirmation proposal
export async function customerRejectProposal(proposalId) {
    try {
        const response = await axios.patch(`http://localhost:8080/api/v1/request/auth/customer/${proposalId}/rejectProposal`, {}, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token'),
                'Content-Type': 'application/json'
            }
        });
        console.log("Customer confirm ???:", response);
        return response.data; // Trả về dữ liệu nếu cần
    } catch (error) {
        console.log(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
}

export const fetchProductById = async (productId) => {
    return await axios.get(`http://localhost:8080/api/v1/product/${productId}`);
}
