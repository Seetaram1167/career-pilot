import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock } from 'lucide-react';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    navigate('/');
  };

  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard}`}>
        <div className={styles.logoContainer}>
          <Compass className={styles.logoIcon} size={40} />
          <h2>Welcome Back</h2>
          <p>Log in to continue your career journey.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input type="email" id="email" placeholder="student@example.com" required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input type="password" id="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className={styles.authActions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Log In
          </button>
        </form>

        <p className={styles.switchMode}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
