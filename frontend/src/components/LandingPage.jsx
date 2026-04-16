import { Link } from "react-router-dom";
import Testimonials from "./Testimonials";
// CSS injected directly into the component

const HERO_CATEGORIES = [
  { label: "Class 10", path: "/services", state: { highlightId: 1 } },
  { label: "Class 11-12", path: "/services", state: { highlightId: 2 } },
  { label: "College", path: "/services", state: { highlightId: 4 } },
  { label: "Professionals", path: "/services", state: { highlightId: 3 } },
  { label: "Counsellors", path: "/certifications" },
  { label: "Study Abroad", path: "/mentors" },
];

const LandingPage = () => {
  const landingStyles = `
    .landing-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }
    .landing-heroSection {
      position: relative;
      text-align: center;
      padding: 8rem var(--spacing-md);
      background-image: url('/counseling-bg.png');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      margin-top: 0;
      width: 100%;
    }
    .landing-heroOverlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }
    .landing-heroContent {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
    }
    .landing-heroContent h1 {
      color: #FFFFFF;
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: var(--spacing-sm);
      text-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    }
    .landing-heroContent p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: var(--spacing-2xl);
      max-width: 700px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    .landing-categoryRow {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      justify-content: center;
      width: 100%;
      padding-bottom: 5px;
    }
    .landing-categoryBtn {
      background-color: var(--vibrant-blue);
      color: var(--soft-grey);
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.95rem;
      border: 2px solid transparent;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-md);
      white-space: nowrap;
    }
    .landing-categoryBtn:hover {
      background-color: transparent;
      color: var(--vibrant-blue);
      border-color: var(--vibrant-blue);
      box-shadow: none;
      background-color: rgba(15, 23, 42, 0.8);
    }
    .landing-targetSection {
      padding: var(--spacing-2xl) 0;
    }
    .landing-sectionHeader {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }
    .landing-sectionHeader p {
      font-size: 1.125rem;
      max-width: 600px;
      margin: var(--spacing-xs) auto 0;
    }
    .landing-targetGrid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-xl);
    }
    .landing-targetCard {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      border-top: 4px solid transparent;
    }
    .landing-targetCard:hover {
      border-color: var(--vibrant-blue);
    }
    .landing-targetIcon {
      margin-bottom: var(--spacing-md);
    }
    .landing-targetCard h3 {
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
    }
    .landing-targetCard p {
      margin-bottom: var(--spacing-lg);
      flex-grow: 1;
    }
    .landing-learnMore {
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    .landing-exploreTeaser {
      background-color: var(--white);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }
    .landing-teaserContent {
      max-width: 600px;
      margin: 0 auto;
    }
    .landing-teaserContent h2 {
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }
    .landing-teaserContent p {
      margin-bottom: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .landing-heroSection {
        padding: 4rem 1rem;
      }
      .landing-heroContent h1 {
        font-size: 2.2rem;
      }
      .landing-heroContent p {
        font-size: 1rem;
        margin-bottom: var(--spacing-lg);
      }
      .landing-categoryBtn {
        padding: 0.4rem 1rem;
        font-size: 0.85rem;
      }
      .landing-exploreTeaser {
        padding: var(--spacing-lg) var(--spacing-md);
        margin: 0 var(--spacing-sm);
      }
      .landing-teaserContent h2 {
        font-size: 1.5rem;
      }
      .landing-categoryRow {
        gap: 8px;
      }
    }
  `;

  return (
    <>
      <style>{landingStyles}</style>
      <div className="landing-container">
        {/* Hero Section */}
        <section className="landing-heroSection">
          <div className="landing-heroOverlay"></div>
          <div className="landing-heroContent">
            <h1>Take Flight Toward Your Dream Career</h1>
            <p>
              Scientifically map out your professional journey with precision
              matching and industry-certified mentors.
            </p>

            <div className="landing-categoryRow">
              {HERO_CATEGORIES.map((cat, idx) => (
                <Link key={idx} to={cat.path} state={cat.state} className="landing-categoryBtn">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Teaser Section */}
        <section className="landing-exploreTeaser">
          <div className="landing-teaserContent">
            <h2>Not sure where to start?</h2>
            <p>
              Dive into our extensive library of career clusters to understand job
              roles, salaries, and growth trajectories.
            </p>
            <Link to="/explore" className="btn btn-primary">
              Browse Top Career Categories
            </Link>
          </div>
        </section>

        {/* Testimonials Integration */}
        <Testimonials />
      </div>
    </>
  );
};

export default LandingPage;
