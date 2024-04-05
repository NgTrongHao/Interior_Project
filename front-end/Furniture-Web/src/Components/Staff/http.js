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
