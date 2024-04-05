import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/user/generateToken', {
                username: username,
                password: password
            });

            console.log("login response", response.data);

            const token = response.data.token;

            // Lưu token vào cookie với tên là 'token' và thời gian sống là 1 ngày
            Cookies.set('token', token, { expires: 1 });
            // Điều hướng tới trang chính hoặc trang sau khi đăng nhập thành công
            // history.push('/home');
            getUserProfileAndRedirect();
            toast.success('Đăng nhập thành công !')
            // navigate("/customer");
        } catch (error) {
            toast.error('Tài khoản hoặc mật khẩu sai !');
        }
    };

    const getUserProfileAndRedirect = async () => {
        await getUserProfile(); // Đợi cho localStorage được cập nhật
        const user = JSON.parse(localStorage.getItem('customer'));
        console.log("user info: ", user);
        const roles = user.roles;
        console.log(roles);
        // Tạo một biến để lưu trữ vai trò cao nhất
        let highestRole = "";

        // Lặp qua mảng roles để tìm vai trò cao nhất   
        roles.forEach(element => {
            if (element.includes("ROLE_ADMIN")) {
                highestRole = "ROLE_ADMIN";
            } else if (element === "ROLE_MANAGER" && highestRole !== "ROLE_ADMIN") {
                highestRole = "ROLE_MANAGER";
            } else if (element === "ROLE_STAFF" && highestRole !== "ROLE_ADMIN" && highestRole !== "ROLE_MANAGER") {
                highestRole = "ROLE_STAFF";
            } else if (element === "ROLE_CUSTOMER" && highestRole !== "ROLE_ADMIN" && highestRole !== "ROLE_MANAGER" && highestRole !== "ROLE_STAFF") {
                highestRole = "ROLE_CUSTOMER";
            }
        });

        // Dựa vào vai trò cao nhất, chuyển hướng người dùng đến trang tương ứng
        switch (highestRole) {
            case "ROLE_ADMIN":
                navigate("/admin");
                window.location.reload();
                break;
            case "ROLE_MANAGER":
                navigate("/manager");
                window.location.reload();
                break;
            case "ROLE_STAFF":
                navigate("/staff");
                window.location.reload();
                break;
            case "ROLE_CUSTOMER":
                navigate("/customer");
                window.location.reload();
                break;
        }
    }

    const getUserProfile = async () => {
        try {
            const token = Cookies.get('token')
            const response = await axios.get('http://localhost:8080/api/v1/user/auth/userProfile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            localStorage.setItem('customer', JSON.stringify(response.data));
            console.log(localStorage.setItem('customer', JSON.stringify(response.data)));
            // console.log(localStorage.getItem('customer'));
        } catch (error) {
            // toast.info('Infor was load');
        }
    }

    return (
        <div className='h-screen flex items-center justify-center w-screen bg-[url("../../src/assets/image/main_home.jpg")]' >
            <form onSubmit={handleLogin} >
                <div className='bg-[#054c73] rounded-md shadow-md w-80 p-16'>
                    <h2 className='text-white text-4xl font-bold p-3 text-center'>Đăng nhập</h2>
                    <div className='mb-4'>
                        <label className='text-white block mb-1 text-3xl'>Tên đăng nhập</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            className='text-2xl w-full px-3 py-2 rounded-md bg-white 
                        text-gray-800 focus:outline-none focus:ring
                         focus:ring-blue-300 hover:shadow-transparent
                         duration-300 ease-in-out' />
                    </div>
                    <div className='mb-4'>
                        <label className='text-white block text-3xl mb-1'>Mật Khẩu</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className='text-2xl w-full px-3 py-2 rounded-md bg-white
                         text-gray-800 focus:outline-none duration-300 ease-in-out 
                         focus:ring focus:ring-blue-300' />
                    </div>
                    <button className='bg-blue-500 text-white px-8 py-4 text-3xl
                hover:bg-blue-600 transition duration-300 ease-in-out w-full mt-5 hover:shadow-2xl
                focus:border-indigo-400 focus:ring-blue-500 rounded-lg'
                        type="submit"
                    >Đăng nhập</button>
                </div>
                {/* {error && <ToastContainer />} */}
                <ToastContainer position='bottom-center' />
            </form>
        </div>
    );

}

export default Login;
