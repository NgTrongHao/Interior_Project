import axios from "axios";

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

