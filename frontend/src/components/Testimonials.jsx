import { Star, Quote } from "lucide-react";
// CSS injected directly into the component

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Class 12th Student",
    image: "https://i.pravatar.cc/150?u=priya",
    text: "The CareerPilot Ideal Match assessment was eye-opening. With my mentor's help, I discovered my perfect fit in UX Design instead of traditional engineering.",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Parent of 10th Grader",
    image: "https://i.pravatar.cc/150?u=rahul",
    text: "Booking a 1-on-1 session simplified the stream selection process for our son. The psychometric report provided immense clarity.",
  },
  {
    id: 3,
    name: "Dr. Ananya Gupta",
    role: "Certified Counsellor",
    image: "https://i.pravatar.cc/150?u=ananya",
    text: "The Pro Coaching Certification completely revamped my independent practice. The branding blueprint module was worth it alone.",
  },
];

const Testimonials = () => {
  const testimonialStyles = `
    .testimonial-testimonialSection {
      margin-top: var(--spacing-2xl);
      padding: var(--spacing-2xl);
      background: linear-gradient(135deg, var(--brand-gradient-start) 0%, var(--brand-gradient-end) 100%);
      border-radius: var(--radius-lg);
      color: var(--white);
    }
    .testimonial-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }
    .testimonial-header h2 {
      color: #FFFFFF;
      font-size: 2rem;
      margin-bottom: var(--spacing-xs);
    }
    .testimonial-header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
    }
    .testimonial-testimonialGrid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-xl);
    }
    .testimonial-testimonialCard {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: var(--white);
      color: var(--text-primary);
      padding: var(--spacing-xl);
      border: none;
      border-radius: var(--radius-lg);
    }
    .testimonial-quoteIcon {
      position: absolute;
      top: 24px;
      right: 24px;
      color: var(--soft-grey);
      opacity: 0.5;
    }
    .testimonial-stars {
      display: flex;
      gap: 4px;
      margin-bottom: var(--spacing-md);
    }
    .testimonial-starIcon {
      color: var(--vibrant-blue);
    }
    .testimonial-text {
      font-size: 1rem;
      line-height: 1.6;
      font-style: italic;
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
      color: var(--text-secondary);
    }
    .testimonial-profileRow {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }
    .testimonial-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .testimonial-profileRow h4 {
      font-size: 1rem;
      color: var(--deep-navy);
      margin-bottom: 2px;
    }
    .testimonial-role {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
  `;

  return (
    <>
      <style>{testimonialStyles}</style>
      <div className="testimonial-testimonialSection">
        <div className="testimonial-header">
          <h2>Trusted by Millions</h2>
          <p>
            See how CareerPilot has transformed careers and simplified major
            decisions.
          </p>
        </div>

        <div className="testimonial-testimonialGrid">
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className={`card testimonial-testimonialCard`}>
              <Quote className="testimonial-quoteIcon" size={32} />

              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="var(--vibrant-blue)"
                    className="testimonial-starIcon"
                  />
                ))}
              </div>

              <p className="testimonial-text">"{item.text}"</p>

              <div className="testimonial-profileRow">
                <img src={item.image} alt={item.name} className="testimonial-avatar" />
                <div>
                  <h4>{item.name}</h4>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
