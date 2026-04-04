import { 
  CheckCircle, 
  Circle, 
  Trophy, 
  BookOpen, 
  Target,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import ManageBookingsModal from './ManageBookingsModal';

const MOCK_ROADMAP = [
  { id: 1, title: 'Complete Career Assessment', status: 'completed', description: 'Discover your strengths and ideal work environments.', date: 'Mar 1, 2026' },
  { id: 2, title: 'Analyze Top 3 Career Matches', status: 'completed', description: 'Review detailed insights on matching career paths.', date: 'Mar 3, 2026' },
  { id: 3, title: 'Book First Mentor Session', status: 'active', description: 'Connect with a live mentor to discuss your goals.', date: 'Pending' },
  { id: 4, title: 'Draft College/Career Plan', status: 'locked', description: 'Create a semester-by-semester action plan.', date: 'Locked' },
];

const Dashboard = () => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  return (
    <div className={`page-container ${styles.dashboardLayout}`}>
      
      {/* Sidebar Section */}
      <aside className={styles.sidebar}>
         <div className={`card ${styles.profileCard}`}>
            <div className={styles.headerRow}>
               <img src="https://i.pravatar.cc/150?img=11" alt="Student" className={styles.avatar} />
               <div>
                  <h3 className={styles.userName}>Alex Johnson</h3>
                  <p className={styles.gradeText}>10th Grade</p>
               </div>
            </div>
            
            <div className={styles.statsRow}>
               <div className={styles.statBox}>
                  <BookOpen size={20} className={styles.iconBlue} />
                  <span className={styles.statValue}>2</span>
                  <span className={styles.statLabel}>Sessions</span>
               </div>
               <div className={styles.statBox}>
                  <Trophy size={20} className={styles.iconOrange} />
                  <span className={styles.statValue}>750</span>
                  <span className={styles.statLabel}>Points</span>
               </div>
            </div>
         </div>

         <div className={`card ${styles.upcomingCard}`}>
            <h4 className={styles.cardTitle}>Upcoming Schedule</h4>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleDate}>
                 <span className={styles.day}>14</span>
                 <span className={styles.month}>Mar</span>
              </div>
              <div className={styles.scheduleDetails}>
                 <h5>Dr. Sarah Chen</h5>
                 <p>Tech Industry Guide</p>
                 <span className={styles.timeTag}>11:30 AM (Live)</span>
              </div>
            </div>
            <button 
              className={`btn btn-secondary ${styles.fullWidthBtn}`}
              onClick={() => setIsManageModalOpen(true)}
            >
               Manage Bookings
            </button>
         </div>
      </aside>

      {/* Main Content Section */}
      <div className={styles.mainContent}>
         <div className={styles.welcomeSection}>
            <div className={styles.welcomeText}>
               <h1>Welcome back, Alex!</h1>
               <p>You're making great progress on your career journey.</p>
            </div>
            <Link to="/quiz" className={`btn btn-primary ${styles.actionBtn}`}>
               Retake Assessment
            </Link>
         </div>

         <div className={`card ${styles.roadmapCard}`}>
            <div className={styles.roadmapHeader}>
               <div className={styles.roadmapTitleGroup}>
                  <Target size={28} className={styles.iconBlue} />
                  <h2>Your Career Roadmap</h2>
               </div>
               <div className={styles.progressTracker}>
                  <span>50% Completed</span>
                  <div className={styles.progressBar}>
                     <div className={styles.progressFill} style={{ width: '50%' }}></div>
                  </div>
               </div>
            </div>

            <div className={styles.timeline}>
               {MOCK_ROADMAP.map((item, index) => (
                 <div key={item.id} className={`${styles.timelineItem} ${styles[item.status]}`}>
                    <div className={styles.timelineConnector}>
                       {item.status === 'completed' && <CheckCircle size={24} className={styles.statusIcon} />}
                       {item.status === 'active' && <Circle size={24} className={styles.statusIcon} />}
                       {item.status === 'locked' && <Circle size={24} className={styles.statusIconLocked} />}
                       {index < MOCK_ROADMAP.length - 1 && <div className={styles.line}></div>}
                    </div>
                    
                    <div className={styles.timelineContent}>
                       <div className={styles.timelineContentHeader}>
                          <h3>{item.title}</h3>
                          <span className={styles.dateTag}>{item.date}</span>
                       </div>
                       <p>{item.description}</p>
                       
                       {item.status === 'active' && (
                          <Link to="/mentors" className={`btn btn-primary ${styles.timelineActionBtn}`}>
                             Find a Mentor <ChevronRight size={16} />
                          </Link>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className={styles.insightsSection}>
            <div className={styles.sectionHeader}>
              <TrendingUp size={24} className={styles.iconBlue} />
              <h2>Career Insights & Trends</h2>
            </div>
            
            <div className={styles.articlesGrid}>
               <a href="#" className={`card ${styles.articleCard}`}>
                 <div className={styles.articleBadge}>Trend</div>
                 <h4>Why Data Analyst is a Top Career Pick?</h4>
                 <p>Explore the explosive growth of analytics roles across industries.</p>
                 <span className={styles.readMore}>Read Article <ExternalLink size={14} /></span>
               </a>
               
               <a href="#" className={`card ${styles.articleCard}`}>
                 <div className={styles.articleBadge}>Guide</div>
                 <h4>Is Becoming A Doctor Worth It?</h4>
                 <p>A sober look at this tough but highly rewarding medical profession.</p>
                 <span className={styles.readMore}>Read Article <ExternalLink size={14} /></span>
               </a>
               
               <a href="#" className={`card ${styles.articleCard}`}>
                 <div className={styles.articleBadge}>Advice</div>
                 <h4>From Boring To Memorable: AI Training</h4>
                 <p>How the workforce is adapting to artificial intelligence integration.</p>
                 <span className={styles.readMore}>Read Article <ExternalLink size={14} /></span>
               </a>
            </div>
          </div>
       </div>

       {isManageModalOpen && (
         <ManageBookingsModal onClose={() => setIsManageModalOpen(false)} />
       )}
    </div>
  );
};

export default Dashboard;
