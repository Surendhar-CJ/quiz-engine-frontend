import React, { useState } from 'react';
import '../styles/AskRating.css';
import { FaStar } from 'react-icons/fa';
import { baseURL } from '../config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Star = ({ selected = false, onSelect = f => f }) => (
    <FaStar color={selected ? 'gold' : 'grey'} onClick={onSelect} />
);



const StarRating = ({ totalStars = 5, onRatingSubmit }) => {
    const [selectedStars, setSelectedStars] = useState(0);

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
                
                if(response.status === 200) {
                    toast.success('Your rating has been submitted successfully!');  // toast success message
    
                    onRatingSubmit();
                }
                else if (!response.ok) {
                    toast.error('An error occurred while submitting your rating. Please try again.');  // toast error message
                    throw new Error('Failed to submit rating');
                }
        
                // Do something on successful submission, like resetting the form or displaying a success message
            } catch (error) {
                // Log the error in development environment
                console.error("Error", error);
        
                // Inform the user about the error
                alert('An error occurred while submitting your rating. Please try again.');
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
            <p>
                {selectedStars} of {totalStars} stars
            </p>
            <button onClick={handleOnSubmitRatingClick}>
                Submit Rating
            </button>
        </>
    );
};

export default StarRating;

