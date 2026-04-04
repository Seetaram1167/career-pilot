import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, Video, Star, Award } from "lucide-react";
import { API_BASE_URL } from "../apiConfig";
// CSS injected directly into the component
import BookingModal from "./BookingModal";


const Marketplace = () => {
  const location = useLocation();
  const [filter, setFilter] = useState("all");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mentors`);
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // Initialize from location state directly, avoiding useEffect setState warnings
  const [categoryFilter, setCategoryFilter] = useState(() => {
    if (location.state && location.state.categoryFilter) {
      // Clear history state immediately so it doesn't stick on reload
      window.history.replaceState({}, document.title);
      return location.state.categoryFilter;
    }
    return null;
  });

  const [bookingMentor, setBookingMentor] = useState(null);

  // Map category IDs from Explore to mentor tags and keywords
  const categoryTagMap = {
    tech: ["Software Engineering", "System Design", "Cloud", "React", "CSS", "Frontend", "Backend", "Fullstack", "Blockchain", "Web3", "PM", "Product Management", "Cybersecurity", "Data Engineering"],
    health: ["Healthcare", "Medicine", "Doctor", "Pharmacy", "Biotech"],
    design: ["UX/UI Design", "UX Research", "Graphic Design", "Portfolio Review", "Artist", "Palette"],
    business: ["Product Management", "Marketing", "Operations", "MBA Prep", "Finance", "Investment Banking", "Startups", "Business", "Entrepreneurship", "Negotiation", "Management"],
    science: ["Data Science", "Machine Learning", "Python", "Research", "Lab", "Science"],
    aerospace: ["Aerospace", "Aviation", "Pilot", "Rocket", "Space"],
    media: ["Brand Strategy", "Advertising", "Media", "Entertainment", "Video", "Creative"],
  };

  const filteredMentors = mentors.filter((mentor) => {
    // 1. Filter by Live/Offline/All
    const passesType = filter === "all" || mentor.type === filter;
    
    // 2. Filter by Category (if one was selected from Explore)
    let passesCategory = true;
    if (categoryFilter && categoryTagMap[categoryFilter]) {
      const relevantKeywords = categoryTagMap[categoryFilter].map(k => k.toLowerCase());
      
      // Check tags
      const tagMatch = mentor.tags?.some((tag) => {
        const lowerTag = tag.toLowerCase();
        return relevantKeywords.some(keyword => {
          const lowerKey = keyword.toLowerCase();
          // Exact match or whole word match
          if (lowerKey.length <= 4) {
             return lowerTag === lowerKey || lowerTag.split(' ').includes(lowerKey);
          }
          return lowerTag.includes(lowerKey);
        });
      });

      // Check specialization/role
      const specMatch = relevantKeywords.some(keyword => {
        const lowerKey = keyword.toLowerCase();
        const lowerSpec = mentor.specialization?.toLowerCase() || "";
        if (lowerKey.length <= 4) {
          return lowerSpec === lowerKey || lowerSpec.split(' ').includes(lowerKey);
        }
        return lowerSpec.includes(lowerKey);
      });

      passesCategory = tagMatch || specMatch;
    }

    return passesType && passesCategory;
  });

  const marketplaceStyles = `
    .marketplace-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--spacing-2xl);
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }
    .marketplace-filters {
      display: flex;
      gap: var(--spacing-sm);
      background-color: var(--white);
      padding: var(--spacing-xs);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }
    .marketplace-filterButton {
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-family: var(--font-primary);
    }
    .marketplace-filterButton:hover {
      color: var(--deep-navy);
    }
    .marketplace-active {
      background-color: var(--vibrant-blue);
      color: var(--white) !important;
    }
    .marketplace-clearFilter {
      color: var(--warning-orange);
    }
    .marketplace-clearFilter:hover {
      color: #DC2626;
      background-color: rgba(239, 68, 68, 0.1);
    }
    .marketplace-noResults {
      text-align: center;
      padding: var(--spacing-2xl) 0;
      color: var(--text-secondary);
    }
    .marketplace-noResults h3 {
      margin-bottom: var(--spacing-xs);
      color: var(--text-primary);
    }
    .marketplace-mentorsGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-xl);
    }
    .marketplace-mentorCard {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: var(--spacing-lg);
    }
    .marketplace-topRatedBadge {
      position: absolute;
      top: -12px;
      right: 24px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: var(--white);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: var(--shadow-md);
      z-index: 10;
    }
    .marketplace-badgeContainer {
      display: flex;
      justify-content: flex-start;
      margin-bottom: var(--spacing-md);
    }
    .marketplace-typeBadge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .marketplace-liveBadge {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success-green);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .marketplace-offlineBadge {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--warning-orange);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .marketplace-pulseDot {
      width: 6px;
      height: 6px;
      background-color: var(--success-green);
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .marketplace-profileSection {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
    .marketplace-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--soft-grey);
    }
    .marketplace-profileInfo h3 {
      font-size: 1.25rem;
      margin-bottom: 2px;
    }
    .marketplace-role {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    .marketplace-company {
      font-size: 0.75rem;
      color: var(--vibrant-blue);
      font-weight: 600;
    }
    .marketplace-ratingSection {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-md);
    }
    .marketplace-stars {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .marketplace-ratingScore {
      font-weight: 700;
      color: var(--deep-navy);
    }
    .marketplace-reviewCount {
      font-size: 0.875rem;
    }
    .marketplace-tagsContainer {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-xl);
      flex: 1;
    }
    .marketplace-tag {
      background-color: var(--soft-grey);
      color: var(--text-secondary);
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-weight: 500;
    }
    .marketplace-actionSection {
      margin-top: auto;
    }
    .marketplace-bookButton {
      width: 100%;
    }
  `;

  return (
    <>
      <style>{marketplaceStyles}</style>
      <div className="page-container">
        <div className="marketplace-header">
          <div>
            <h1>Find a Mentor</h1>
            <p>
              Connect with industry experts and certified counsellors to map your
              future.
            </p>
          </div>
          <div className="marketplace-filters">
            <button
              className={`marketplace-filterButton ${filter === "all" && !categoryFilter ? "marketplace-active" : ""}`}
              onClick={() => {
                setFilter("all");
                setCategoryFilter(null);
              }}
            >
              All
            </button>
            <button
              className={`marketplace-filterButton ${filter === "live" ? "marketplace-active" : ""}`}
              onClick={() => setFilter("live")}
            >
              Mentors
            </button>

            {categoryFilter && (
              <button
                className={`marketplace-filterButton marketplace-clearFilter`}
                onClick={() => setCategoryFilter(null)}
              >
                Clear Category
              </button>
            )}
          </div>
        </div>

        {filteredMentors.length === 0 && (
          <div className="marketplace-noResults">
            <h3>No mentors found for this category yet!</h3>
            <p>Try clearing your filters or check back later.</p>
          </div>
        )}

        <div className="marketplace-mentorsGrid">
          {loading ? (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1", padding: "40px" }}>Loading mentors...</p>
          ) : (
            filteredMentors.map((mentor) => (
              <div key={mentor._id} className={`card marketplace-mentorCard`}>
              {mentor.isTopRated && (
                <div className="marketplace-topRatedBadge">
                  <Award size={14} /> Top Rated
                </div>
              )}

              <div className="marketplace-badgeContainer">
                <span className={`marketplace-typeBadge marketplace-liveBadge`}>
                  <span className="marketplace-pulseDot"></span>
                  <Video size={14} /> Live
                </span>
              </div>

              <div className="marketplace-profileSection">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="marketplace-avatar"
                />
                <div className="marketplace-profileInfo">
                  <h3>{mentor.name}</h3>
                  <p className="marketplace-role">{mentor.specialization}</p>
                  <p className="marketplace-company">{mentor.company}</p>
                </div>
              </div>

              <div className="marketplace-ratingSection">
                <div className="marketplace-stars">
                  <Star
                    size={18}
                    fill="var(--warning-orange)"
                    color="var(--warning-orange)"
                  />
                  <span className="marketplace-ratingScore">
                    {mentor.avgRating ? mentor.avgRating.toFixed(1) : "0.0"}
                  </span>
                </div>
                <span className="marketplace-reviewCount">
                  ({mentor.totalReviews} reviews)
                </span>
              </div>

              <div className="marketplace-tagsContainer">
                {mentor.tags.map((tag) => (
                  <span key={tag} className="marketplace-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="marketplace-actionSection">
                <button
                  className={`btn btn-primary marketplace-bookButton`}
                  onClick={() => setBookingMentor(mentor)}
                >
                  Book the Mentor
                </button>
              </div>
            </div>
            ))
          )}
        </div>

        {bookingMentor && (
          <BookingModal
            mentor={bookingMentor}
            onClose={() => setBookingMentor(null)}
          />
        )}
      </div>
    </>
  );
};

export default Marketplace;
