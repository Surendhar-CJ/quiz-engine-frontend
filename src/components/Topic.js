import '../styles/Topic.css'

const Topic = (props) => {
    return (
        <div className="topic">
            <h2>{props.name}</h2>
            <p>Questions available: {props.numberOfQuestions}</p>
        </div>
    )
}

export default Topic;