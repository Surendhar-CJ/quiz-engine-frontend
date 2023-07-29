

const SubmitQuiz = (props) => {
    const feedback = props.quizDetails.feedbackType.type;

    return(
        <div className="submit-quiz">
            <p>{feedback.toLowerCase() === "instant feedback" || feedback.toLowerCase() === "instant correct answer feedback" || feedback.toLowerCase() === "instant detailed feedback" ?
                "Click to submit the quiz" : "Are you sure to submit the quiz? If No, click anywhere on the screen"}</p>
            <button type="submit" onClick={() => props.onSubmitQuizClick()}>Submit Quiz</button>
        </div>
    )
}

export default SubmitQuiz;