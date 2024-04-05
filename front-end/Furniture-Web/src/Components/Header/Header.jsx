import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import Register from '../../Register/Register';
import Dropdown from './Dropdown';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function Header({ handleLogin }) {

    const userInfo = JSON.parse(localStorage.getItem('customer'));
    const navigate = useNavigate();

    const [isLoginOpen, setLoginOpen] = useState(false);

    // Open and Close Quotation Form
    const toggleLogin = () => {
        setLoginOpen(!isLoginOpen);
    };


    const handleLogout = () => {
        localStorage.removeItem('customer');
        Cookies.remove('token');
        navigate('/');
        window.location.reload();
    }

    const renderButton = () => {
        if (userInfo) {
            // Nếu có thông tin userInfo, hiển thị nút Đăng xuất
            return (
                <button className='bg-[#054c73] text-2xl px-8 py-4 text-white rounded-full' onClick={handleLogout}>
                    Đăng xuất
                </button>
            );
        } else {
            // Ngược lại, hiển thị nút Đăng nhập
            return (
                <Link to='login'>
                    <button className='bg-[#054c73] text-2xl px-8 py-4 text-white rounded-full'>
                        Đăng nhập
                    </button>
                </Link>
            );
        }
    };


    return (

        // Header
        <header className="header">
            {/* Navogate */}
            <div className="grid">
                <div className="header__navbar">
                    {/* Logo Web */}
                    <div className="header__navbar-logo">
                        <Link className="logo-link" to="/">
                            <img
                                className="header__navbar-logo--img"
                                src="../../../src/assets/image/Clip path group.svg"
                                alt="Furniture logo"
                            />
                            <span className="header__navbar-logo--name">Furniture</span>
                        </Link>
                    </div>
                    {/* End Logo Web */}

                    <nav className="header__navbar-navPage">
                        <ul>
                            {/* About Us */}
                            <li className="dropdown-container">
                                <Link to='/about-us' className="header__navbar-navPage--button text-4xl">Giới thiệu</Link>
                            </li>
                            {/* End About Us */}

                            {/* Services */}
                            <li className="dropdown-container">
                                <a to="service" className="header__navbar-navPage--button text-4xl">
                                    Dịch vụ
                                    <span className="fa-solid fa-angle-down icon-down text-2xl"></span>
                                </a>
                                <Dropdown />
                            </li>
                            {/* End Services */}

                            {/* Blog */}
                            <li className="dropdown-container">
                                <Link to={'/blog'} className="header__navbar-navPage--button text-4xl">Blogs nội thất</Link>
                            </li>
                            {/* End Blog */}
                        </ul>
                    </nav>


                    {/* Quote Button */}
                    <div className="header__quote">
                        <button className="header__quote-button" id="quoteButton" onClick={toggleLogin}>Nhận báo giá</button>

                        {/* Register Form */}
                        {isLoginOpen && <Register handleLogin={handleLogin} toggleLogin={toggleLogin} />}
                        {/* End Register Form */}

                    </div>

                    {/* End Quote Button */}
                    {renderButton()}

                    {/* Header mobile screen */}
                    <div className="header__mobile-menu">
                        <nav className="header__mobile-menu--menu-list">

                            {/* Hambugur Menu */}
                            <i className="fa-solid fa-bars header__mobile-menu--menu-icon"></i>
                            {/* End Hambugur Menu */}

                            {/* About Us */}
                            <Link className="b" to="/about-us">Giới thiệu</Link>
                            {/* End About Us */}

                            {/* Services */}
                            <Link className="b" to="WebPage/Services/ServicePage.html">Dịch vụ</Link>
                            {/* End Services */}

                            {/* Blog */}
                            <Link to='/blog' className="b" >Blogs nội thất</Link>
                            {/* End Blog */}

                            {/* Search */}
                            <div className="menu__search-box">
                                <div className="menu__search-wrap">
                                    <input
                                        type="text"
                                        className="menu__search-input"
                                        placeholder="Search..."
                                    />
                                    <button className="menu__search-btn">
                                        <i className="fas fa-search menu__search-btn-icon"></i>
                                    </button>
                                </div>
                            </div>
                            {/* End Search */}
                        </nav>
                    </div>
                    {/* End Header mobile screen */}
                </div>
            </div>
            {/* End Navogate */}
        </header>
        // End Header
    )
}

export default Header