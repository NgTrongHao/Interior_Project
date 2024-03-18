import React from 'react';
import Truong from '../../../assets/image/Truong.jpg';

function StaffIntroduce() {
    return (
        <div className="staff-introduction">
            <div className="staff-title">
                <h1>Our team</h1>
            </div>
            <div className="staff-carousel">
                <a href="#" className="staff-container">

                    <img className="staff-avt" src="Truong" alt="" />

                    <div className="staff-name">
                        <h1>Nguyen Nhat Truong</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Pateint and professional, A master to work with
                        </p>
                        <p className="telephone">
                            0327730336
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
                <a href="#" className="staff-container">

                    <img className="staff-avt" src="/assets/img/318971186_854205345859664_2596456881343714570_n.jpg" alt="" />

                    <div className="staff-name">
                        <h1>Nguyen Nhat Truong</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Pateint and professional, A master to work with
                        </p>
                        <p className="telephone">
                            0327730336
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
                <a href="#" className="staff-container">

                    <img className="staff-avt" src="/assets/img/318971186_854205345859664_2596456881343714570_n.jpg" alt="" />

                    <div className="staff-name">
                        <h1>Nguyen Nhat Truong</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Pateint and professional, A master to work with
                        </p>
                        <p className="telephone">
                            0327730336
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
            </div>
        </div>
    )
}

export default StaffIntroduce