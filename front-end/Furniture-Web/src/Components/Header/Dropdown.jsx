import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo bạn đã import Link từ react-router-dom

const Dropdown = ({ workspaceOptions }) => {
    const [apiData, setApiData] = useState([]); // Khởi tạo state để lưu trữ dữ liệu từ API

    useEffect(() => {
        // Hàm fetch API
        const fetchData = async () => {
            try {
                // Thực hiện fetch API ở đây
                const response = await fetch('http://localhost:8080/api/v1/workspace');
                const data = await response.json();
                setApiData(data); // Lưu trữ dữ liệu từ API vào state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Gọi hàm fetch API khi component được render
        fetchData();
    }, []); // Dependency array rỗng đảm bảo fetch chỉ được gọi một lần khi component được render

    return (
        <ul className="dropdown-menu">
            {/* Sử dụng map để lặp qua các workspace_name và tạo thẻ li tương ứng */}
            {apiData.map((item, index) => (
                <li className="details-menu" key={index}>
                    {/* Sử dụng Link với đường dẫn tương ứng */}
                    <Link to={`/${item.workspace_name.toLowerCase().replace(' ', '-')}`}>
                        {item.workspace_name}
                    </Link>
                </li>
            ))}

        </ul>
    );
};

export default Dropdown;
