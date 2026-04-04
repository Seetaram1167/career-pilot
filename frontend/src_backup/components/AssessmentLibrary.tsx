import { Link } from 'react-router-dom';
import { Compass, Book, Brain, Target, Users } from 'lucide-react';
import styles from './AssessmentLibrary.module.css';

const ASSESSMENTS = [
  {
    id: 1,
    title: "10th Grade Stream Selector",
    description: "Discover which high school stream (Science, Commerce, Arts) aligns with your innate strengths and interests.",
    time: "20 Mins",
    questions: 45,
    icon: <Book size={32} />,
    color: "var(--vibrant-blue)"
  },
  {
    id: 2,
    title: "Personality & Interests Profiler",
    description: "Map your unique personality traits to potential career environments where you'll naturally thrive.",
    time: "15 Mins",
    questions: 30,
    icon: <Brain size={32} />,
    color: "var(--warning-orange)"
  },
  {
    id: 3,
    title: "Ideal Career Matcher",
    description: "A comprehensive analysis across 8 dimensions to pinpoint your top 3 specific career targets.",
    time: "45 Mins",
    questions: 100,
    icon: <Target size={32} />,
    color: "var(--success-green)"
  },
  {
    id: 4,
    title: "Leadership & Collaboration Style",
    description: "Understand how you work in teams, vital for future management and collaborative roles.",
    time: "10 Mins",
    questions: 20,
    icon: <Users size={32} />,
    color: "var(--deep-navy)"
  }
];

const AssessmentLibrary = () => {
  return (
    <div className="page-container">
       <div className={styles.header}>
         <Compass className={styles.headerIcon} size={48} />
         <h1>Assessment Library</h1>
         <p>Scientific, student-focused quizzes to map your exact career trajectory.</p>
       </div>

       <div className={styles.libraryGrid}>
         {ASSESSMENTS.map(test => (
           <div key={test.id} className={`card ${styles.assessmentCard}`}>
             <div className={styles.iconContainer} style={{ color: test.color }}>
               {test.icon}
             </div>
             <h3>{test.title}</h3>
             <p className={styles.description}>{test.description}</p>
             
             <div className={styles.metaInfo}>
               <span className={styles.tag}>{test.questions} Questions</span>
               <span className={styles.tag}>{test.time}</span>
             </div>

             <div className={styles.actions}>
               <Link to={`/quiz/${test.id}`} className={`btn btn-primary ${styles.startBtn}`}>
                 Start Assessment
               </Link>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default AssessmentLibrary;
