import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginUser from './LoginUser';
import { useState } from 'react';
import { REQUEST, sendData } from "./server";
function App() {
    const [showLogin, setShowLogin] = useState(false)

    function resetDatabase() {
        sendData(REQUEST.RESET)
        setShowLogin(false)
    }

    function initializeDatabase() {
       sendData(REQUEST.INIT)
       setShowLogin(false)
    }

    return (
        <div className="App">
            <div className='header'></div>
            {showLogin ? <LoginUser></LoginUser> : <RegistrationForm></RegistrationForm>}
            <button onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? 'Not Registered?' : 'Already registered?'}
            </button>
            <button onClick={resetDatabase}>
                Reset Database
            </button>
            <button onClick={initializeDatabase}>
                Initialize Database
            </button>
        </div>
    )
}

export default App;
