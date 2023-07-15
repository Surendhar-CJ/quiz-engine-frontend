

const SubmitQuiz = (props) => {
    const feedback = props.quizDetails.feedbackType.type;

    return(
        <div className="submit-quiz">
            <p>{feedback.toLowerCase() === "immediate_response" || feedback.toLowerCase() === "immediate_correct_answer_response" || feedback.toLowerCase() === "immediate_elaborated" ?
                "Click to submit the quiz" : "Are you sure to submit the quiz? If NO, click anywhere on the screen"}</p>
            <button type="submit" onClick={() => props.onSubmitQuizClick()}>Submit Quiz</button>
        </div>
    )
}

export default SubmitQuiz;