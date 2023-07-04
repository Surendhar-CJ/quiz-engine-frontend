import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Modal from './Modal';

const Main = ({showLogin, toggleLogin, showSignUp, toggleSignUp}) => {
    return (
        <main className="main-content">
            <p>Main Content</p>
            <Modal show={showLogin} onClose={toggleLogin}>
                 <Login />
            </Modal>
            <Modal show={showSignUp} onClose={toggleSignUp}>
                 <SignUp />
            </Modal> 
        </main>
    )
}   

export default Main;