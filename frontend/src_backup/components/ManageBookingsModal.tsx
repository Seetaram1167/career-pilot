import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import styles from './ManageBookingsModal.module.css';

interface Booking {
  id: string;
  topic: string;
  mentorName: string;
  mentorRole: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past';
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    topic: 'Career Guidance',
    mentorName: 'Dr. Sarah Chen',
    mentorRole: 'Tech Industry Guide',
    date: '2026-03-14',
    time: '11:30',
    status: 'upcoming'
  },
  {
    id: 'b2',
    topic: 'Resume Review',
    mentorName: 'Arjun Patel',
    mentorRole: 'Finance Mentor',
    date: '2026-02-10',
    time: '14:00',
    status: 'past'
  }
];

interface ManageBookingsModalProps {
  onClose: () => void;
}

const ManageBookingsModal = ({ onClose }: ManageBookingsModalProps) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'past');

  const handleRescheduleSubmit = (id: string) => {
    if (!newDate || !newTime) {
      alert('Please select both a new date and time.');
      return;
    }
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, date: newDate, time: newTime } : b)
    );
    setReschedulingId(null);
    setNewDate('');
    setNewTime('');
    alert('Booking rescheduled successfully!');
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Manage Bookings</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className={styles.section}>
          <h3>Upcoming Bookings</h3>
          {upcomingBookings.length === 0 ? (
            <p className={styles.mentorInfo}>No upcoming bookings.</p>
          ) : (
            <div className={styles.bookingList}>
              {upcomingBookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <div>
                      <div className={styles.title}>{booking.topic}</div>
                      <div className={styles.mentorInfo}>
                        {booking.mentorName} • {booking.mentorRole}
                      </div>
                    </div>
                    <div className={styles.timeTag}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {booking.date} at {booking.time}
                    </div>
                  </div>
                  
                  {reschedulingId === booking.id ? (
                    <div className={styles.rescheduleForm}>
                      <input 
                        type="date" 
                        className={styles.dateInput}
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)} 
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <input 
                        type="time" 
                        className={styles.timeInput}
                        value={newTime} 
                        onChange={(e) => setNewTime(e.target.value)} 
                      />
                      <div className={styles.actions}>
                        <button className={styles.confirmBtn} onClick={() => handleRescheduleSubmit(booking.id)}>
                          Confirm
                        </button>
                        <button className={styles.cancelBtn} onClick={() => setReschedulingId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.actions}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        onClick={() => setReschedulingId(booking.id)}
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3>Past Bookings</h3>
          {pastBookings.length === 0 ? (
            <p className={styles.mentorInfo}>No past bookings.</p>
          ) : (
            <div className={styles.bookingList}>
              {pastBookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard} style={{ opacity: 0.7 }}>
                  <div className={styles.bookingHeader}>
                    <div>
                      <div className={styles.title}>{booking.topic}</div>
                      <div className={styles.mentorInfo}>
                        {booking.mentorName} • {booking.mentorRole}
                      </div>
                    </div>
                    <div className={styles.timeTag} style={{ background: '#f5f5f5', color: '#666' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {booking.date} at {booking.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookingsModal;
