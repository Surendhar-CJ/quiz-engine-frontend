import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Modal from './Modal';
import Card1 from "./landingPageComponents/Card1.js";
import Card2 from "./landingPageComponents/Card2.js";
import Card3 from "./landingPageComponents/Card3.js";
import Card4 from "./landingPageComponents/Card4.js";
import "../styles/LandingPageComponents.css";

const Main = ({showLogin, toggleLogin, showSignUp, toggleSignUp}) => {
    return (
        <main className="main-content">
            <Modal show={showLogin} onClose={toggleLogin} className={showLogin ? 'visible' : ''}>
                 <Login toggleLogin={toggleLogin} toggleSignUp={toggleSignUp}/>
            </Modal>
            <Modal show={showSignUp} onClose={toggleSignUp} className={showSignUp ? 'visible' : ''}>
                 <SignUp toggleLogin={toggleLogin} toggleSignUp={toggleSignUp}/>
            </Modal> 
            <div className="landing-cards">
                <Card1 />
                <Card2 />
                <Card3 />
                <Card4 />
            </div>
      

        </main>
    )
}   

export default Main;