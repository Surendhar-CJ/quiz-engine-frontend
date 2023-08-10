import "../styles/TestHeader.css"


const title = "QUIZFLECT"

const TestHeader = (props) => {

    return (
        <header className="test-header-container">
            <div className="test-header-content">
                <h1 className="test-title">{title}</h1>
                <span className="exit-quiz" onClick={props.onExitQuizClick}>Exit Quiz</span>
            </div>
        </header>
    )

}


export default TestHeader;