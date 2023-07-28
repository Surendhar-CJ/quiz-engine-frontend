import React, { useState } from 'react';
import '../styles/AskRating.css';
import { FaStar } from 'react-icons/fa';
import { baseURL } from '../config.js';
import UserFeedback from './UserFeedback';
import { ToastContainer, toast } from 'react-toastify';
import { useErrorHandler } from '../hooks/useErrorHandler';
import 'react-toastify/dist/ReactToastify.css';


const Star = ({ selected = false, onSelect = f => f }) => (
    <FaStar color={selected ? 'gold' : 'grey'} onClick={onSelect} />
);



const StarRating = ({ totalStars = 5, onRatingSubmit }) => {
    const [selectedStars, setSelectedStars] = useState(0);
    const [comment, setComment] = useState('');
   
    const handleError = useErrorHandler();

    const quizResult = JSON.parse(localStorage.getItem('quizResult'));

    
        const handleOnSubmitRatingClick = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${baseURL}/api/v1/topics/rate-topic`, {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        rating: selectedStars,
                        userId: quizResult.userId,
                        topicId: quizResult.topic.id
                    })
                }); 

                 // If there is a comment, submit it
                if (comment) {
                    const commentResponse = await fetch(`${baseURL}/api/v1/comments`, {
                        method : "POST",
                        headers : {
                            "Content-Type" : "application/json",
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({
                            feedbackByUserId: quizResult.userId,
                            topicId: quizResult.topic.id,
                            comment,
                            feedbackForUserId: quizResult.topic.user.id
                        })
                });
             }
                
                if(response.status === 200) {
                    toast.success('Your feedback has been submitted successfully!');  // toast success message
    
                    onRatingSubmit();
                }
                else if (!response.ok) {
                    toast.error('An error occurred while submitting your rating. Please try again.');  // toast error message
                    throw new Error('Failed to submit rating');
                }
        
            } catch(error) {
                if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                    handleError('An error occurred while trying to reach the server. Please try again');
                } else {
                    handleError(error);
                }
            }
        }
        


    return (
        <>
             <div className="star-rating-container">
                {[...Array(totalStars)].map((n, i) => (
                    <Star
                        key={i}
                        selected={i < selectedStars}
                        onSelect={() => setSelectedStars(i + 1)}
                    />
                ))}
            </div>
            <UserFeedback comment={comment} onCommentChange={setComment} />
            <button onClick={handleOnSubmitRatingClick}>
                Submit
            </button>
        </>
    );
};

export default StarRating;

