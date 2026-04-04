import { useState } from "react";
import { X, Check } from "lucide-react";
import PaymentModal from "./PaymentModal";
// CSS injected directly into the component

const BookingModal = ({ mentor, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    bookingName: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please login to book a session.");
      return;
    }
    setShowPayment(true);
  };

  const handleFinalBooking = async () => {
    setIsSubmitting(true);
    const storedUser = localStorage.getItem("user");
    const { token } = JSON.parse(storedUser);
    
    // Create a date-time string for the backend
    const schedule = new Date(`${formData.date}T${formData.time}`);

    try {
      const response = await fetch("http://localhost:5000/api/mentors/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId: mentor._id,
          sessionType: mentor.type || "live",
          schedule: schedule.toISOString(),
          topic: formData.bookingName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        if (onRefresh) onRefresh();
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        alert(data.message || "Failed to book session. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
      setShowPayment(false);
    }
  };

  const modalStyles = `
    .booking-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    .booking-modal-container {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      transform: translateY(0);
      animation: slideUp 0.3s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .booking-modal-success-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
    }
    .booking-modal-success-icon-wrapper {
      width: 80px;
      height: 80px;
      background: var(--success-green);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .booking-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .booking-modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--deep-navy);
    }
    .booking-modal-closeButton {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .booking-modal-closeButton:hover {
      background-color: var(--border-color);
      color: var(--text-primary);
    }
    .booking-modal-formGroup {
      margin-bottom: 1rem;
    }
    .booking-modal-formGroup label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    .booking-modal-formGroup input,
    .booking-modal-ampmSelect {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--soft-grey);
      color: var(--text-primary);
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .booking-modal-formGroup input:focus,
    .booking-modal-ampmSelect:focus {
      outline: none;
      border-color: var(--vibrant-blue);
    }
    .booking-modal-ampmSelect {
      width: auto;
      cursor: pointer;
      appearance: none;
      padding-right: 1rem;
    }
    .booking-modal-formRow {
      display: flex;
      gap: 1rem;
    }
    .booking-modal-formRow .booking-modal-formGroup {
      flex: 1;
    }
    .booking-modal-submitButton {
      width: 100%;
      padding: 1rem;
      margin-top: 1rem;
      font-size: 1.1rem;
    }
  `;

  return (
    <>
      <style>{modalStyles}</style>
      <div className="booking-modal-backdrop modal-backdrop-animate" onClick={onClose}>
        <div className="booking-modal-container modal-content-animate" onClick={(e) => e.stopPropagation()}>
          {!showSuccess ? (
            <>
              <div
                className="booking-modal-header"
                style={{ justifyContent: "center", position: "relative" }}
              >
                <h2 style={{ textAlign: "center" }}>
                  Book a Session with {mentor.name}
                </h2>
                <button
                  className="booking-modal-closeButton"
                  onClick={onClose}
                  aria-label="Close"
                  style={{ position: "absolute", right: 0 }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="booking-modal-formGroup">
                  <label htmlFor="bookingName" style={{ textAlign: "center" }}>
                    Booking Name / Topic
                  </label>
                  <input
                    type="text"
                    id="bookingName"
                    name="bookingName"
                    value={formData.bookingName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Mock Interview, Career Advice"
                    style={{ textAlign: "center" }}
                  />
                </div>

                <div className="booking-modal-formRow">
                  <div className="booking-modal-formGroup">
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
                  <div className="booking-modal-formGroup">
                    <label htmlFor="time">Time</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary booking-modal-submitButton`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>
              </form>
            </>
          ) : (
            <div className="booking-modal-success-content modal-content-animate">
              <div className="booking-modal-success-icon-wrapper success-icon-animate pulse-animate">
                <Check size={40} />
              </div>
              <h2 style={{ color: "var(--deep-navy)", marginBottom: "0.5rem" }}>Registration Successful!</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                You have successfully booked a session with {mentor.name}.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: "100%" }}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={mentor.price || "₹2,500"}
        itemTitle={`Session with ${mentor.name}`}
        onItemSelect={handleFinalBooking}
      />
    </>
  );
};

export default BookingModal;
