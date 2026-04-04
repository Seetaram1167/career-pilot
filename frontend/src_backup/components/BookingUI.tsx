import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Star, MessageSquare } from 'lucide-react';
import styles from './BookingUI.module.css';

const MOCK_DATE = new Date();
const DAYS_IN_MONTH = new Date(MOCK_DATE.getFullYear(), MOCK_DATE.getMonth() + 1, 0).getDate();
const CALENDAR_DAYS = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

const AVAILABLE_SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

const BookingUI = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(14);
  const [selectedSlot, setSelectedSlot] = useState<string | null>("11:30 AM");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  return (
    <div className="page-container">
      <div className={styles.header}>
        <h1>My Bookings</h1>
        <p>Manage your upcoming coaching sessions and provide feedback.</p>
      </div>

      <div className={styles.gridContainer}>
        {/* Booking Calendar Section */}
        <div className={`card ${styles.calendarSection}`}>
          <h2 className={styles.sectionTitle}>
            <CalendarIcon size={24} className={styles.iconBlue} /> Schedule Session
          </h2>
          
          <div className={styles.calendarHeader}>
             <h3>{MOCK_DATE.toLocaleString('default', { month: 'long' })} {MOCK_DATE.getFullYear()}</h3>
             <div className={styles.calendarNav}>
               <button className={styles.navBtn}>&lt;</button>
               <button className={styles.navBtn}>&gt;</button>
             </div>
          </div>

          <div className={styles.calendarGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className={styles.weekdayName}>{day}</div>
            ))}
            {/* Empty slots for demo alignment */}
            <div className={styles.calendarDay}></div>
            <div className={styles.calendarDay}></div>
            {CALENDAR_DAYS.map(day => (
              <button 
                key={day} 
                className={`${styles.calendarDay} ${selectedDate === day ? styles.selectedDate : ''} ${[12, 14, 18, 25].includes(day) ? styles.hasSlots : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <div className={styles.timeSlots}>
             <h4 className={styles.subTitle}><Clock size={16} /> Available Times</h4>
             <div className={styles.slotsGrid}>
                {AVAILABLE_SLOTS.map(slot => (
                   <button 
                     key={slot}
                     className={`${styles.slotBtn} ${selectedSlot === slot ? styles.selectedSlot : ''}`}
                     onClick={() => setSelectedSlot(slot)}
                   >
                     {slot}
                   </button>
                ))}
             </div>
          </div>

          <button className={`btn btn-primary ${styles.confirmBtn}`}>
             Confirm Booking
          </button>
        </div>

        {/* Feedback Section */}
        <div className={`card ${styles.feedbackSection}`}>
           <h2 className={styles.sectionTitle}>
              <MessageSquare size={24} className={styles.iconBlue} /> Mentor Feedback
           </h2>
           
           <div className={styles.pastSessionCard}>
              <img src="https://i.pravatar.cc/150?u=sarah" alt="Dr. Sarah" className={styles.mentorAvatar} />
              <div>
                <h4 className={styles.mentorName}>Dr. Sarah Chen</h4>
                <p className={styles.sessionDate}>March {MOCK_DATE.getDate() - 3}, 2026</p>
              </div>
           </div>

           <div className={styles.ratingForm}>
              <h4 className={styles.subTitle}>How was your session?</h4>
              
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                   <button
                     key={star}
                     className={styles.starBtn}
                     onMouseEnter={() => setHoverRating(star)}
                     onMouseLeave={() => setHoverRating(0)}
                     onClick={() => setRating(star)}
                   >
                     <Star 
                       size={32} 
                       fill={(hoverRating || rating) >= star ? 'var(--warning-orange)' : 'transparent'} 
                       color={(hoverRating || rating) >= star ? 'var(--warning-orange)' : 'var(--text-secondary)'} 
                       className={styles.starIcon}
                     />
                   </button>
                ))}
              </div>

              <textarea 
                className={styles.feedbackInput} 
                placeholder="Share your experience (Verified Student Testimonial)..."
                rows={4}
              ></textarea>

              <button className="btn btn-secondary">Submit Review</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingUI;
