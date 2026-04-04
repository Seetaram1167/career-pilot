import { useState } from "react";
import { X, Calendar, Check, Trash2 } from "lucide-react";
import styles from "./ManageBookingsModal.module.css";

const ManageBookingsModal = ({ bookings = [], onClose, onRefresh }) => {
  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.sessionId?.schedule) > now);
  const pastBookings = bookings.filter((b) => new Date(b.sessionId?.schedule) <= now);

  const [reschedulingId, setReschedulingId] = useState(null);
  const [confirmingCancelId, setConfirmingCancelId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState("rescheduled"); // "rescheduled", "cancelled", or "deleted"

  const handleReschedule = async (bookingId) => {
    if (!newDate || !newTime) {
      alert("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      const newSchedule = new Date(`${newDate}T${newTime}`);
      
      const response = await fetch(`http://localhost:5000/api/mentors/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedule: newSchedule }),
      });

      if (response.ok) {
        setReschedulingId(null);
        setSuccessType("rescheduled");
        setShowSuccess(true);
        if (onRefresh) onRefresh();
        // Auto-close after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reschedule booking");
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const response = await fetch(`http://localhost:5000/api/mentors/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setConfirmingCancelId(null);
        setSuccessType("cancelled");
        setShowSuccess(true);
        if (onRefresh) onRefresh();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (bookingId) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const response = await fetch(`http://localhost:5000/api/mentors/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessType("deleted");
        setShowSuccess(true);
        if (onRefresh) onRefresh();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete from history");
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.backdrop} modal-backdrop-animate`} onClick={onClose}>
      <div className={`${styles.modal} modal-content-animate`} onClick={(e) => e.stopPropagation()}>
        {!showSuccess ? (
          <>
            <div className={styles.header}>
              <h2>Manage Bookings</h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.section}>
              <h3>Upcoming Bookings</h3>
              {upcomingBookings.length === 0 ? (
                <p className={styles.mentorInfo}>No upcoming bookings.</p>
              ) : (
                <div className={styles.bookingList}>
                  {upcomingBookings.map((booking) => {
                    const date = new Date(booking.sessionId?.schedule);
                    const isRescheduling = reschedulingId === booking._id;
                    const isConfirmingCancel = confirmingCancelId === booking._id;

                    return (
                      <div key={booking._id} className={styles.bookingCard}>
                        <div className={styles.bookingHeader}>
                          <div>
                            <div className={styles.title}>{booking.topic}</div>
                            <div className={styles.mentorInfo}>
                              {booking.sessionId?.mentorId?.name} • {booking.sessionId?.mentorId?.specialization}
                            </div>
                          </div>
                          <div className={styles.timeTag}>
                            <Calendar
                              size={14}
                              style={{
                                display: "inline",
                                marginRight: "4px",
                                verticalAlign: "middle",
                              }}
                            />
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {!isRescheduling && !isConfirmingCancel ? (
                          <div className={styles.actions}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                              onClick={() => setReschedulingId(booking._id)}
                            >
                              Reschedule
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', color: '#ff4444', borderColor: '#ff4444' }}
                              onClick={() => setConfirmingCancelId(booking._id)}
                            >
                              Cancel Booking
                            </button>
                          </div>
                        ) : isRescheduling ? (
                          <div className={styles.rescheduleForm}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            </div>
                            <div className={styles.actions}>
                              <button 
                                className={styles.confirmBtn}
                                onClick={() => handleReschedule(booking._id)}
                                disabled={loading}
                              >
                                {loading ? "Saving..." : "Confirm"}
                              </button>
                              <button 
                                className={styles.cancelBtn}
                                onClick={() => setReschedulingId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`${styles.rescheduleForm} modal-content-animate`} style={{ borderTop: '1px solid var(--warning-orange)' }}>
                             <p style={{ color: 'var(--warning-orange)', fontWeight: '600', marginBottom: '0.5rem' }}>Are you sure you want to cancel this booking?</p>
                             <div className={styles.actions}>
                               <button 
                                 className="btn btn-primary" 
                                 style={{ backgroundColor: '#ff4444', color: 'white' }}
                                 onClick={() => handleCancel(booking._id)}
                                 disabled={loading}
                               >
                                 {loading ? "Cancelling..." : "Yes, Cancel Session"}
                               </button>
                               <button 
                                 className={styles.cancelBtn}
                                 onClick={() => setConfirmingCancelId(null)}
                               >
                                 Go Back
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h3>Past Bookings</h3>
              {pastBookings.length === 0 ? (
                <p className={styles.mentorInfo}>No past bookings.</p>
              ) : (
                <div className={styles.bookingList}>
                  {pastBookings.map((booking) => {
                    const date = new Date(booking.sessionId?.schedule);
                    return (
                      <div
                        key={booking._id}
                        className={styles.bookingCard}
                        style={{ opacity: 0.7, position: 'relative' }}
                      >
                        <button 
                          className={styles.closeButton}
                          style={{ position: 'absolute', top: '0', right: '0', padding: '8px', borderRadius: '0 8px 0 8px', background: 'rgba(255, 68, 68, 0.1)' }}
                          onClick={() => handleDeleteHistory(booking._id)}
                          title="Delete from history"
                        >
                          <Trash2 size={14} color="#ff4444" />
                        </button>
                        <div className={styles.bookingHeader}>
                          <div>
                            <div className={styles.title}>{booking.topic}</div>
                            <div className={styles.mentorInfo}>
                              {booking.sessionId?.mentorId?.name} • {booking.sessionId?.mentorId?.specialization}
                            </div>
                          </div>
                          <div
                            className={styles.timeTag}
                            style={{ background: "var(--white)", color: "var(--text-secondary)", opacity: 0.8 }}
                          >
                            <Calendar
                              size={14}
                              style={{
                                display: "inline",
                                marginRight: "4px",
                                verticalAlign: "middle",
                              }}
                            />
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1rem',
            textAlign: 'center'
          }} className="modal-content-animate">
            <div className="success-icon-animate pulse-animate" style={{
              width: '80px',
              height: '80px',
              background: successType === 'cancelled' ? 'var(--warning-orange)' : 'var(--success-green)',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Check size={40} />
            </div>
            <h2 style={{ color: "var(--deep-navy)", marginBottom: "0.5rem" }}>
              {successType === 'cancelled' ? "Booking Cancelled" : 
               successType === 'deleted' ? "Deleted Successfully" : "Rescheduled Successfully!"}
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              {successType === 'cancelled' ? "Your booking has been removed from your list." :
               successType === 'deleted' ? "The session has been successfully deleted from your history." :
               "Your booking has been updated to the new time."}
            </p>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              onClick={() => setShowSuccess(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingsModal;
