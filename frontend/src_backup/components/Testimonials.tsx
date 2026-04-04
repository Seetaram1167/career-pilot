import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Class 12th Student",
    image: "https://i.pravatar.cc/150?u=priya",
    text: "The CareerPilot Ideal Match assessment was eye-opening. With my mentor's help, I discovered my perfect fit in UX Design instead of traditional engineering."
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Parent of 10th Grader",
    image: "https://i.pravatar.cc/150?u=rahul",
    text: "Booking a 1-on-1 session simplified the stream selection process for our son. The psychometric report provided immense clarity."
  },
  {
    id: 3,
    name: "Dr. Ananya Gupta",
    role: "Certified Counsellor",
    image: "https://i.pravatar.cc/150?u=ananya",
    text: "The Pro Coaching Certification completely revamped my independent practice. The branding blueprint module was worth it alone."
  }
];

const Testimonials = () => {
  return (
    <div className={styles.testimonialSection}>
       <div className={styles.header}>
         <h2>Trusted by Millions</h2>
         <p>See how CareerPilot has transformed careers and simplified major decisions.</p>
       </div>

       <div className={styles.testimonialGrid}>
         {TESTIMONIALS.map(item => (
           <div key={item.id} className={`card ${styles.testimonialCard}`}>
             <Quote className={styles.quoteIcon} size={32} />
             
             <div className={styles.stars}>
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={16} fill="var(--vibrant-blue)" className={styles.starIcon} />
               ))}
             </div>
             
             <p className={styles.text}>"{item.text}"</p>
             
             <div className={styles.profileRow}>
               <img src={item.image} alt={item.name} className={styles.avatar} />
               <div>
                 <h4>{item.name}</h4>
                 <span className={styles.role}>{item.role}</span>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default Testimonials;
