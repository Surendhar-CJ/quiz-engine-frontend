import '../styles/QuizSummary.css';

const QuizSummary = ({quizResult}) => {
    const {
        topic, 
        finalScore, 
        totalNumberOfMarks,
        finalPercentage,
        noOfQuestions,
        createdAt,
        completedAt,
        difficultyLevel,
        questionsLimit,
        feedbackType
    } = quizResult;

    const startedAt = new Date(createdAt);
    const endedAt = new Date(completedAt);

    const formatDate = (date) => {
        return `${date.getDate()}-${date.getMonth() +1}-${date.getFullYear()}`;
    }

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const calculateTimeElapsed = (start, end) => {
        let diff = end - start;
        const hours = Math.floor(diff / 3600000);
        diff = diff - hours * 3600000;
        const minutes = Math.floor(diff / 60000);
        diff = diff - minutes * 60000;
        const seconds = Math.floor(diff / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <div className="quiz-summary-table">
            <table className= "quiz-summary">
                <caption>Summary</caption>
                <tr><td className="quiz-summary-label">Topic</td><td>:</td><td className="quiz-summary-value">{topic.name}</td></tr>
                <tr><td className="quiz-summary-label">Marks scored</td><td>:</td><td className="quiz-summary-value">{finalScore} / {totalNumberOfMarks}</td></tr>
                <tr><td className="quiz-summary-label">Percentage</td><td>:</td><td className="quiz-summary-value">{finalPercentage} %</td></tr>
                <tr><td className="quiz-summary-label">Number of questions</td><td>:</td><td className="quiz-summary-value">{noOfQuestions}</td></tr>
                <tr><td className="quiz-summary-label">Date</td><td>:</td><td className="quiz-summary-value">{formatDate(startedAt)}</td></tr>
                <tr><td className="quiz-summary-label">Time started</td><td>:</td><td className="quiz-summary-value">{formatTime(startedAt)}</td></tr>
                <tr><td className="quiz-summary-label">Time completed</td><td>:</td><td className="quiz-summary-value">{formatTime(endedAt)}</td></tr>
                <tr><td className="quiz-summary-label">Time elapsed</td><td>:</td><td className="quiz-summary-value">{calculateTimeElapsed(startedAt, endedAt)}</td></tr>
                <tr><td className="quiz-summary-label">Difficulty level</td><td>:</td><td className="quiz-summary-value">{difficultyLevel ? toTitleCase(difficultyLevel) : "No"}</td></tr>
                <tr><td className="quiz-summary-label">Question limit</td><td>:</td><td className="quiz-summary-value">{questionsLimit ? questionsLimit : "No"}</td></tr>
                <tr><td className="quiz-summary-label">Feedback type</td><td>:</td><td className="quiz-summary-value">{toTitleCase(feedbackType)}</td></tr>
            </table>
        </div>
    )
}

export default QuizSummary;
