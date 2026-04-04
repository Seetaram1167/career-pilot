import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";
// CSS injected directly into the component

const MOCK_DATE = new Date();
const DAYS_IN_MONTH = new Date(
  MOCK_DATE.getFullYear(),
  MOCK_DATE.getMonth() + 1,
  0,
).getDate();
const CALENDAR_DAYS = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

const AVAILABLE_SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

const BookingUI = () => {
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const bookingStyles = `
    .booking-header {
      margin-bottom: var(--spacing-2xl);
    }
    .booking-gridContainer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2xl);
    }
    @media (max-width: 900px) {
      .booking-gridContainer {
        grid-template-columns: 1fr;
      }
    }
    .booking-sectionTitle {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      font-size: 1.5rem;
    }
    .booking-iconBlue {
      color: var(--vibrant-blue);
    }
    .booking-calendarSection {
      background: var(--white);
    }
    .booking-calendarHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    .booking-calendarHeader h3 {
      font-size: 1.125rem;
      color: var(--deep-navy);
    }
    .booking-calendarNav {
      display: flex;
      gap: var(--spacing-sm);
    }
    .booking-navBtn {
      background: var(--soft-grey);
      border: none;
      border-radius: var(--radius-sm);
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--deep-navy);
      font-weight: bold;
    }
    .booking-navBtn:hover {
      background: var(--vibrant-blue);
      color: var(--white);
    }
    .booking-calendarGrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
    }
    .booking-weekdayName {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      margin-bottom: var(--spacing-sm);
    }
    .booking-calendarDay {
      aspect-ratio: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 50%;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--text-primary);
      font-family: var(--font-primary);
    }
    .booking-calendarDay:hover:not(:empty) {
      background: var(--soft-grey);
    }
    .booking-hasSlots {
      font-weight: 700;
      color: var(--vibrant-blue);
    }
    .booking-hasSlots::after {
      content: '';
      position: absolute;
      bottom: 4px;
      width: 4px;
      height: 4px;
      background: var(--vibrant-blue);
      border-radius: 50%;
    }
    .booking-selectedDate {
      background: var(--vibrant-blue);
      color: var(--white);
      font-weight: 700;
      box-shadow: var(--shadow-sm);
    }
    .booking-subTitle {
      font-size: 1rem;
      color: var(--deep-navy);
      margin-bottom: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }
    .booking-slotsGrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }
    .booking-slotBtn {
      padding: var(--spacing-sm);
      background: var(--white);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-family: var(--font-primary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--text-secondary);
    }
    .booking-slotBtn:hover {
      border-color: var(--vibrant-blue);
      color: var(--vibrant-blue);
    }
    .booking-selectedSlot {
      background: rgba(41, 121, 255, 0.1);
      border-color: var(--vibrant-blue);
      color: var(--vibrant-blue);
      font-weight: 600;
    }
    .booking-confirmBtn {
      width: 100%;
    }
    .booking-feedbackSection {
      display: flex;
      flex-direction: column;
    }
    .booking-pastSessionCard {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--soft-grey);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-xl);
    }
    .booking-mentorAvatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .booking-mentorName {
      font-size: 1rem;
      color: var(--deep-navy);
      margin-bottom: 2px;
    }
    .booking-sessionDate {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .booking-ratingForm {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .booking-starRating {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .booking-starBtn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: transform var(--transition-fast);
    }
    .booking-starBtn:hover {
      transform: scale(1.1);
    }
    .booking-starIcon {
      transition: fill var(--transition-fast), color var(--transition-fast);
    }
    .booking-feedbackInput {
      width: 100%;
      padding: var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-family: var(--font-primary);
      font-size: 0.875rem;
      color: var(--text-primary);
      resize: vertical;
      margin-bottom: var(--spacing-xl);
      transition: border-color var(--transition-fast);
    }
    .booking-feedbackInput:focus {
      outline: none;
      border-color: var(--vibrant-blue);
      box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.1);
    }
  `;

  return (
    <>
      <style>{bookingStyles}</style>
      <div className="page-container">
        <div className="booking-header">
          <h1>My Bookings</h1>
          <p>Manage your upcoming coaching sessions and provide feedback.</p>
        </div>

        <div className="booking-gridContainer">
          {/* Booking Calendar Section */}
          <div className="card booking-calendarSection">
            <h2 className="booking-sectionTitle">
              <CalendarIcon size={24} className="booking-iconBlue" /> Schedule
              Session
            </h2>

            <div className="booking-calendarHeader">
              <h3>
                {MOCK_DATE.toLocaleString("default", { month: "long" })}{" "}
                {MOCK_DATE.getFullYear()}
              </h3>
              <div className="booking-calendarNav">
                <button className="booking-navBtn">&lt;</button>
                <button className="booking-navBtn">&gt;</button>
              </div>
            </div>

            <div className="booking-calendarGrid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="booking-weekdayName">
                  {day}
                </div>
              ))}
              {/* Empty slots for demo alignment */}
              <div className="booking-calendarDay"></div>
              <div className="booking-calendarDay"></div>
              {CALENDAR_DAYS.map((day) => (
                <button
                  key={day}
                  className={`booking-calendarDay ${selectedDate === day ? "booking-selectedDate" : ""} ${[12, 14, 18, 25].includes(day) ? "booking-hasSlots" : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            <div>
              <h4 className="booking-subTitle">
                <Clock size={16} /> Available Times
              </h4>
              <div className="booking-slotsGrid">
                {AVAILABLE_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    className={`booking-slotBtn ${selectedSlot === slot ? "booking-selectedSlot" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary booking-confirmBtn">
              Confirm Booking
            </button>
          </div>

          {/* Feedback Section */}
          <div className="card booking-feedbackSection">
            <h2 className="booking-sectionTitle">
              <MessageSquare size={24} className="booking-iconBlue" /> Mentor
              Feedback
            </h2>

            <div className="booking-pastSessionCard">
              <img
                src="https://i.pravatar.cc/150?u=sarah"
                alt="Dr. Sarah"
                className="booking-mentorAvatar"
              />
              <div>
                <h4 className="booking-mentorName">Dr. Sarah Chen</h4>
                <p className="booking-sessionDate">
                  March {MOCK_DATE.getDate() - 3}, 2026
                </p>
              </div>
            </div>

            <div className="booking-ratingForm">
              <h4 className="booking-subTitle">How was your session?</h4>

              <div className="booking-starRating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="booking-starBtn"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      fill={
                        (hoverRating || rating) >= star
                          ? "var(--warning-orange)"
                          : "transparent"
                      }
                      color={
                        (hoverRating || rating) >= star
                          ? "var(--warning-orange)"
                          : "var(--text-secondary)"
                      }
                      className="booking-starIcon"
                    />
                  </button>
                ))}
              </div>

              <textarea
                className="booking-feedbackInput"
                placeholder="Share your experience (Verified Student Testimonial)..."
                rows={4}
              ></textarea>

              <button className="btn btn-secondary">Submit Review</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingUI;
