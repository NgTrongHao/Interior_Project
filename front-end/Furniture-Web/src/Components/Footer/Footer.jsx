import React from 'react';
import './Footer.css'

function Footer() {
    return (
        <footer>
            <div className="grid">
                <div className="footer-box">
                    <div className="web-info">
                        <h3 className="contact">Thông tin liên hệ:</h3>
                        <h4 className="info">
                        Lô E2a-7, Đường D1 Khu Công nghệ cao, Phường Long Thạnh Mỹ,
                         Thành phố Thủ Đức, Thành phố Hồ Chí Minh.
                        </h4>
                    </div>
                    <div className="follow-us">
                        <h3 className="follow-title">Liên kết:</h3>
                        <div className="logo-box">
                            <div className="logo-img">
                                <i className="fa-brands fa-facebook"></i>
                            </div>
                            <div className="logo-img">
                                <i className="fa-brands fa-instagram"></i>
                            </div>
                            <div className="logo-img">
                                <i className="fa-brands fa-tiktok"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer