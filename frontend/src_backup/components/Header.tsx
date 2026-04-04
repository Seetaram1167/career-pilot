import { Link, useLocation } from 'react-router-dom';
import { Compass, Calendar, Users, Home, LayoutGrid, Book } from 'lucide-react';
import { useSplash } from './SplashAnimation';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const { triggerSplash } = useSplash();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo} onClick={(e) => {
          if (location.pathname === '/') {
            e.preventDefault();
            triggerSplash();
          }
        }}>
          <Compass className={styles.logoIcon} size={28} />
          <Link to="/" className={styles.logoText}>CareerPilot</Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/explore" className={`${styles.navLink} ${isActive('/explore') ? styles.active : ''}`}>
             <LayoutGrid size={18} />
             <span>Explore Paths</span>
          </Link>
          <Link to="/services" className={`${styles.navLink} ${isActive('/services') ? styles.active : ''}`}>
             <Users size={18} />
             <span>Counselling</span>
          </Link>
          <Link to="/exams" className={`${styles.navLink} ${isActive('/exams') ? styles.active : ''}`}>
             <Calendar size={18} />
             <span>Exams</span>
          </Link>
          <Link to="/certifications" className={`${styles.navLink} ${isActive('/certifications') ? styles.active : ''}`}>
             <Compass size={18} />
             <span>Pro Certifications</span>
          </Link>
          <Link to="/quiz" className={`${styles.navLink} ${isActive('/quiz') ? styles.active : ''}`}>
             <Book size={18} />
             <span>Assessments</span>
          </Link>
        </nav>

        <div className={styles.actions}>
           <Link to="/login" className="btn btn-secondary">Log In</Link>
           <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
