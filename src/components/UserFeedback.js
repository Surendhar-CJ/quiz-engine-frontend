



import React, { useState } from "react";

import '../styles/QuizResult.css';

const UserFeedback = ({  comment, onCommentChange }) => {

    const handleCommentChange = (e) => {
        onCommentChange(e.target.value);
    }

    return (
        <div className="ask-user-feedback">
            <textarea
                placeholder="Please provide your feedback here."
                value={comment}
                onChange={handleCommentChange}
            />
        </div>
    )
}
    export default UserFeedback;