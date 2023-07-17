import "../styles/FeedbackCard.css";

const FeedbackCard = (props) => {
    let resultClass = '';
    switch(props.result.toLowerCase()) {
        case "correct":
            resultClass = "correct";
            break;
        case "partially correct":
            resultClass = "partial";
            break;
        case "incorrect":
            resultClass = "incorrect";
            break;
        default:
            resultClass = "";
    }
    
    return (
        <div className={`feedback-card ${resultClass}`}>
            <p>Result:</p>
            <p>{props.result}</p>
            {props.correctAnswer && props.correctAnswer.length > 0 && 
            <div>
                <p>Correct Answer(s):</p>
                {props.correctAnswer.map(answer => (
                    <p key={answer.id}>{answer.text}</p>
                ))}
            </div>
            }
            {props.explanation !== "" && 
            <div>
                <p>Explanation:</p>
                <p>{props.explanation}</p>
            </div>
            }
        </div>
    )
}

export default FeedbackCard;
