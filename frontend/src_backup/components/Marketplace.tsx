import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Video, Star, Award } from 'lucide-react';
import styles from './Marketplace.module.css';
import BookingModal from './BookingModal';

const MOCK_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Tech Industry Senior Guide",
    company: "Google",
    type: "live",
    rating: 4.9,
    reviews: 128,
    isTopRated: true,
    image: "/mentor-sarah.png",
    tags: ["Software Engineering", "PM", "Interview Prep"]
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Career Counsellor",
    company: "CareerPath Academy",
    type: "offline",
    location: "Downtown Center",
    rating: 4.8,
    reviews: 94,
    isTopRated: false,
    image: "/mentor-james.png",
    tags: ["High School Planning", "College Essays"]
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Design Lead",
    company: "Creative Studio",
    type: "live",
    rating: 5.0,
    reviews: 215,
    isTopRated: true,
    image: "/mentor-elena.png",
    tags: ["UX/UI Design", "Portfolio Review"]
  },
  {
    id: 4,
    name: "Arjun Patel",
    role: "Finance & Strategy Mentor",
    company: "Global Ventures",
    type: "live",
    rating: 4.9,
    reviews: 180,
    isTopRated: false,
    image: "/mentor-arjun.png",
    tags: ["Investment Banking", "Startups", "MBA Prep"]
  },
  {
    id: 5,
    name: "Dr. Marcus Johnson",
    role: "Tech Leadership Coach",
    company: "Innovate Inc.",
    type: "offline",
    location: "Innovation Hub",
    rating: 4.9,
    reviews: 302,
    isTopRated: true,
    image: "/mentor-marcus.png",
    tags: ["Tech Leadership", "Career Pivot"]
  },
  {
    id: 6,
    name: "Dr. Emily Carter",
    role: "Executive Career Coach",
    company: "Carter Consulting",
    type: "live",
    rating: 5.0,
    reviews: 450,
    isTopRated: true,
    image: "/mentor-emily.png",
    tags: ["Executive Coaching", "Negotiation", "Resume Writing"]
  },
  {
    id: 7,
    name: "David Wright",
    role: "Startup Mentor",
    company: "Wright Ventures",
    type: "live",
    rating: 4.8,
    reviews: 88,
    isTopRated: false,
    image: "/mentor-david.png",
    tags: ["Entrepreneurship", "Pitching", "Growth"]
  },
  {
    id: 8,
    name: "Priya Sharma",
    role: "Senior Staff Engineer",
    company: "Cloud Systems Inc.",
    type: "live",
    rating: 4.9,
    reviews: 154,
    isTopRated: true,
    image: "/mentor-priya.png",
    tags: ["Software Engineering", "System Design", "Cloud"]
  },
  {
    id: 9,
    name: "Michael Thompson",
    role: "VP of Operations",
    company: "Global Logistics",
    type: "offline",
    location: "Metro Business Center",
    rating: 4.7,
    reviews: 62,
    isTopRated: false,
    image: "/mentor-michael.png",
    tags: ["Operations", "Supply Chain", "Leadership"]
  },
  {
    id: 10,
    name: "Sophia Lin",
    role: "Brand Strategy Director",
    company: "Creative Collective",
    type: "live",
    rating: 5.0,
    reviews: 210,
    isTopRated: true,
    image: "/mentor-sophia.png",
    tags: ["Marketing", "Brand Strategy", "Advertising"]
  },
  {
    id: 11,
    name: "Robert Hughes",
    role: "Dean of Admissions",
    company: "Ivy League Prep",
    type: "offline",
    location: "University Campus Office",
    rating: 4.9,
    reviews: 340,
    isTopRated: true,
    image: "/mentor-robert.png",
    tags: ["College Admissions", "Ivy League", "Essays"]
  },
  {
    id: 12,
    name: "Olivia Martinez",
    role: "Director of Product",
    company: "Fintech Solutions",
    type: "live",
    rating: 4.8,
    reviews: 112,
    isTopRated: false,
    image: "/mentor-olivia.png",
    tags: ["Product Management", "Agile", "Roadmapping"]
  },
  {
    id: 13,
    name: "Wei Chen",
    role: "Blockchain Architect",
    company: "Decentralized Corp",
    type: "live",
    rating: 4.9,
    reviews: 145,
    isTopRated: true,
    image: "/mentor-chen.png",
    tags: ["Fintech", "Blockchain", "Web3"]
  },
  {
    id: 14,
    name: "Fatima Al-Fayed",
    role: "Lead Data Scientist",
    company: "AI Innovations",
    type: "live",
    rating: 4.9,
    reviews: 198,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_fatima",
    tags: ["Data Science", "Machine Learning", "Python"]
  },
  {
    id: 15,
    name: "William Vance",
    role: "Frontend Tech Lead",
    company: "WebWorks Studio",
    type: "offline",
    location: "Downtown Tech Hub",
    rating: 4.6,
    reviews: 55,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_william",
    tags: ["React", "CSS", "Junior Dev Coaching"]
  },
  {
    id: 16,
    name: "Amanda Brooks",
    role: "Principal UX Researcher",
    company: "UserFirst Design",
    type: "live",
    rating: 4.8,
    reviews: 167,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_amanda",
    tags: ["UX Research", "Usability Testing", "Psychology"]
  }
];
const Marketplace = () => {
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  
  // Initialize from location state directly, avoiding useEffect setState warnings
  const [categoryFilter, setCategoryFilter] = useState<string | null>(() => {
    if (location.state && location.state.categoryFilter) {
      // Clear history state immediately so it doesn't stick on reload
      window.history.replaceState({}, document.title);
      return location.state.categoryFilter;
    }
    return null;
  });

  const [bookingMentor, setBookingMentor] = useState<{ id: number; name: string; type: string } | null>(null);

  // Map category IDs from Explore to mentor tags
  const categoryTagMap: Record<string, string[]> = {
    'tech': ['Software Engineering', 'System Design', 'Cloud', 'React', 'CSS'],
    'health': [], // Add mock mentors later if needed
    'design': ['UX/UI Design', 'UX Research'],
    'business': ['Product Management', 'Marketing', 'Operations', 'MBA Prep'],
    'science': ['Data Science', 'Machine Learning'],
    'aerospace': [], 
    'media': ['Brand Strategy', 'Advertising']
  };

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    // 1. Filter by Live/Offline/All
    const passesType = filter === 'all' || mentor.type === filter;
    
    // 2. Filter by Category (if one was selected from Explore)
    let passesCategory = true;
    if (categoryFilter && categoryTagMap[categoryFilter]) {
      const relevantTags = categoryTagMap[categoryFilter];
      // Check if mentor has at least one tag that matches the category
      passesCategory = mentor.tags.some(tag => relevantTags.includes(tag));
    }

    return passesType && passesCategory;
  });

  return (
    <div className="page-container">
       <div className={styles.header}>
         <div>
           <h1>Find a Mentor</h1>
           <p>Connect with industry experts and certified counsellors to map your future.</p>
         </div>
         <div className={styles.filters}>
            <button 
              className={`${styles.filterButton} ${filter === 'all' && !categoryFilter ? styles.active : ''}`}
              onClick={() => {
                setFilter('all');
                setCategoryFilter(null);
              }}
            >All</button>
            <button 
              className={`${styles.filterButton} ${filter === 'live' ? styles.active : ''}`}
              onClick={() => setFilter('live')}
            >Live Online</button>
            <button 
              className={`${styles.filterButton} ${filter === 'offline' ? styles.active : ''}`}
              onClick={() => setFilter('offline')}
            >Physical Centers</button>
            
            {categoryFilter && (
               <button 
                 className={`${styles.filterButton} ${styles.clearFilter}`}
                 onClick={() => setCategoryFilter(null)}
               >
                 Clear Category
               </button>
            )}
         </div>
       </div>

       {filteredMentors.length === 0 && (
         <div className={styles.noResults}>
            <h3>No mentors found for this category yet!</h3>
            <p>Try clearing your filters or check back later.</p>
         </div>
       )}

       <div className={styles.mentorsGrid}>
         {filteredMentors.map(mentor => (
           <div key={mentor.id} className={`card ${styles.mentorCard}`}>
             {mentor.isTopRated && (
               <div className={styles.topRatedBadge}>
                 <Award size={14} /> Top Rated
               </div>
             )}
             
             <div className={styles.badgeContainer}>
               {mentor.type === 'live' ? (
                 <span className={`${styles.typeBadge} ${styles.liveBadge}`}>
                   <span className={styles.pulseDot}></span>
                   <Video size={14} /> Live
                 </span>
               ) : (
                 <span className={`${styles.typeBadge} ${styles.offlineBadge}`}>
                   <MapPin size={14} /> Center
                 </span>
               )}
             </div>

             <div className={styles.profileSection}>
               <img src={mentor.image} alt={mentor.name} className={styles.avatar} />
               <div className={styles.profileInfo}>
                 <h3>{mentor.name}</h3>
                 <p className={styles.role}>{mentor.role}</p>
                 <p className={styles.company}>{mentor.company}</p>
               </div>
             </div>

             <div className={styles.ratingSection}>
                <div className={styles.stars}>
                   <Star size={18} fill="var(--warning-orange)" color="var(--warning-orange)" />
                   <span className={styles.ratingScore}>{mentor.rating.toFixed(1)}</span>
                </div>
                <span className={styles.reviewCount}>({mentor.reviews} reviews)</span>
             </div>

             <div className={styles.tagsContainer}>
                {mentor.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
             </div>

             <div className={styles.actionSection}>
                <button 
                  className={`btn btn-primary ${styles.bookButton}`}
                  onClick={() => mentor.type === 'live' ? setBookingMentor(mentor) : null}
                >
                  {mentor.type === 'live' ? 'Book the Mentor' : 'View Schedule'}
                </button>
             </div>
           </div>
         ))}
       </div>

       {bookingMentor && (
         <BookingModal
           mentorName={bookingMentor.name}
           onClose={() => setBookingMentor(null)}
         />
       )}
    </div>
  );
};

export default Marketplace;
