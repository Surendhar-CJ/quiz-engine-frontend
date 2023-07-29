import React from 'react';
import myImage1 from '../../images/Performance-Analysis1.png'; 
import '../../styles/LandingPageComponents.css';

const Card3 = () => {
    return (
        <div className="card3">
            <p>Track your progress and much more</p>
            <figure className="performance-image1">
                <img src={myImage1} alt="Performance Analysis 1" style={{borderRadius: '20px',width: '700px', boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.4)'}} />
            </figure>
        </div>
    )
}

export default Card3;