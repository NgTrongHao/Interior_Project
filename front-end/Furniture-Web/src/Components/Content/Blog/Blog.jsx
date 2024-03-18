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
                            <h2 className="project-title">Interior Design</h2>
                            <p className="project-description">Step into a world where the art of Interior Design is meticulously crafted to bring together timeless elegance and cutting-edge
                                modern Innovation, Allowing you to transform your living spaces into the epitome of luxury and sophistication</p>
                            <button className="create-project">Start Project</button>
                            <a href="/WebPage/AboutUsPage/AboutUsPage.html" className="See-more-details">See more details</a>
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
                    <h1 className="title">Top quatation about living room</h1>
                    <div className="content">
                        <div className="box" >
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
                        <h1>CONTACT FOR CONSULTATION</h1>
                        <p>

                            For detailed and accurate consultation on services at Furniture Vietnam, please fill in the information in the form provided on the side.
                            Upon receiving your registration information, the support team at Furniture Vietnam will contact you directly within 24 hours to provide assistance, consultation, and specific pricing.

                        </p>
                    </div>
                    
                </div>
            </div>
        </main>
    )
}

export default Blog