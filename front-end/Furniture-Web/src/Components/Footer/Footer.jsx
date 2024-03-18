import React from 'react';
import './Footer.css'

function Footer() {
    return (
        <footer>
            <div className="grid">
                <div className="footer-box">
                    <div className="web-info">
                        <h3 className="contact">Contact us:</h3>
                        <h4 className="info">
                            Block E2a-7, D1 Street Saigon Hi-tech Park, Long Thanh My Ward,
                            District 9, Ho Chi Minh City, Vietnam
                        </h4>
                    </div>
                    <div className="follow-us">
                        <h3 className="follow-title">Follow us:</h3>
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