import React from 'react';
import myImage from '../../images/Feedback.png'; 
import '../../styles/LandingPageComponents.css';


const Card2 = () => {
    return (
        <div className ="card2">
            <figure className="feedback-image">
                <img src={myImage} alt="Feedback" style={{borderRadius: '20px',width: '700px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.4)'}} />
            </figure>
            <p>Get instant feedback on your performance</p>
        </div>
    )
}

export default Card2;