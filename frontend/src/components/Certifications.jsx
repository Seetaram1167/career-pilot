import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, PlayCircle, CheckCircle2, Star } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { syncUserProfile } from "../utils/authUtils";
import proCounsellorImg from "../assets/certifications/pro_counsellor.png";
import schoolGuidingImg from "../assets/certifications/school_guiding.png";
import studyAbroadImg from "../assets/certifications/study_abroad.png";

const CERT_COURSES = [
  {
    id: 1,
    title: "Become a Pro Counsellor Pipeline",
    modules: "8 Course Bundle",
    price: "₹27,000",
    originalPrice: "₹50,500",
    image: proCounsellorImg,
    color: "#4F46E5",
    description:
      "Master the art of student coaching and psychology to build a rewarding independent practice.",
  },
  {
    id: 2,
    title: "Guiding School Students (10th & 12th)",
    modules: "16 Modules",
    price: "₹10,000",
    originalPrice: "₹15,000",
    image: schoolGuidingImg,
    color: "#06B6D4",
    description:
      "Learn precisely how to analyze streams and map teenagers to their ideal early career paths.",
  },
  {
    id: 3,
    title: "Study Abroad Admission Guidance",
    modules: "Bundle of 6 Hours",
    price: "₹10,000",
    originalPrice: "₹30,000",
    image: studyAbroadImg,
    color: "#8B5CF6",
    description:
      "The complete blueprint for guiding applications, essays, and visas for international universities.",
  },
  {
    id: 4,
    title: "Personal Branding & Sales for Coaches",
    modules: "10 Modules",
    price: "₹5,000",
    originalPrice: "",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    color: "#059669",
    description:
      "Get the exact sales blueprint and digital marketing strategies used by elite Career Counselors.",
  },
];

const Certifications = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    syncUserProfile();
    
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isEnrolled = (title) => {
    if (!user?.purchases) return false;
    return user.purchases.some(p => {
      const pItem = String(p.item || "").toLowerCase().trim();
      const tItem = String(title || "").toLowerCase().trim();
      return pItem === tItem || pItem.includes(tItem) || tItem.includes(pItem);
    });
  };
  const certStyles = `
    .cert-heroSection {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-3xl) var(--spacing-lg);
      background: linear-gradient(135deg, rgba(8, 20, 48, 0.96) 0%, rgba(17, 24, 39, 0.92) 100%), 
                  url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      border-radius: var(--radius-2xl);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .cert-heroSection h1 {
      color: #FFFFFF !important;
      margin-bottom: var(--spacing-md);
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.05em;
    }

    .cert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: var(--spacing-2xl);
      padding: var(--spacing-md) 0;
    }

    .cert-courseCard {
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      height: 100%;
    }
    .cert-courseCard:hover {
      transform: translateY(-16px);
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
      border-color: var(--vibrant-blue);
    }

    .cert-imageWrapper {
      width: 100%;
      height: 220px;
      position: relative;
      overflow: hidden;
      background: #081430;
    }

    .cert-courseImage {
      width: 100%;
      height: 100%;
      object-fit: cover; /* CHANGED: To fill rectangle as requested */
      transition: transform 0.8s ease;
    }
    .cert-courseCard:hover .cert-courseImage {
      transform: scale(1.1);
    }

    .cert-imageWrapper::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, transparent 50%, rgba(8, 20, 48, 0.8) 100%);
    }

    .cert-cardContent {
      padding: var(--spacing-xl);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      position: relative;
      z-index: 2;
    }

    .cert-cardHeader h3 {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--deep-navy);
      margin-bottom: var(--spacing-sm);
      line-height: 1.3;
    }
    .cert-description {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
      line-height: 1.6;
    }

    .cert-metaRow {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .cert-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--soft-grey);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cert-pricingRow {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }
    .cert-price {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .cert-originalPrice {
      font-size: 1rem;
      color: var(--text-secondary);
      text-decoration: line-through;
      font-weight: 500;
      opacity: 0.6;
    }
    .cert-viewBtn {
      width: 100%;
      padding: 16px;
      font-size: 1rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      border-radius: 14px;
      transition: all 0.3s ease;
    }
    .cert-courseCard:hover .cert-viewBtn {
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .cert-purchasedBadge {
      position: absolute;
      top: 40px;
      right: 24px;
      background: var(--success-green);
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: var(--radius-full);
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `;

  return (
    <>
      <style>{certStyles}</style>
      <div className="page-container">
        <div className="cert-heroSection">
          <h1>Professional Certifications</h1>
          <p>
            Upskill yourself with industry-recognized programs and start your
            own profitable coaching practice.
          </p>
        </div>

        <div className="cert-grid">
          {CERT_COURSES.map((course) => (
            <div key={course.id} className="cert-courseCard">
              {isEnrolled(course.title) && (
                <div className="cert-purchasedBadge">
                  <CheckCircle2 size={16} /> Enrolled
                </div>
              )}
              <div className="cert-imageWrapper">
                <img src={course.image} alt={course.title} className="cert-courseImage" />
              </div>
              <div className="cert-cardContent">
                <div className="cert-cardHeader">
                  <h3>{course.title}</h3>
                </div>

                <p className="cert-description">{course.description}</p>

                <div className="cert-metaRow">
                  <span className="cert-tag">
                    <BookOpen size={14} /> {course.modules}
                  </span>
                  <span className="cert-tag">
                    <Clock size={14} /> Self Paced
                  </span>
                </div>

                <div className="cert-pricingRow">
                  {!isEnrolled(course.title) ? (
                    <>
                      <span className="cert-price">{course.price}</span>
                      {course.originalPrice && (
                        <span className="cert-originalPrice">
                          {course.originalPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="cert-price" style={{ color: '#10b981', fontSize: '1.2rem' }}>
                      <CheckCircle2 size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Enrolled
                    </span>
                  )}
                </div>

                <button 
                  className={`btn btn-primary cert-viewBtn`}
                  style={{ backgroundColor: course.color, borderColor: course.color, color: '#FFFFFF' }}
                  onClick={() => {
                    if (isEnrolled(course.title)) {
                      navigate(`/course/${course.id}`);
                    } else {
                      setPaymentData({ title: course.title, price: course.price });
                    }
                  }}
                >
                  <PlayCircle size={20} /> 
                  {isEnrolled(course.title) ? "Continue Learning" : "Enroll Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <PaymentModal 
          isOpen={!!paymentData}
          onClose={() => setPaymentData(null)}
          amount={paymentData?.price}
          itemTitle={paymentData?.title}
          onItemSelect={() => {
            console.log("Enrolled in", paymentData?.title);
          }}
        />
      </div>
    </>
  );
};

export default Certifications;
