import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import CareerQuiz from './components/CareerQuiz';
import Marketplace from './components/Marketplace';
import BookingUI from './components/BookingUI';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Certifications from './components/Certifications';
import Services from './components/Services';
import ExamsHub from './components/ExamsHub';
import LandingPage from './components/LandingPage';
import Explore from './components/Explore';
import { SplashProvider } from './components/SplashAnimation';

function App() {
  return (
    <Router>
      <SplashProvider>
        <div className="app-container">
          <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/quiz" element={<CareerQuiz />} />
            <Route path="/mentors" element={<Marketplace />} />
            <Route path="/bookings" element={<BookingUI />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/services" element={<Services />} />
            <Route path="/exams" element={<ExamsHub />} />
          </Routes>
        </main>
      </div>
     </SplashProvider>
    </Router>
  );
}

export default App;
