import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Modal from './Modal';

const Main = ({showLogin, toggleLogin, showSignUp, toggleSignUp}) => {
    return (
        <main className="main-content">
            <p>Main Content</p>
            <Modal show={showLogin} onClose={toggleLogin} className={showLogin ? 'visible' : ''}>
                 <Login toggleLogin={toggleLogin} toggleSignUp={toggleSignUp}/>
            </Modal>
            <Modal show={showSignUp} onClose={toggleSignUp} className={showSignUp ? 'visible' : ''}>
                 <SignUp toggleLogin={toggleLogin} toggleSignUp={toggleSignUp}/>
            </Modal> 
        </main>
    )
}   

export default Main;