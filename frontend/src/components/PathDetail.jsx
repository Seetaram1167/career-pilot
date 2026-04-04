import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, Target, Rocket, Lightbulb, BookOpen, Star, Briefcase, CheckCircle } from "lucide-react";

const PATH_DETAILS = {
  tech: {
    name: "Engineering & Tech",
    overview: "Engineering and Technology form the backbone of the modern world. From building the hardware in our pockets to the software that runs global industries, this path is for those who love to build, optimize, and innovate.",
    skills: ["Problem Solving", "Systems Architecture", "Math & Logic", "Hardware Design"],
    roles: ["Software Engineer", "Hardware Architect", "Robotics Engineer", "Systems Designer"],
    benefits: ["High demand across all industries", "Opportunity to build tangible products", "Continuously evolving tools and languages"]
  },
  ai: {
    name: "AI & Machine Learning",
    overview: "Artificial Intelligence and Machine Learning are transforming how we live and work. This field focuses on creating systems that can learn, reason, and act independently. It's the frontier of computer science, blending advanced math with cutting-edge engineering.",
    skills: ["Python", "Neural Networks", "Statistical Modeling", "Data Wrangling"],
    roles: ["AI Researcher", "ML Engineer", "Data Scientist", "NLP Specialist"],
    benefits: ["Work on the most advanced technology", "Exceptional salary potential", "Solve complex global problems at scale"]
  },
  health: {
    name: "Healthcare & Medicine",
    overview: "Medicine is a noble path dedicated to saving lives and improving human health. Whether in clinical practice, surgical excellence, or advanced research, healthcare professionals combine scientific mastery with deep empathy.",
    skills: ["Clinical Knowledge", "Patient Care", "Scientific Research", "Ethics"],
    roles: ["Diagnostic Physician", "Surgeon", "Medical Researcher", "Bio-medical Engineer"],
    benefits: ["Stable and rewarding career", "Make a direct impact on lives", "Respected profession worldwide"]
  },
  cloud: {
    name: "Cloud & DevOps",
    overview: "The digital world runs on the cloud. Cloud computing and DevOps professionals ensure that applications are scalable, secure, and always online. They bridge the gap between development and infrastructure automation.",
    skills: ["AWS/Azure/GCP", "Kubernetes", "CI/CD Pipelines", "Terraform"],
    roles: ["Cloud Architect", "DevOps Engineer", "Site Reliability Engineer", "Security Ops"],
    benefits: ["Zero-downtime mentality", "High scalability expertise", "Pivot point for major enterprises"]
  },
  design: {
    name: "Design & Arts",
    overview: "Design is where creativity meets functionality. From user interfaces to architectural wonders and digital branding, designers shape how the world looks and how we interact with it.",
    skills: ["Visual Composition", "UX Research", "Brand Identity", "Design Tools (Figma/Adobe)"],
    roles: ["Product Designer", "Creative Director", "UI/UX Specialist", "Multimedia Artist"],
    benefits: ["Express your creative vision", "Remote work flexibility", "Diverse range of industries"]
  },
  cyber: {
    name: "Cybersecurity",
    overview: "In an increasingly digital world, security is paramount. Cybersecurity experts protect critical infrastructure, personal data, and national secrets from evolving cyber threats and malicious actors.",
    skills: ["Ethical Hacking", "Network Security", "Cryptography", "Incident Response"],
    roles: ["Security Analyst", "Penetration Tester", "CISO", "Digital Forensics Expert"],
    benefits: ["Critical 'Frontline' role", "Recession-proof demand", "Constantly evolving challenges"]
  },
  business: {
    name: "Management & Marketing",
    overview: "Business keeps the world turning. Leaders and marketers drive growth, manage complex organizations, and build the brands that define our culture. It involves strategy, psychology, and meticulous execution.",
    skills: ["Strategic Planning", "Consumer Psychology", "Financial Analysis", "Leadership"],
    roles: ["Marketing Director", "Operations Manager", "Founder / CEO", "Brand Strategist"],
    benefits: ["Direct leadership opportunities", "Transferable across any field", "High impact on business growth"]
  },
  science: {
    name: "Science & Research",
    overview: "Science is the quest for truth. From quantum physics to molecular biology, researchers push the boundaries of human knowledge to understand the universe and develop the technologies of tomorrow.",
    skills: ["Experimental Design", "Data Analysis", "Scientific Writing", "Hypothesis Testing"],
    roles: ["Research Scientist", "Biostatistician", "Lab Director", "Science Advisor"],
    benefits: ["Contribute to human knowledge", "Work with brilliant minds", "Long-term intellectual growth"]
  },
  aerospace: {
    name: "Aerospace & Aviation",
    overview: "Aerospace professionals look upward. They design, build, and fly the machines that travel within our atmosphere and beyond it into space. It's the ultimate field for explorers and precision engineers.",
    skills: ["Aerodynamics", "Avionics", "Materials Science", "Structural Integrity"],
    roles: ["Aerospace Engineer", "Pilot", "Satellite Technician", "Propulsion Scientist"],
    benefits: ["Reach the final frontier", "Highly specialized elite field", "Work on massive, complex machines"]
  },
  media: {
    name: "Media & Entertainment",
    overview: "Media professionals tell the stories of our time. Through film, digital content, broadcasting, and social media, they shape public opinion and provide the entertainment that connects us globally.",
    skills: ["Storytelling", "Video Production", "Audience Engagement", "Digital Marketing"],
    roles: ["Film Director", "Content Strategist", "Broadcaster", "Social Media Maven"],
    benefits: ["Influence global culture", "Dynamic, fast-paced environment", "Mix of art and technology"]
  }
};

const PathDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const path = PATH_DETAILS[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!path) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>Path Not Found</h1>
        <p>Sorry, we couldn't find details for this career path.</p>
        <button onClick={() => navigate('/explore')} className="btn btn-primary">Back to Explore</button>
      </div>
    );
  }

  const detailStyles = `
    .path-hero {
      padding: 80px 40px;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.95)), 
                  url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070');
      background-size: cover;
      background-position: center;
      border-radius: 32px;
      margin-bottom: 40px;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .path-section {
      background: var(--white);
      padding: 40px;
      border-radius: 24px;
      border: 1px solid var(--border-color);
      margin-bottom: 24px;
    }
    .path-tag-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .path-tag {
      background: var(--soft-grey);
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      color: var(--deep-navy);
      border: 1px solid var(--border-color);
    }
    .path-cta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding: 32px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 24px;
      color: #fff;
    }
    .path-cta-bar h2 { color: #fff; margin: 0; }
  `;

  return (
    <div className="page-container">
      <style>{detailStyles}</style>

      <button 
        onClick={() => navigate('/explore')} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '8px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back to Exploration
      </button>

      <div className="path-hero">
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 20 }}>{path.name}</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '800px', lineHeight: 1.6 }}>
          {path.overview}
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
           <Link to="/mentors" state={{ categoryFilter: id }} className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: 16, fontSize: '1.1rem' }}>
             Book an Expert Mentor
           </Link>
        </div>
      </div>

      <div className="grid-container" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }}>
        <div className="main-content">
          <div className="path-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--deep-navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Star color="#f59e0b" /> Key Skills to Master
            </h2>
            <div className="path-tag-grid">
              {path.skills.map((skill, i) => (
                <div key={i} className="path-tag">
                  <CheckCircle size={18} color="var(--success-green)" /> {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="path-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--deep-navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Briefcase color="#3182ce" /> Career Roles
            </h2>
            <div className="path-tag-grid">
              {path.roles.map((role, i) => (
                <div key={i} className="path-tag">
                   <Target size={18} color="#3182ce" /> {role}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="sidebar">
          <div className="path-section" style={{ background: 'var(--soft-grey)', borderColor: 'transparent' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Rocket color="#ef4444" /> The Upside
            </h3>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {path.benefits.map((benefit, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: '0.95rem', lineHeight: 1.4 }}>
                  <Lightbulb size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                   {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="path-section" style={{ background: '#1e293b', border: 'none', color: '#fff' }}>
             <h3 style={{ color: '#fff', marginBottom: 12 }}>Next Steps?</h3>
             <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 20 }}>
               Get 1-on-1 guidance from professionals who have already mastered this path.
             </p>
             <Link to="/mentors" state={{ categoryFilter: id }} className="btn btn-primary" style={{ width: '100%', borderRadius: 12 }}>
               Find a Mentor
             </Link>
          </div>
        </aside>
      </div>

      <div className="path-cta-bar">
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Ready to dive into {path.name}?</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>Start your professional journey with a certified career roadmap.</p>
        </div>
        <Link to="/mentors" state={{ categoryFilter: id }} className="btn" style={{ background: '#fff', color: '#3b82f6', borderRadius: 12, padding: '14px 28px', fontWeight: 800 }}>
           Book Your Session
        </Link>
      </div>
    </div>
  );
};

export default PathDetail;
