import { Link } from "react-router-dom";
import techImg from "../assets/categories/tech.png";
import healthImg from "../assets/categories/health.png";
import designImg from "../assets/categories/design.png";
import businessImg from "../assets/categories/business.png";
import scienceImg from "../assets/categories/science.png";
import aerospaceImg from "../assets/categories/aerospace.png";
import mediaImg from "../assets/categories/media.png";

const CATEGORIES = [
  {
    id: "tech",
    name: "Engineering & Tech",
    image: techImg,
    color: "#06B6D4",
    count: "124 Mentors",
    description: "Build the future with software and hardware engineering.",
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    color: "#8B5CF6",
    count: "76 Mentors",
    description: "Master neural networks and deep learning to build intelligent systems.",
  },
  {
    id: "health",
    name: "Healthcare & Medicine",
    image: healthImg,
    color: "#10B981",
    count: "89 Mentors",
    description: "Save lives and advance medical research.",
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    color: "#3B82F6",
    count: "64 Mentors",
    description: "Deploy scalable infrastructure and automate software delivery pipelines.",
  },
  {
    id: "design",
    name: "Design & Arts",
    image: designImg,
    color: "#F59E0B",
    count: "156 Mentors",
    description: "Express creativity through digital and visual arts.",
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    color: "#F43F5E",
    count: "52 Mentors",
    description: "Defend digital assets and protect networks from evolving cyber threats.",
  },
  {
    id: "business",
    name: "Management & Marketing",
    image: businessImg,
    color: "#6366F1",
    count: "210 Mentors",
    description: "Lead organizations and drive market growth.",
  },
  {
    id: "science",
    name: "Science & Research",
    image: scienceImg,
    color: "#A855F7",
    count: "45 Mentors",
    description: "Explore the mysteries of the universe and nature.",
  },
  {
    id: "aerospace",
    name: "Aerospace & Aviation",
    image: aerospaceImg,
    color: "#EF4444",
    count: "32 Mentors",
    description: "Reach for the stars and master the skies.",
  },
  {
    id: "media",
    name: "Media & Entertainment",
    image: mediaImg,
    color: "#EC4899",
    count: "98 Mentors",
    description: "Create compelling stories and digital experiences.",
  },
];

const Explore = () => {
  const injectedStyles = `
    .explore-heroSection {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-3xl) var(--spacing-lg);
      background: linear-gradient(135deg, rgba(10, 25, 47, 0.95) 0%, rgba(1, 1, 1, 0.9) 100%), 
                  url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      border-radius: var(--radius-2xl);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }
    .explore-heroSection h1 {
      color: #FFFFFF;
      margin-bottom: var(--spacing-md);
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.05em;
    }
    .explore-heroSection p {
      color: rgba(255, 255, 255, 0.85);
      font-size: 1.15rem;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .explore-categoriesGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: var(--spacing-2xl);
      padding: var(--spacing-md) 0;
    }

    .explore-categoryCard {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      background: var(--card-bg);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      height: 100%;
    }
    .explore-categoryCard:hover {
      transform: translateY(-16px) scale(1.02);
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
      border-color: var(--vibrant-blue);
    }

    .explore-imageWrapper {
      width: 100%;
      height: 220px;
      position: relative;
      overflow: hidden;
      background: #081430;
    }

    .explore-categoryImage {
      width: 100%;
      height: 100%;
      object-fit: cover; /* CHANGED: To fill the rectangle as requested */
      transition: transform 0.8s ease;
    }
    .explore-categoryCard:hover .explore-categoryImage {
      transform: scale(1.1);
    }

    /* Glass overlay for texture/depth */
    .explore-imageWrapper::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, transparent 60%, rgba(8, 20, 48, 0.8) 100%);
      pointer-events: none;
    }

    .explore-cardContent {
      padding: var(--spacing-xl);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      position: relative;
      z-index: 2;
    }

    /* Glass Effect for Content */
    .explore-categoryCard:hover .explore-cardContent {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(4px);
    }

    .explore-categoryCard h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--deep-navy); /* Fixed light mode compatibility */
      margin-bottom: var(--spacing-sm);
      letter-spacing: -0.02em;
    }
    .explore-cardDescription {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: var(--spacing-xl);
      line-height: 1.6;
    }

    .explore-cardFooter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }

    .explore-mentorCount {
      color: var(--vibrant-blue);
      font-size: 0.75rem;
      font-weight: 800;
      background: rgba(6, 182, 212, 0.1);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .explore-learnMore {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--vibrant-blue);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: gap 0.3s ease;
    }
    .explore-categoryCard:hover .explore-learnMore {
      gap: 12px;
    }
  `;

  return (
    <>
      <style>{injectedStyles}</style>
      <div className="page-container">
        <div className="explore-heroSection">
          <h1>Find Your Perfect Path</h1>
          <p>
            Explore diverse career industries, gain insights from industry experts, 
            and take the next big step in your professional journey.
          </p>
        </div>

        <div className="explore-categoriesGrid">
          {CATEGORIES.map((category) => (
            <Link
              to={`/path/${category.id}`}
              key={category.id}
              className="explore-categoryCard"
            >
              <div className="explore-imageWrapper">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="explore-categoryImage"
                />
              </div>
              <div className="explore-cardContent">
                <h3>{category.name}</h3>
                <p className="explore-cardDescription">{category.description}</p>
                <div className="explore-cardFooter">
                  <span className="explore-mentorCount">{category.count}</span>
                  <span className="explore-learnMore">
                    Browse Mentors →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
