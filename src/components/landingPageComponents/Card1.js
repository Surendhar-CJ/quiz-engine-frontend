import React from 'react';
import myImage from '../../images/Configure.png'; 
import '../../styles/LandingPageComponents.css';


const Card1 = () => {
    return (
        <div className="card1">
            <div className="content-wrapper">
                <p>Bring the fun back to learning with quizzes</p>
                <figure className="configue-image">
                    <img src={myImage} alt="Quiz Configuration" style={{ borderRadius: '20px', width: '400px', boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.4)' }} />
                </figure>
            </div>
        </div>
    )
}

export default Card1;