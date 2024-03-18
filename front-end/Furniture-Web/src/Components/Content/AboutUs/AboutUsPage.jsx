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
                        <h1>WELCOME TO FURNITURE</h1>
                    </div>
                    <div className="grid__row">
                        <div className="about-title">
                            <h1>ABOUT - US</h1>
                        </div>
                        <div className="about-us">

                            <img className="about-us-img" src={a2} alt="" />
                            <div className="about-us-content">
                                <p>
                                    Here we are!
                                </p>
                                <p>
                                    where we explore and create beautiful and unique living spaces.
                                    At Furniture, we are committed to providing high-quality furniture products and the most attentive services to meet all customer needs.
                                    With a diverse collection of designs and styles, we hope to inspire you to create the perfect living and working spaces. Join Furniture on the journey to turn every idea into reality!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row-2">
                        {/* Carousel box*/}
                        <div className="body-carousel-box">
                            <div className="hero-carousel">
                                <div className="body-title">
                                    <h1>Work Spaces designed by Us</h1>
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