import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Star, Clock, CheckCircle2 } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { syncUserProfile } from "../utils/authUtils";
import streamSelectionImg from "../assets/services/stream_selection.png";
import careerMappingImg from "../assets/services/career_mapping.png";
import collegeAdmissionsImg from "../assets/services/college_admissions.png";
import professionalsPivotImg from "../assets/services/professionals_pivot.png";

const SERVICES = [
  {
    id: 1,
    title: "10th Grade Stream Selection",
    target: "Class 9th & 10th",
    image: streamSelectionImg,
    color: "#06B6D4",
    features: [
      "Psychometric Stream Test",
      "1-on-1 Guidance Session",
      "Subject Mapping Report",
    ],
    price: "₹2,499",
  },
  {
    id: 2,
    title: "12th Grade Career Mapping",
    target: "Class 11th & 12th",
    image: careerMappingImg,
    color: "#4C1D95", 
    features: [
      "Entrance Exam Strategy",
      "College Shortlisting",
      "Backup Option Planning",
    ],
    price: "₹3,999",
  },
  {
    id: 4,
    title: "College Admissions Guidance",
    target: "College Applicants",
    image: collegeAdmissionsImg,
    color: "#8B5CF6",
    features: [
      "University Selection Strategy",
      "Application & SOP Review",
      "Scholarship & Visa Guidance",
    ],
    price: "₹3,499",
  },
  {
    id: 3,
    title: "Working Professionals Pivot",
    target: "Grads & Professionals",
    image: professionalsPivotImg,
    color: "#10B981",
    features: [
      "Resume & LinkedIn Review",
      "Industry Transition Plan",
      "Mock Interview Session",
    ],
    price: "₹4,499",
  },
];

const Services = () => {
  const servicesStyles = `
    .services-heroSection {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-3xl) var(--spacing-lg);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), 
                  url('https://images.unsplash.com/photo-1521791136364-798e730bb36d?auto=format&fit=crop&q=80&w=2070');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      border-radius: var(--radius-2xl);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .services-heroSection h1 {
      color: #FFFFFF !important;
      margin-bottom: var(--spacing-md);
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.05em;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: var(--spacing-2xl);
      padding: var(--spacing-md) 0;
    }

    .services-serviceCard {
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      height: 100%;
      position: relative;
    }
    .services-serviceCard:hover {
      transform: translateY(-16px);
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
      border-color: var(--vibrant-blue);
    }

    .services-targetBadge {
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: rgba(8, 20, 48, 0.6);
      backdrop-filter: blur(8px);
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: var(--radius-full);
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.2);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .services-imageWrapper {
      width: 100%;
      height: 220px;
      position: relative;
      overflow: hidden;
      background: #081430;
    }

    .services-serviceImage {
      width: 100%;
      height: 100%;
      object-fit: cover; /* CHANGED: To fill rectangle as requested */
      transition: transform 0.8s ease;
    }
    .services-serviceCard:hover .services-serviceImage {
      transform: scale(1.1);
    }

    .services-imageWrapper::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, transparent 60%, rgba(8, 20, 48, 0.8) 100%);
    }

    .services-cardContent {
      padding: var(--spacing-xl);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      position: relative;
      z-index: 2;
    }

    .services-serviceCard h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--deep-navy);
      margin-bottom: var(--spacing-lg);
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    .services-featureList {
      list-style: none;
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
      padding: 0;
    }
    .services-featureList li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
      font-size: 0.95rem;
      color: var(--text-primary);
      font-weight: 500;
    }
    .services-featureIcon {
      color: var(--vibrant-blue);
      flex-shrink: 0;
    }

    .services-priceSection {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }
    .services-price {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .services-duration {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 700;
    }

    .services-bookBtn {
      width: 100%;
      padding: 16px;
      font-size: 1rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 14px;
      transition: all 0.3s ease;
    }
    .services-serviceCard:hover .services-bookBtn {
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .services-highlighted {
      animation: service-highlight-pulse 2s ease-in-out 3;
      border-color: var(--warning-orange) !important;
      z-index: 5;
    }
    @keyframes service-highlight-pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      50% { transform: scale(1.02); box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.2); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .services-purchasedBadge {
      position: absolute;
      top: 60px;
      right: 20px;
      background: var(--success-green);
      color: white;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 6px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      text-transform: uppercase;
    }
  `;

  const location = useLocation();
  const highlightId = location.state?.highlightId;
  const highlightRef = useRef(null);
  const [paymentData, setPaymentData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    syncUserProfile();

    // Listen for storage changes (from PaymentModal)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };

    window.addEventListener('storage', handleStorageChange);
    
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [highlightId]);

  const isPurchased = (serviceTitle) => {
    if (!user?.purchases) return false;
    return user.purchases.some(p => {
      const pItem = String(p.item || "").toLowerCase().trim();
      const tItem = String(serviceTitle || "").toLowerCase().trim();
      return pItem === tItem || pItem.includes(tItem) || tItem.includes(pItem);
    });
  };

  return (
    <>
      <style>{servicesStyles}</style>
      <div className="page-container">
        <div className="services-heroSection">
          <h1>Targeted Counselling Packages</h1>
          <p>
            Get personalized, 1-on-1 guidance from India's top career experts
            tailored exactly to your career stage.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => {
            const isHighlighted = highlightId === service.id;
            return (
              <div 
                key={service.id} 
                ref={isHighlighted ? highlightRef : null}
                className={`services-serviceCard ${isHighlighted ? 'services-highlighted' : ''}`}
              >
                <div className="services-targetBadge">{service.target}</div>
                {isPurchased(service.title) && (
                  <div className="services-purchasedBadge">
                    <CheckCircle2 size={14} /> Purchased & Active
                  </div>
                )}
                <div className="services-imageWrapper">
                  <img src={service.image} alt={service.title} className="services-serviceImage" />
                </div>

              <div className="services-cardContent">
                <h3>{service.title}</h3>

                <ul className="services-featureList">
                  {service.features.map((feature, index) => (
                    <li key={index}>
                      <Star size={16} className="services-featureIcon" /> {feature}
                    </li>
                  ))}
                </ul>

                <div className="services-priceSection">
                  <span className="services-price">{service.price}</span>
                  <span className="services-duration">
                    <Clock size={16} /> 60 Min
                  </span>
                </div>

                <button
                  className={`btn services-bookBtn ${isPurchased(service.title) ? 'btn-success' : 'btn-primary'}`}
                  style={{
                    backgroundColor: isPurchased(service.title) ? '#10b981' : service.color,
                    borderColor: isPurchased(service.title) ? '#10b981' : service.color,
                    color: '#ffffff',
                    cursor: isPurchased(service.title) ? 'default' : 'pointer'
                  }}
                  onClick={() => !isPurchased(service.title) && setPaymentData({ title: service.title, price: service.price })}
                  disabled={isPurchased(service.title)}
                >
                  {isPurchased(service.title) ? 'Purchased & Active' : 'Book Session Now'}
                </button>
              </div>
            </div>
          );
        })}
        </div>

        <PaymentModal 
          isOpen={!!paymentData}
          onClose={() => setPaymentData(null)}
          amount={paymentData?.price}
          itemTitle={paymentData?.title}
          onItemSelect={() => {
            console.log("Payment successful for", paymentData?.title);
          }}
        />
      </div>
    </>
  );
};

export default Services;
