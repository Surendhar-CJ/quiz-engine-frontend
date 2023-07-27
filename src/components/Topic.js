import '../styles/Topic.css'

const Topic = (props) => {
    return (
        <div className="topic" onClick={() => props.onTopicClick(props.id)}>
            <div className="top-section">
                <h2 className="topic-card-head">{props.name}</h2>
                <p className="rating">{props.rating} <span className="golden-star">★</span><span className="raters-count">({props.numberOfRaters})</span></p>
            </div>
            <div className="bottom-section">
                <p className="creator">Creator: {props.createdBy}</p>
                <p className="topic-questions-available">Questions: {props.numberOfQuestions}</p>
            </div>
        </div>
    )
}

export default Topic;