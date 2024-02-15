import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup.jsx';
import AboutPage from './Components/AboutPage/AboutPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;