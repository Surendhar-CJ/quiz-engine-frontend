import "../styles/TestHeader.css"


const title = "Quiz"

const TestHeader = () => {

    return (
        <header className="test-header-container">
            <h1 className="test-title">{title}</h1>
            <span className="exit-quiz">Exit Quiz</span>
        </header>
    )

}


export default TestHeader;