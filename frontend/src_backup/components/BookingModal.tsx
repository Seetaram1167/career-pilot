import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  mentorName: string;
  onClose: () => void;
}

const BookingModal = ({ mentorName, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    bookingName: '',
    studentName: '',
    email: '',
    contactNumber: '',
    date: '',
    time: '',
    ampm: 'AM'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTime = `${formData.time} ${formData.ampm}`;
    console.log('Booking details:', { ...formData, time: formattedTime });
    alert(`Booking "${formData.bookingName}" confirmed with ${mentorName} on ${formData.date} at ${formattedTime}!`);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header} style={{ justifyContent: 'center', position: 'relative' }}>
          <h2 style={{ textAlign: 'center' }}>Book a Session with {mentorName}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 0 }}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="bookingName" style={{ textAlign: 'center' }}>Booking Name / Topic</label>
            <input 
              type="text" 
              id="bookingName" 
              name="bookingName" 
              value={formData.bookingName} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Mock Interview, Career Advice"
              style={{ textAlign: 'center' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="studentName">Student Name</label>
            <input 
              type="text" 
              id="studentName" 
              name="studentName" 
              value={formData.studentName} 
              onChange={handleChange} 
              required 
              placeholder="Full Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="student@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contactNumber">Contact Number</label>
            <input 
              type="tel" 
              id="contactNumber" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange} 
              required 
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="time">Time</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="time" 
                  id="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  required 
                  style={{ flex: 1 }}
                />
                <select 
                  name="ampm" 
                  value={formData.ampm} 
                  onChange={handleChange}
                  className={styles.ampmSelect}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitButton}`}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
