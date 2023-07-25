import '../styles/Topic.css'

const Topic = (props) => {
    return (
        <div className="topic" onClick={() => props.onTopicClick(props.id)}>
            <h2>{props.name}</h2>
            <p className="topic-questions-available">Questions available: {props.numberOfQuestions}</p>
        </div>
    )
}

export default Topic;