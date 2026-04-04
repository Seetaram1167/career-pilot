import { 
  MonitorSmartphone, 
  Stethoscope, 
  Palette, 
  Briefcase, 
  Microscope, 
  Rocket, 
  Video 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Explore.module.css';

const CATEGORIES = [
  { id: 'tech', name: 'Engineering & Tech', icon: <MonitorSmartphone size={32} />, color: '#06B6D4', count: '124 Mentors' },
  { id: 'health', name: 'Healthcare & Medicine', icon: <Stethoscope size={32} />, color: '#10B981', count: '89 Mentors' },
  { id: 'design', name: 'Design & Arts', icon: <Palette size={32} />, color: '#F59E0B', count: '156 Mentors' },
  { id: 'business', name: 'Management & Marketing', icon: <Briefcase size={32} />, color: '#312E81', count: '210 Mentors' },
  { id: 'science', name: 'Science & Research', icon: <Microscope size={32} />, color: '#8B5CF6', count: '45 Mentors' },
  { id: 'aerospace', name: 'Aerospace & Aviation', icon: <Rocket size={32} />, color: '#EF4444', count: '32 Mentors' },
  { id: 'media', name: 'Media & Entertainment', icon: <Video size={32} />, color: '#EC4899', count: '98 Mentors' },
];

const Explore = () => {
  return (
    <div className="page-container">
       <div className={styles.heroSection}>
          <h1>Explore Top Career Categories</h1>
          <p>Dive deep into various industries, understand the requirements, and connect with professionals in the field.</p>
       </div>

       <div className={styles.categoriesGrid}>
          {CATEGORIES.map(category => (
            <Link 
              to="/mentors" 
              state={{ categoryFilter: category.id }} 
              key={category.id} 
              className={`card ${styles.categoryCard}`}
            >
               <div 
                 className={styles.iconWrapper} 
                 style={{ backgroundColor: `${category.color}15`, color: category.color }}
               >
                  {category.icon}
               </div>
               <h3>{category.name}</h3>
               <p className={styles.mentorCount}>{category.count}</p>
            </Link>
          ))}
       </div>
    </div>
  );
};

export default Explore;
