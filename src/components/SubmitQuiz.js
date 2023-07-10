

const SubmitQuiz = (props) => {
    return(
        <div className="submit-quiz">
            <button type="submit" onClick={() => props.onSubmitQuizClick()}>Submit Quiz</button>
        </div>
    )
}

export default SubmitQuiz;