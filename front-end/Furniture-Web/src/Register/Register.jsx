import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ handleLogin, toggleLogin }) {

    const navigate = useNavigate();

    // Lưu trạng tháii
    const [enteredValue, setEnteredValue] = useState({
        email: '',
        phone: '',
        full_name: '',
    })

    // register customer
    function handleSubmit(event) {
        event.preventDefault();
        console.log(enteredValue);
        // response  
        // const requestData = JSON.stringify(enteredValue);

        // Dùng axios.post('URL', value);   
        axios.post('http://localhost:8080/api/v1/user/registerCustomer', enteredValue, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data); // In ra dữ liệu từ backend
                handleLogin(enteredValue);
                // Xử lý logic khi đăng ký thành công
                navigate('/login');
                setEnteredValue({
                    email: '',
                    phone: '',
                    full_name: '',
                })
                handleLogin(enteredValue);
            })
            .catch(error => {
                console.error('Error registering customer:', error);
                // Xử lý logic khi xảy ra lỗi
            });
    }

    function handleInputChange(identifer, value) {
        setEnteredValue(prevValues => ({
            ...prevValues,
            [identifer]: value
        }))
    }

    return (
        <div className="login-card">
            <button className="close" id='close' onClick={toggleLogin}>close</button>
            <form className="login-form" action="" onSubmit={handleSubmit}>
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                    type="email"
                    id="username"
                    name='email'
                    value={enteredValue.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                />

                <label htmlFor="telephone">Số điện thoại</label>
                <input
                    type="text"
                    id="telephone"
                    name='phone'
                    value={enteredValue.phone}
                    onChange={(event) => handleInputChange('phone', event.target.value)}
                />

                <label htmlFor="fullName">Họ và tên</label>
                <input
                    type="text"
                    id="fullName"
                    name='full_name'
                    value={enteredValue.full_name}
                    onChange={(event) => handleInputChange('full_name', event.target.value)}
                />

                <button className="regis-button" id="registerButton">Đăng kí nhận báo giá</button>
            </form>
        </div>
    )
}

export default Register