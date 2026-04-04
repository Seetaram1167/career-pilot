import { Award, BookOpen, Clock, PlayCircle } from 'lucide-react';
import styles from './Certifications.module.css';

const CERT_COURSES = [
  {
    id: 1,
    title: "Become a Pro Counsellor Pipeline",
    modules: "8 Course Bundle",
    price: "₹27,000",
    originalPrice: "₹50,500",
    description: "Master the art of student coaching and psychology to build a rewarding independent practice."
  },
  {
    id: 2,
    title: "Guiding School Students (10th & 12th)",
    modules: "16 Modules",
    price: "₹10,000",
    originalPrice: "₹15,000",
    description: "Learn precisely how to analyze streams and map teenagers to their ideal early career paths."
  },
  {
    id: 3,
    title: "Study Abroad Admission Guidance",
    modules: "Bundle of 6 Hours",
    price: "₹10,000",
    originalPrice: "₹30,000",
    description: "The complete blueprint for guiding applications, essays, and visas for international universities."
  },
  {
    id: 4,
    title: "Personal Branding & Sales for Coaches",
    modules: "10 Modules",
    price: "₹5,000",
    originalPrice: "",
    description: "Get the exact sales blueprint and digital marketing strategies used by elite Career Counselors."
  }
];

const Certifications = () => {
  return (
    <div className="page-container">
      <div className={styles.heroSection}>
        <Award className={styles.heroIcon} size={48} />
        <h1>Career Counsellor Certifications</h1>
        <p>Upskill yourself, get certified by industry leaders, and start your own profitable coaching practice.</p>
      </div>

      <div className={styles.grid}>
        {CERT_COURSES.map(course => (
          <div key={course.id} className={`card ${styles.courseCard}`}>
            <div className={styles.cardHeader}>
               <h3>{course.title}</h3>
            </div>
            
            <p className={styles.description}>{course.description}</p>
            
            <div className={styles.metaRow}>
              <span className={styles.tag}><BookOpen size={14} /> {course.modules}</span>
              <span className={styles.tag}><Clock size={14} /> Self Paced</span>
            </div>
            
            <div className={styles.pricingRow}>
              <span className={styles.price}>{course.price}</span>
              {course.originalPrice && <span className={styles.originalPrice}>{course.originalPrice}</span>}
            </div>
            
            <button className={`btn btn-primary ${styles.viewBtn}`}>
              <PlayCircle size={18} /> View Program Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
