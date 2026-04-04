import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ChevronLeft,
  Calendar,
  GraduationCap,
  Sparkles,
  X
} from "lucide-react";
import { API_BASE_URL } from "../apiConfig";
import { motion, AnimatePresence } from "framer-motion";

const interestOptions = [
  "Technology", "Medicine", "Arts", "Engineering", "Business", 
  "Civil Services", "Law", "Designing", "Marketing", "Journalism"
];

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [education, setEducation] = useState("");
  const [interests, setInterests] = useState([]);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [role, setRole] = useState("student");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: "", message: "" });

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  React.useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const lowerEmail = email.toLowerCase().trim();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email: lowerEmail, 
          password, 
          phone: phoneNumber,
          dob,
          education,
          interests,
          role
        }),
      });
      if (res.ok) {
        await fetch(`${API_BASE_URL}/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setStep(5);
        setResendTimer(60);
        setCanResend(false);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) { setError("Failed to connect"); }
    finally { setIsLoading(false); }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError("");
    const lowerEmail = email.toLowerCase().trim();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lowerEmail }),
      });
      if (res.ok) {
        setResendTimer(60);
        setCanResend(false);
        // Temporary success indicator
        const successMsg = document.createElement("div");
        successMsg.innerText = "OTP Resent Successfully!";
        successMsg.style.cssText = "color: #10b981; margin-top: 10px; font-weight: 600;";
        const container = document.getElementById("otp-container");
        if (container) {
          container.appendChild(successMsg);
          setTimeout(() => successMsg.remove(), 3000);
        }
      } else {
        const data = await res.json();
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError("");
    const lowerEmail = email.toLowerCase().trim();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lowerEmail, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setSuccessData({ title: "Account Created!", message: "Welcome to CareerPilot. Your account is verified." });
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/quiz");
        }, 2500);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessPopup = ({ title, message }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <motion.div 
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: 'rgba(30, 41, 59, 0.9)',
          padding: '48px 32px',
          borderRadius: 32,
          textAlign: 'center',
          maxWidth: 360,
          width: '90%',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            style={{
                width: 80, height: 80,
                background: 'rgba(250, 204, 21, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                border: '2px solid #facc15'
            }}
        >
            <Sparkles size={40} color="#facc15" />
        </motion.div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>{title}</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{message}</p>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="signup-root">
      <style>{`
        .signup-root {
          min-height: 100vh;
          background: transparent; /* Changed to transparent for overlay */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          position: relative;
          perspective: 1200px; /* Enhanced 3D depth */
        }
        .signup-card {
          width: 100%;
          max-width: 480px;
          color: white;
          background: rgba(30, 41, 59, 0.4); /* Glassmorphism background */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10;
        }
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .logo-circle {
          width: 64px;
          height: 64px;
          background: #1e293b;
          border: 2px solid #facc15;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.2);
        }
        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 32px 0;
          position: relative;
          padding: 0 40px;
        }
        .stepper-line {
          position: absolute;
          top: 50%;
          left: 40px;
          right: 40px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
          transform: translateY(-50%);
        }
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #334155;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          z-index: 2;
          border: 2px solid transparent;
        }
        .step-circle.active {
          background: #facc15;
          color: #0f172a;
        }
        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 8px;
        }
        .field-group {
          margin-bottom: 24px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .signup-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6); /* Darker transparent input */
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          color: white;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.2s, background 0.2s;
          color-scheme: dark; /* Helps with dropdown and date picker coloring */
        }
        .signup-input:focus {
          border-color: #facc15;
          background: rgba(255, 255, 255, 0.08);
        }
        .clear-icon-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
          opacity: 0.6;
        }
        .clear-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          opacity: 1;
        }
        .signup-select {
          appearance: none;
          cursor: pointer;
        }
        .btn-group {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }
        .signup-btn {
          flex: 1;
          padding: 14px;
          background: #facc15;
          color: #0f172a;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: opacity 0.2s, transform 0.2s;
        }
        .signup-btn:active { transform: scale(0.98); }
        .signup-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .signup-btn.back {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          flex: 0 0 100px;
        }
        .error-msg {
          color: #f87171;
          text-align: center;
          margin-bottom: 20px;
          font-size: 0.9rem;
          background: rgba(239, 68, 68, 0.1);
          padding: 10px;
          border-radius: 8px;
        }
        .login-link {
          margin-top: 24px;
          text-align: center;
          font-size: 0.95rem;
          color: #94a3b8;
        }
        .login-link button {
          background: none;
          border: none;
          color: #facc15;
          cursor: pointer;
          font-weight: 700;
          margin-left: 4px;
        }
      `}</style>

      <AnimatePresence>
        {showSuccess && <SuccessPopup title={successData.title} message={successData.message} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, rotateY: -45, x: -20 }} 
        animate={{ opacity: 1, rotateY: 0, x: 0 }} 
        exit={{ opacity: 0, rotateY: 45, x: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="signup-card"
      >
        <button className="close-btn" onClick={() => navigate('/home')} aria-label="Close">
          <X size={18} />
        </button>

        <div className="logo-container">
          <div className="logo-circle">
            <Compass size={32} color="#facc15" />
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Join CareerPilot</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Create an account to start exploring your future.</p>
        </div>

        <div className="stepper">
          <div className="stepper-line"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
            <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="field-group">
                <span className="form-label">I am signing up as a:</span>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  {['student', 'mentor'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        background: role === r ? '#facc15' : 'rgba(15, 23, 42, 0.6)',
                        color: role === r ? '#0f172a' : '#94a3b8',
                        border: '1px solid',
                        borderColor: role === r ? '#facc15' : 'rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="form-label">Full Name</span>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="signup-input" 
                    autoComplete="off" 
                  />
                  {name && (
                    <button type="button" className="clear-icon-btn" onClick={() => setName("")} aria-label="Clear name">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="field-group">
                <span className="form-label">Email Address</span>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="signup-input" 
                    autoComplete="off" 
                  />
                  {email && (
                    <button type="button" className="clear-icon-btn" onClick={() => setEmail("")} aria-label="Clear email">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="field-group">
                <span className="form-label">Phone Number</span>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={20} />
                  <input 
                    type="tel" 
                    placeholder="+91 99999 99999" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    className="signup-input" 
                    autoComplete="off" 
                  />
                  {phoneNumber && (
                    <button type="button" className="clear-icon-btn" onClick={() => setPhoneNumber("")} aria-label="Clear phone">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="btn-group">
                <button onClick={() => setStep(2)} className="signup-btn" disabled={!name || !email || !phoneNumber}>Continue</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="field-group">
                <span className="form-label">Current Education Level</span>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" size={20} />
                  <select value={education} onChange={(e) => setEducation(e.target.value)} className="signup-input signup-select">
                    <option value="" disabled>Select Education Level</option>
                    <option value="10th">10th</option>
                    <option value="After 11th 12th">After 11th 12th</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Professionals">Professionals</option>
                  </select>
                </div>
              </div>

              <div className="field-group">
                <span className="form-label">School / College Name</span>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="e.g. Harvard University" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    className="signup-input" 
                    autoComplete="off" 
                  />
                  {dob && (
                    <button type="button" className="clear-icon-btn" onClick={() => setDob("")} aria-label="Clear school/college">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="field-group">
                <span className="form-label">Create Password</span>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="signup-input" 
                    autoComplete="new-password" 
                  />
                  {password && (
                    <button type="button" className="clear-icon-btn" onClick={() => setPassword("")} aria-label="Clear password">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="btn-group">
                <button onClick={() => setStep(1)} className="signup-btn back">Back</button>
                <button onClick={handleRegister} className="signup-btn" disabled={!education || !dob || !password || isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }} id="otp-container">
              <p style={{ color: '#94a3b8', marginBottom: 20 }}>Enter the code sent to {email}</p>
              <input type="text" placeholder="000000" className="signup-input" style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: 8, padding: 16, border: '2px dashed #facc15', background: 'rgba(250, 204, 21, 0.05)' }} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} maxLength={6} />
              
              <div style={{ marginTop: 16, fontSize: '0.9rem' }}>
                {resendTimer > 0 ? (
                  <p style={{ color: '#94a3b8' }}>Resend code in <span style={{ color: '#facc15', fontWeight: 600 }}>{resendTimer}s</span></p>
                ) : (
                  <button 
                    onClick={handleResendOTP} 
                    style={{ background: 'none', border: 'none', color: '#facc15', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button onClick={handleVerifyOTP} className="signup-btn" style={{ marginTop: 24 }} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Launch 🚀"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="login-link">
          Already have an account? <button onClick={() => navigate('/login')}>Log in here</button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
