import React from 'react';
import './AboutUsPage.css';
import a1 from "../../../assets/image/a1.jpg";
import a2 from "../../../assets/image/a2.jpg";
import DesignByUs from './DesignByUs';
import StaffIntroduce from './StaffIntroduce';

function AboutUsPage() {
    return (
        // About Us Page
        <>
            <div className="main">
                <div className="grid">

                    <div className="fullscreen-background">
                        <img className="body-img" src={a1} alt="" />
                        <h1>FURNITURE XIN CHÀO</h1>
                    </div>
                    <div className="grid__row">
                        <div className="about-title">
                            <h1>Giới thiệu về chúng tôi</h1>
                        </div>
                        <div className="about-us">

                            <img className="about-us-img" src={a2} alt="" />
                            <div className="about-us-content">
                                <p>
                                    Furniture Xin chào!
                                </p>
                                <p>
                                Furniture là nơi chúng tôi khám phá và tạo ra những không gian sống đẹp và độc đáo.
Tại Furniture, chúng tôi cam kết cung cấp các sản phẩm nội thất chất lượng cao và dịch vụ chu đáo nhất để đáp ứng mọi nhu cầu của khách hàng.
Với một bộ sưu tập đa dạng về thiết kế và phong cách, chúng tôi hy vọng sẽ truyền cảm hứng cho bạn để tạo ra những không gian sống và làm việc hoàn hảo. Hãy tham gia cùng Furniture trên hành trình biến mọi ý tưởng thành hiện thực!







                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row-2">
                        {/* Carousel box*/}
                        <div className="body-carousel-box">
                            <div className="hero-carousel">
                                <div className="body-title">
                                    <h1>Không gian nội thất</h1>
                                </div>
                                {/* Design By Us Page */}
                                <DesignByUs />
                                {/* End Design By Us Page */}
                            </div>
                        </div>
                        {/* End Carousel box */}
                    </div>

                    {/* Staff Introduction */}
                    <StaffIntroduce />
                    {/* End Staff Introduction */}
                    

                </div>
            </div >
        </>
    )
}

export default AboutUsPage