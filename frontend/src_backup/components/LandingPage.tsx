import { Link } from 'react-router-dom';
import Testimonials from './Testimonials';
import styles from './LandingPage.module.css';

const HERO_CATEGORIES = [
  { label: "Class 10", path: "/services" },
  { label: "Class 11-12", path: "/services" },
  { label: "College", path: "/services" },
  { label: "Counsellors", path: "/certifications" },
  { label: "Professionals", path: "/services" },
  { label: "Study Abroad", path: "/services" },
];

const LandingPage = () => {
  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
           <h1>Take Flight Toward Your Dream Career</h1>
           <p>Scientifically map out your professional journey with precision matching and industry-certified mentors.</p>
           
           <div className={styles.categoryRow}>
             {HERO_CATEGORIES.map((cat, idx) => (
               <Link key={idx} to={cat.path} className={styles.categoryBtn}>
                 {cat.label}
               </Link>
             ))}
           </div>
        </div>
      </section>

      {/* Explore Teaser Section */}
      <section className={styles.exploreTeaser}>
        <div className={styles.teaserContent}>
           <h2>Not sure where to start?</h2>
           <p>Dive into our extensive library of career clusters to understand job roles, salaries, and growth trajectories.</p>
           <Link to="/explore" className="btn btn-primary">Browse Top Career Categories</Link>
        </div>
      </section>

      {/* Testimonials Integration */}
      <Testimonials />
    </div>
  );
};

export default LandingPage;
