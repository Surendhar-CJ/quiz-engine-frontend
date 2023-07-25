

const SubmitQuiz = (props) => {
    const feedback = props.quizDetails.feedbackType.type;

    return(
        <div className="submit-quiz">
            <p>{feedback.toLowerCase() === "immediate response" || feedback.toLowerCase() === "immediate correct answer response" || feedback.toLowerCase() === "immediate elaborated" ?
                "Click to submit the quiz" : "Are you sure to submit the quiz? If NO, click anywhere on the screen"}</p>
            <button type="submit" onClick={() => props.onSubmitQuizClick()}>Submit Quiz</button>
        </div>
    )
}

export default SubmitQuiz;