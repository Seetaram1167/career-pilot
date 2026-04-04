import { Users, GraduationCap, Briefcase, Star, Clock } from 'lucide-react';
import styles from './Services.module.css';

const SERVICES = [
  {
    id: 1,
    title: "10th Grade Stream Selection",
    target: "Class 9th & 10th",
    icon: <Users size={32} />,
    color: "var(--vibrant-blue)",
    features: ["Psychometric Stream Test", "1-on-1 Guidance Session", "Subject Mapping Report"],
    price: "₹2,499"
  },
  {
    id: 2,
    title: "12th Grade Career Mapping",
    target: "Class 11th & 12th",
    icon: <GraduationCap size={32} />,
    color: "var(--deep-navy)",
    features: ["Entrance Exam Strategy", "College Shortlisting", "Backup Option Planning"],
    price: "₹3,999"
  },
  {
    id: 3,
    title: "Working Professionals Pivot",
    target: "Grads & Professionals",
    icon: <Briefcase size={32} />,
    color: "var(--success-green)",
    features: ["Resume & LinkedIn Review", "Industry Transition Plan", "Mock Interview Session"],
    price: "₹4,499"
  }
];

const Services = () => {
  return (
    <div className="page-container">
       <div className={styles.heroSection}>
          <h1>Targeted Counselling Packages</h1>
          <p>Get personalized, 1-on-1 guidance from India's top career experts tailored exactly to your current career stage.</p>
       </div>

       <div className={styles.servicesGrid}>
          {SERVICES.map(service => (
            <div key={service.id} className={`card ${styles.serviceCard}`}>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                {service.icon}
              </div>
              
              <div className={styles.targetBadge}>{service.target}</div>
              <h3>{service.title}</h3>
              
              <ul className={styles.featureList}>
                {service.features.map((feature, index) => (
                  <li key={index}><Star size={14} className={styles.featureIcon} /> {feature}</li>
                ))}
              </ul>
              
              <div className={styles.priceSection}>
                <span className={styles.price}>{service.price}</span>
                <span className={styles.duration}><Clock size={14} /> 60 Min Session</span>
              </div>
              
              <button className={`btn btn-primary ${styles.bookBtn}`} style={{ backgroundColor: service.color }}>
                Book Session Now
              </button>
            </div>
          ))}
       </div>
    </div>
  );
};

export default Services;
