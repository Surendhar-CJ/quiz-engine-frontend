import React from 'react';
import StarRating from './StarRating';
import '../styles/AskRating.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AskRating = ({ onRatingSubmit, onRatingSubmitAndComment }) => {
    
    return (
        <div className = "ask-rating">
            <p className="ask-rating-text">Thank you for completing the quiz! Your insights are invaluable to other students. Could you please provide a rating? Your feedback helps ensure the quality of the quiz questions and encourages creators to deliver better content!</p>
            <StarRating totalStars={5} onRatingSubmit={onRatingSubmit}  onRatingSubmitAndComment={onRatingSubmitAndComment}/>
            <ToastContainer />
        </div>    
    )
}

export default AskRating;
