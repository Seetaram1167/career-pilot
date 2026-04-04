import { Calculator, HeartPulse, HardHat, TrendingUp, Search, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import styles from './ExamsHub.module.css';

const EXAMS = [
  {
    id: 1,
    category: "Engineering Integration",
    name: "JEE Main 2026",
    date: "April 15, 2026",
    status: "Upcoming",
    icon: <Calculator size={32} />,
    color: "#06B6D4" // Vibrant Blue / Cyan
  },
  {
    id: 2,
    category: "Medical & Health",
    name: "NEET UG 2026",
    date: "May 3, 2026",
    status: "Registration Open",
    icon: <HeartPulse size={32} />,
    color: "#10B981" // Success Green
  },
  {
    id: 3,
    category: "Architecture",
    name: "NATA 2026",
    date: "June 10, 2026",
    status: "To Be Announced",
    icon: <HardHat size={32} />,
    color: "#F59E0B" // Amber
  },
  {
    id: 4,
    category: "Management",
    name: "IPMAT 2026",
    date: "May 25, 2026",
    status: "Upcoming",
    icon: <TrendingUp size={32} />,
    color: "#4C1D95" // Deep Violet
  }
];

const ExamsHub = () => {
  return (
    <div className="page-container">
       <div className={styles.heroSection}>
          <h1>Competitive Exams Hub</h1>
          <p>Your centralized directory for top entrance exams. Track dates, view syllabi, and plan your preparation strategy.</p>
          
          <div className={styles.searchBar}>
             <Search className={styles.searchIcon} size={20} />
             <input type="text" placeholder="Search for exams (e.g. JEE, NEET, CLAT)..." />
             <button className="btn btn-primary">Search</button>
          </div>
       </div>

       <div className={styles.examsGrid}>
          {EXAMS.map(exam => (
            <div key={exam.id} className={`card ${styles.examCard}`}>
               <div className={styles.iconHeader} style={{ backgroundColor: `${exam.color}15`, color: exam.color }}>
                  {exam.icon}
               </div>
               
               <div className={styles.examDetails}>
                 <span className={styles.category}>{exam.category}</span>
                 <h3>{exam.name}</h3>
                 
                 <div className={styles.dateRow}>
                   <CalendarIcon size={16} className={styles.calendarIcon} />
                   <span>{exam.date}</span>
                 </div>
                 
                 <div className={styles.statusBadge} data-status={exam.status}>
                   {exam.status}
                 </div>
               </div>

               <div className={styles.actionRow}>
                 <button className={`btn btn-secondary ${styles.actionBtn}`}>
                   Exam Details
                 </button>
                 <a href="#" className={`btn btn-primary ${styles.actionBtn}`}>
                   Official Site <ExternalLink size={16} />
                 </a>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default ExamsHub;
