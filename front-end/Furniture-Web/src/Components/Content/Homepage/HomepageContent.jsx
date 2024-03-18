import React from 'react';
import main_home from "../../../assets/image/main_home.jpg";
import a1 from "../../../assets/image/a1.jpg";
import a2 from "../../../assets/image/a2.jpg";
import a3 from "../../../assets/image/a3.jpg";
import a4 from "../../../assets/image/a4.jpg";
import a5 from "../../../assets/image/a5.jpg";
import "../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../node_modules/slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./HomepageContent.css";

function HomepageContent() {

    // Slider settings
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        // Page Introduce
        <div className='h-3/4 flex justify-center items-center bg-white'>
            <div className='h-full w-3/4 hero-carousel'>
                {/* Slider */}
                <Slider {...settings} className='single-carousel'>
                    <div className='item'>
                        <img src={main_home} className='body-picture' />
                    </div>
                    <div className='item'>
                        <img src={a1} className='body-picture' />
                    </div>
                    <div className='item'>
                        <img src={a2} className='body-picture' />
                    </div>
                    <div className='item'>
                        <img src={a3} className='body-picture' />
                    </div>
                    <div className='item'>
                        <img src={a4} className='body-picture' />
                    </div>
                    <div className='item'>
                        <img src={a5} className='body-picture' />
                    </div>
                </Slider>
                {/* End Slider */}
            </div>
        </div>
        // End Page Introduce
    )
}

export default HomepageContent