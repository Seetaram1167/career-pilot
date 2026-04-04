import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, Phone, CheckCircle, GraduationCap } from 'lucide-react';
import styles from './Auth.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phoneNumber.length > 9) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpVerified(true);
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (otpVerified) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/quiz');
  };

  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard}`}>
        <div className={styles.logoContainer}>
          <Compass className={styles.logoIcon} size={40} />
          <h2>Join CareerPilot</h2>
          <p>Create an account to start exploring your future.</p>
        </div>

        <div className={styles.stepperIndicator}>
           <div className={`${styles.stepDot} ${step >= 1 ? styles.activeStep : ''}`}>1</div>
           <div className={styles.stepLine}></div>
           <div className={`${styles.stepDot} ${step >= 2 ? styles.activeStep : ''}`}>2</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          
          {step === 1 && (
            <div className={styles.stepContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={18} />
                  <input type="text" id="name" placeholder="Alex Johnson" required />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input type="email" id="email" placeholder="student@example.com" required />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone Number</label>
                <div className={styles.phoneGroup}>
                   <div className={styles.inputWrapper} style={{ flex: 1 }}>
                     <Phone className={styles.inputIcon} size={18} />
                     <input 
                        type="tel" 
                        id="phone" 
                        placeholder="9876543210" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={otpVerified}
                        required 
                     />
                   </div>
                   {!otpVerified && (
                     <button 
                       type="button" 
                       className={`btn btn-secondary ${styles.otpBtn}`}
                       onClick={handleSendOTP}
                       disabled={phoneNumber.length < 10}
                     >
                       {otpSent ? 'Resend OTP' : 'Send OTP'}
                     </button>
                   )}
                   {otpVerified && (
                     <div className={styles.verifiedBadge}>
                       <CheckCircle size={20} />
                     </div>
                   )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className={styles.inputGroup}>
                  <label htmlFor="otp">Enter OTP</label>
                  <div className={styles.phoneGroup}>
                     <div className={styles.inputWrapper} style={{ flex: 1 }}>
                       <Lock className={styles.inputIcon} size={18} />
                       <input type="text" id="otp" placeholder="123456" maxLength={6} required />
                     </div>
                     <button 
                       type="button" 
                       className={`btn btn-primary ${styles.otpBtn}`}
                       onClick={handleVerifyOTP}
                     >
                       Verify
                     </button>
                  </div>
                </div>
              )}

              <button 
                type="button" 
                className={`btn btn-primary ${styles.submitBtn}`}
                onClick={handleNextStep}
                disabled={!otpVerified}
              >
                Continue Setup
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="educationLevel">Current Education Level</label>
                <div className={styles.inputWrapper}>
                  <GraduationCap className={styles.inputIcon} size={18} />
                  <select id="educationLevel" className={styles.selectInput} required>
                    <option value="">Select your grade/level...</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="college_ug">Undergraduate (College)</option>
                    <option value="college_pg">Postgraduate</option>
                    <option value="working">Working Professional</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="schoolName">School / College Name</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={18} />
                  <input type="text" id="schoolName" placeholder="Delhi Public School" required />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Create Password</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input type="password" id="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className={styles.actionButtonsRow}>
                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={() => setStep(1)}
                 >
                   Back
                 </button>
                 <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                   Create Account
                 </button>
              </div>
            </div>
          )}
        </form>

        <p className={styles.switchMode}>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
