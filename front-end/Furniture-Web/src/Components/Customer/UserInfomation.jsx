import { Box, TextField } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

function UserInfomation() {

    const [selectedEmployee, setSelectedEmployee] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/user/auth/userProfile', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    }
                });
                // Xử lý dữ liệu trả về ở đây
                console.log(response.data);
                setSelectedEmployee(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        getUserInfo();
    }, []);


    const handleEdit = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await axios.patch(`http://localhost:8080/api/v1/user/auth/editProfile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error getting employee information');
            }

            const employee = await response.json();
            setSelectedEmployee(employee);
            openModal();
        } catch (error) {
            console.error('Error handling edit:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            let url = `http://localhost:8080/api/v1/admin/addEmployee`;
            let method = 'POST';
            if (selectedEmployee.id) {
                url = `http://localhost:8080/api/v1/admin/updateEmployee/${selectedEmployee.id}`;
                method = 'PATCH';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedEmployee)
            });

            if (!response.ok) {
                throw new Error(`Error ${selectedEmployee.id ? 'updating' : 'adding'} employee`);
            }

            setIsOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(`Error ${selectedEmployee.id ? 'updating' : 'adding'} employee:`, error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedEmployee({
            ...selectedEmployee,
            [name]: value
        });
    };

    return (
        <div className="flex flex-col bg-white rounded-md shadow-md max-w-6xl w-full h-full overflow-auto  m-auto">
            <h2 className="font-semibold p-4 text-center text-7xl ">Thông tin tài khoản</h2>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <div className="flex flex-col gap-4 justify-items-center align-items-center">
                        <TextField
                            label="Email"
                            value={selectedEmployee.email || ""}
                            name="email"
                            onChange={handleInputChange}
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="Số điện thoại"
                            value={selectedEmployee.phone || ""}
                            name="phone"
                            onChange={handleInputChange}
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="Họ và Tên"
                            value={selectedEmployee.fullName || ""}
                            name="full_name"
                            onChange={handleInputChange}
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="CCCD"
                            value={selectedEmployee.id_card || ""}
                            name="id_card"
                            onChange={handleInputChange}
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="Địa chỉ"
                            value={selectedEmployee.address || ""}
                            name="address"
                            onChange={handleInputChange}
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="Mật khẩu"
                            value={selectedEmployee.password || ""}
                            name="password"
                            onChange={handleInputChange}
                            type="password"
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                        <TextField
                            label="Xác nhận Mật khẩu"
                            name="confirmpassword"
                            onChange={handleInputChange}
                            type="password"
                            style={{ width: '600px', height: '40px', margin: '20px', padding: '10px 0' }}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4 p-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserInfomation