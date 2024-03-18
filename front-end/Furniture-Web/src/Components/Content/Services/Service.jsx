import React from 'react';
import a1 from '../../../assets/image/a1.jpg';
import a2 from '../../../assets/image/a2.jpg';
import a3 from '../../../assets/image/a3.jpg';
import workRoom from '../../../assets/image/workroom2.jpg';
import a6 from '../../../assets/image/a6.jpg';
import slice from '../../../assets/image/Slice 1 1 .png';
import bedRoom from '../../../assets/image/bedroom.jpg';
import { Link } from 'react-router-dom';

function Service() {
    return (
        <div className="main">
            <div className="grid">
                <div className="row">
                    <div className="overlay" id="overlay"></div>
                    <div className="newProject-box">
                        <h2 className="project-title">Interior Design</h2>
                        <p className="project-description">Step into a world where the art of Interior Design is meticulously crafted to bring together timeless elegance and cutting-edge
                            modern Innovation, Allowing you to transform your living spaces into the epitome of luxury and sophistication</p>
                        <button className="create-project">Start Project</button>
                        <Link to='/about-us' className="See-more-details">See more details</Link>

                    </div>
                    <div className="pro-img" >
                        <img className="img-tag" src={a1} alt="" />
                    </div>
                </div>
                <div className="row-2">

                    <div className="body-carousel-box">
                        <div className="hero-carousel">

                            <div className="single-carousel" id="single-carousel">


                                <div className="item">
                                    <img className="body-picture" src={bedRoom} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Bedroom
                                        </a>
                                        <div className="description-details">
                                            Rest, Sleep, Relaxation, Comfort, Serenity, Privacy.
                                        </div>
                                        <a href="/Details/BedroomDetails.html" className="description-detail-more">See more</a>
                                    </div>
                                </div>
                                <div className="item">
                                    <img className="body-picture" src={a6} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Rest Room
                                        </a>
                                        <div className="description-details">
                                            Refresh, Revitalize, Tranquility, Renewal, Privacy, Cleanliness.
                                        </div>
                                        <a href="/Details/RestRoomDetails.html" className="description-detail-more">See more</a>
                                    </div>
                                </div>
                                <div className="item">
                                    <img className="body-picture" src={slice} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Living Room
                                        </a>
                                        <div className="description-details">
                                            Gather, Socialize, Entertainment, Comfort, Conversation, Relaxation.
                                        </div>
                                        <a href="/Details/LivingRoomDetails.html" className="description-detail-more">See more</a>
                                    </div>
                                </div>
                                <div className="item">
                                    <img className="body-picture" src={a2} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Dining Room
                                        </a>
                                        <div className="description-details">
                                            Share, Meals, Family, Gatherings, Comfort, Hospitality.
                                        </div>
                                        <a href="/Details/DiningRoomDetails.htm" className="description-detail-more">See more</a>
                                    </div>
                                </div>
                                <div className="item">
                                    <img className="body-picture" src={a3} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Family Room
                                        </a>
                                        <div className="description-details">
                                            Bonding, Cozy, Informal, Relaxation, Entertainment, Comfort.
                                        </div>
                                        <a href="/Details/FamilyRoomDetails.html" className="description-detail-more">See more</a>
                                    </div>
                                </div>
                                <div className="item">
                                    <img className="body-picture" src={workRoom} alt="" />
                                    <div className="description">
                                        <a href="#" className="description-title">
                                            Work Room
                                        </a>
                                        <div className="description-details">
                                            Productivity, Focus, Creativity, Efficiency, Organization, Comfort.
                                        </div>
                                        <a href="/Details/WorkRoomDetails.html" className="description-detail-more">See more</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Service