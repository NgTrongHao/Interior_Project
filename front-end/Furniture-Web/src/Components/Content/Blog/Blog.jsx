import React from 'react';
import "./Blog.css";
import a1 from '../../../assets/image/a1.jpg';
import a2 from '../../../assets/image/a2.jpg';
import a3 from '../../../assets/image/a3.jpg';
import a6 from '../../../assets/image/a6.jpg';
import workRoom from '../../../assets/image/workroom2.jpg';
import bedRoom from '../../../assets/image/bedroom.jpg';
import slice from '../../../assets/image/Slice 1 1 .png';
import BlogCarousel from './BlogCarousel';

function Blog() {
    return (
        <main>
            <div className="grid">
                <div className="news-part">

                    <div className="row">
                        <div className="overlay" id="overlay"></div>
                        <div className="newProject-box">
                            <h2 className="project-title">Thi công nội thất</h2>
                            <p className="project-description">Bước vào một thế giới nơi nghệ thuật Thiết kế Nội thất được tạo ra một cách tỉ mỉ để kết hợp giữa sự thanh lịch vượt thời gian và sự đổi mới hiện đại cắt cạnh, cho phép bạn biến không gian sống của mình trở thành biểu tượng của sự xa hoa và tinh tế.</p>
                            <button className="create-project">Tạo dự án</button>
                            <a href="/WebPage/AboutUsPage/AboutUsPage.html" className="See-more-details">Xem thêm thông tin</a>
                        </div>
                        <div className="pro-img" >
                            <img className="img-tag" src={a1} alt="" />
                        </div>
                    </div>
                    <div className="row-2">
                        {/* <BLogCrs /> */}
                        <div className="body-carousel-box">
                            <div className="hero-carousel">
                                <BlogCarousel />
                            </div>
                        </div>
                        {/* End <BLogCrs /> */}
                    </div>
                </div>
                <div className="container">
                    <h1 className="title">Top những phong cách thi công phòng khách</h1>
                    <div className="content">
                        <div className="box" >
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Phòng khách hiện đại
                            </div>
                            <div className="project-info">
                                <p>
                                Trong thế giới ngày nay, lối sống đang phát triển hơn bao giờ hết, với số lượng gia đình chọn lựa cách sống hiện đại đang tăng lên
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>

                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    2222222222222222222222222222222222222222222222  In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a6} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a3} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    2222222222222222222222222222222222222222222222  In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a6} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a3} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a1} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    2222222222222222222222222222222222222222222222  In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a6} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                        <div className="box">
                            <img className="project-img" src={a3} alt="" />
                            <div className="project-title">
                                Top 10 Modern Luxury Living Room
                            </div>
                            <div className="project-info">
                                <p>
                                    In today's world, lifestyles are evolving more than ever, with increasing numbers of families opting for modern ways of living.
                                </p>
                            </div>
                            <div className="project-price">
                                <p>Estimate: </p>
                                <p>3 millions</p>
                            </div>
                            <a href="#">See more</a>
                        </div>
                    </div>
                    <div className="pagination">
                        <button className="prev-page" disabled>&lt;</button>
                        <span className="page-info">Page 1</span>
                        <button className="next-page">&gt;</button>
                    </div>
                </div>

                <div className="quote-form">
                    <div className="quote-content">
                        <h1>LIÊN HỆ ĐỂ ĐƯỢC TƯ VẤN</h1>
                        <p>

                        Để được tư vấn chi tiết và chính xác về các dịch vụ tại Furniture Vietnam, vui lòng điền thông tin vào biểu mẫu được cung cấp bên cạnh. Sau khi nhận được thông tin đăng ký của bạn, đội ngũ hỗ trợ tại Furniture Vietnam sẽ liên hệ trực tiếp với bạn trong vòng 24 giờ để cung cấp sự hỗ trợ, tư vấn và báo giá cụ thể.

                        </p>
                    </div>
                    
                </div>
            </div>
        </main>
    )
}

export default Blog