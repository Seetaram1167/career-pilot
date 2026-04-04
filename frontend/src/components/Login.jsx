import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Compass,
  Rocket,
  X,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
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

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: "", message: "" });

  const handleSendResetOTP = async () => {
    if (!recoveryEmail) return;
    setForgotError("");
    setIsForgotLoading(true);
    const email = recoveryEmail.toLowerCase().trim();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecoveryStep(2);
        setResendTimer(60);
        setCanResend(false);
      } else {
        setForgotError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setForgotError("Connection error");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!resetOtp) return;
    setForgotError("");
    setIsForgotLoading(true);
    const email = recoveryEmail.toLowerCase().trim();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: resetOtp }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecoveryStep(3);
      } else {
        setForgotError(data.message || "Invalid or expired verification code");
      }
    } catch (err) {
      setForgotError("Connection error");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetOtp || !newPassword) return;
    setForgotError("");
    setIsForgotLoading(true);
    const email = recoveryEmail.toLowerCase().trim();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp: resetOtp, 
          newPassword: newPassword 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessData({ title: "Password Reset!", message: "Password successfully created. You can now log in." });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsForgotOpen(false);
          setRecoveryStep(1);
          setRecoveryEmail("");
          setResetOtp("");
          setNewPassword("");
        }, 3000);
      } else {
        setForgotError(data.message || "Reset failed");
      }
    } catch (err) {
      setForgotError("Connection error");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        const isAdmin = data.role === "admin";
        const targetPath = isAdmin ? "/admin" : "/dashboard";
        
        setSuccessData({ 
          title: "Welcome!", 
          message: `Login successful. Redirecting to ${isAdmin ? "Admin Panel" : "dashboard"}...` 
        });
        setShowSuccess(true);
        setTimeout(() => {
          navigate(targetPath, { replace: true });
        }, 2000);
      } else {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to connect to server");
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
    <div className="login-root">
      <style>{`
        .login-root {
          min-height: 100vh;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          perspective: 1200px; /* Enhanced 3D depth */
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          color: white;
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
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
        .login-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          color: white;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.2s, background 0.2s;
          color-scheme: dark;
        }
        .login-input:focus {
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
        .login-btn {
          width: 100%;
          padding: 16px;
          background: #facc15;
          color: #0f172a;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
          transition: transform 0.2s, opacity 0.2s;
        }
        .login-btn:active { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
          font-size: 0.9rem;
        }
        .signup-link {
          margin-top: 32px;
          text-align: center;
          color: #94a3b8;
        }
        .signup-link button {
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
        initial={{ opacity: 0, rotateY: 45, x: 20 }} 
        animate={{ opacity: 1, rotateY: 0, x: 0 }} 
        exit={{ opacity: 0, rotateY: -45, x: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="login-card"
      >
        <button className="close-btn" onClick={() => navigate('/home')} aria-label="Close">
          <X size={18} />
        </button>

        <div className="logo-container">
          <div className="logo-circle">
            <Compass size={32} color="#facc15" />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8' }}>Secure access to your CareerPilot dashboard</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="field-group">
            <span className="form-label">I am logging in as a:</span>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              {['student', 'mentor', 'admin'].map(r => (
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
            <span className="form-label">Email Address</span>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="login-input" 
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
            <span className="form-label">Password</span>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="login-input" 
                autoComplete="off"
              />
              {password && (
                <button type="button" className="clear-icon-btn" onClick={() => setPassword("")} aria-label="Clear password">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 24, textAlign: 'right' }}>
            <button 
              type="button"
              onClick={() => setIsForgotOpen(true)}
              style={{ background: 'none', border: 'none', color: '#facc15', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <button onClick={() => navigate('/signup')}>Sign Up here</button>
        </div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {isForgotOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="login-card"
                style={{ maxWidth: 400, padding: 32 }}
              >
                <button className="close-btn" onClick={() => { setIsForgotOpen(false); setRecoveryStep(1); }} style={{ top: 16, right: 16 }}>
                  <X size={16} />
                </button>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Reset Password</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 24, textAlign: 'center' }}>
                  {recoveryStep === 1 
                    ? "Enter your email to receive a 6-digit verification code." 
                    : recoveryStep === 2 
                    ? "Enter the 6-digit code sent to your email." 
                    : "Enter your new password below."}
                </p>

                {forgotError && (
                  <motion.div 
                    initial={{ x: -10 }}
                    animate={{ x: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                    className="error-msg" 
                    style={{ fontSize: '0.8rem', padding: 8 }}
                  >
                    {forgotError}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {recoveryStep === 1 && (
                    <motion.div key="rec1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="field-group">
                        <span className="form-label">Email Address</span>
                        <div className="input-wrapper">
                          <Mail className="input-icon" size={20} />
                          <input type="email" placeholder="example@gmail.com" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="login-input" />
                        </div>
                      </div>
                      <button onClick={handleSendResetOTP} className="login-btn" disabled={!recoveryEmail || isForgotLoading}>
                        {isForgotLoading ? "Sending..." : "Send Verification Code"}
                      </button>
                    </motion.div>
                  )}
                  
                  {recoveryStep === 2 && (
                    <motion.div key="rec2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="field-group">
                        <span className="form-label">Verification Code</span>
                        <div className="input-wrapper">
                          <ShieldCheck className="input-icon" size={20} />
                          <input type="text" placeholder="000000" value={resetOtp} onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))} maxLength={6} className="login-input" style={{ letterSpacing: 4, textAlign: 'center', paddingLeft: 14 }} />
                        </div>
                      </div>
                      <button onClick={handleVerifyOTP} className="login-btn" disabled={!resetOtp || isForgotLoading}>
                        {isForgotLoading ? "Verifying..." : "Verify OTP"}
                      </button>

                      <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.85rem' }}>
                        {resendTimer > 0 ? (
                          <p style={{ color: '#94a3b8' }}>Resend code in <span style={{ color: '#facc15', fontWeight: 600 }}>{resendTimer}s</span></p>
                        ) : (
                          <button 
                            onClick={handleSendResetOTP} 
                            style={{ background: 'none', border: 'none', color: '#facc15', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                            disabled={isForgotLoading}
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                      <button onClick={() => setRecoveryStep(1)} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}>
                        Back to email
                      </button>
                    </motion.div>
                  )}

                  {recoveryStep === 3 && (
                    <motion.div key="rec3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="field-group">
                        <span className="form-label">New Password</span>
                        <div className="input-wrapper">
                          <Lock className="input-icon" size={20} />
                          <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="login-input" />
                        </div>
                      </div>
                      <button onClick={handleResetPassword} className="login-btn" disabled={!newPassword || isForgotLoading}>
                        {isForgotLoading ? "Resetting..." : "Update Password"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
