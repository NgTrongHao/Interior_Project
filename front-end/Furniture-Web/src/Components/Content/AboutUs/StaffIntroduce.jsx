import React from 'react';
import Truong from '../../../assets/image/Truong.jpg';
import Hao from '../../../assets/image/Hao_n.jpg';
import Tung from '../../../assets/image/Tung.jpg';

function StaffIntroduce() {
    return (
        <div className="staff-introduction">
            <div className="staff-title">
                <h1>Our team</h1>
            </div>
            <div className="staff-carousel">
                <a href="#" className="staff-container">

                    <img className="staff-avt" src={Truong} alt="" />

                    <div className="staff-name">
                        <h1>Nguyễn Nhật Trường</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Chuyên nghiệp, hiệu quả và nhiệt huyết
                        </p>
                        <p className="telephone">
                            Sdt :0397903979
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
                <a href="#" className="staff-container">

                    <img className="staff-avt" src={Hao} alt="" />

                    <div className="staff-name">
                        <h1>Nguyễn Trọng Hảo</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Chuyên nghiệp, kiên trì, một master của ngành thiết kế
                        </p>
                        <p className="telephone">
                           Sdt: 0888686868
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
                <a href="#" className="staff-container">

                    <img className="staff-avt" src={Tung} alt="" />

                    <div className="staff-name">
                        <h1>Nguyen Thanh Tùng</h1>
                    </div>
                    <div className="staff-info">
                        <p>
                            Đẳng cấp, phong cách và phá cách
                        </p>
                        <p className="telephone">
                           Sdt: 0123456789
                        </p>
                    </div>
                    <button>Contact</button>
                </a>
            </div>
        </div>
    )
}

export default StaffIntroduce