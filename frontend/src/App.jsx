import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import CareerQuiz from "./components/CareerQuiz";
import Marketplace from "./components/Marketplace";
import BookingUI from "./components/BookingUI";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthContainer from "./components/AuthContainer";
import Assessments from "./components/Assessments";
import Certifications from "./components/Certifications";
import Services from "./components/Services";
import Support from "./components/Support";
import PathDetail from "./components/PathDetail";
import ExamsHub from "./components/ExamsHub";
import LandingPage from "./components/LandingPage";
import RocketPromo from "./components/RocketPromo";
import Explore from "./components/Explore";
import ArticleDetail from "./components/ArticleDetail";
import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./components/AdminPanel";
import CourseContent from "./components/CourseContent";

function App() {
  return (
    <Router>
      <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public routes — accessible without login */}
              <Route path="/" element={<RocketPromo />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/login" element={<div style={{ position: 'relative' }}><LandingPage /><div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}><Login /></div></div>} />
              <Route path="/signup" element={<div style={{ position: 'relative' }}><LandingPage /><div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}><SignUp /></div></div>} />

              {/* Protected routes — redirect to /login if not authenticated */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
              <Route path="/path/:id" element={<ProtectedRoute><PathDetail /></ProtectedRoute>} />
              <Route path="/quiz/:type" element={<ProtectedRoute><CareerQuiz /></ProtectedRoute>} />
              <Route path="/mentors" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingUI /></ProtectedRoute>} />
              <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
              <Route path="/exams" element={<ProtectedRoute><ExamsHub /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/article/:id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            </Routes>
          </main>
          <ChatWidget />
        </div>
    </Router>
  );
}

export default App;
