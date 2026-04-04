import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { useEffect } from "react";

const ARTICLES_DATA = {
  1: {
    title: "Why Data Analyst is a Top Career Pick?",
    category: "Trend",
    date: "March 10, 2026",
    author: "Sarah Jenkins",
    readTime: "6 min read",
    content: `
      <p>In today's data-driven world, the role of a Data Analyst has become more critical than ever. Organizations across all sectors—from healthcare to finance—are looking for professionals who can turn raw data into actionable insights.</p>
      
      <h3>The Growing Demand</h3>
      <p>The Bureau of Labor Statistics projects a 25% growth in employment for data-related roles over the next decade. This is significantly faster than the average for all occupations. As businesses continue to digitize their operations, the volume of data generated increases exponentially, creating a perpetual need for experts who can navigate this landscape.</p>
      
      <h3>Key Skills Required</h3>
      <ul>
        <li><strong>Statistical Analysis:</strong> Understanding distributions, hypothesis testing, and regression.</li>
        <li><strong>Technical Proficiency:</strong> Mastery of SQL, Python or R, and data visualization tools like Tableau or Power BI.</li>
        <li><strong>Business Acumen:</strong> The ability to translate complex data findings into clear business strategies.</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>Choosing a career as a Data Analyst offers not only job security and competitive salaries but also the opportunity to solve complex problems that have a real-world impact. If you have a curious mind and an affinity for numbers, this might be the perfect path for you.</p>
    `
  },
  2: {
    title: "Is Becoming A Doctor Worth It?",
    category: "Guide",
    date: "March 8, 2026",
    author: "Dr. Robert Miller",
    readTime: "10 min read",
    content: `
      <p>The journey to becoming a doctor is one of the most demanding educational and professional paths one can take. It requires years of study, significant financial investment, and immense emotional resilience.</p>
      
      <h3>The Challenges</h3>
      <p>The road starts with a rigorous undergraduate program, followed by four years of medical school and three to seven years of residency. The hours are long, and the responsibility is immense. Many young doctors also face substantial student loan debt.</p>
      
      <h3>The Rewards</h3>
      <p>Despite the challenges, the medical profession remains one of the most respected and fulfilling careers. The ability to save lives, improve health outcomes, and provide comfort to patients in their most vulnerable moments is a reward that transcends financial gain. Furthermore, medicine offers a diverse range of specialties, from surgery to psychiatry, allowing for a personalized career path.</p>
      
      <h3>Final Thoughts</h3>
      <p>Is it worth it? For those with a genuine passion for science and a deep-seated desire to serve humanity, the answer is a resounding yes. However, it is a decision that should be made with a clear understanding of the sacrifices involved.</p>
    `
  },
  3: {
    title: "From Boring To Memorable: AI Training",
    category: "Advice",
    date: "March 5, 2026",
    author: "James Chen",
    readTime: "5 min read",
    content: `
      <p>Artificial Intelligence is no longer just a futuristic concept; it's a present-day tool that is reshaping the workforce. "AI Training" is becoming a staple in professional development programs worldwide.</p>
      
      <h3>Integrating AI into Your Workflow</h3>
      <p>The goal of AI training isn't to replace humans, but to augment their capabilities. By automating repetitive tasks, AI allows employees to focus on higher-level creative and strategic work. Learning how to prompt AI effectively is becoming as essential as basic computer literacy.</p>
      
      <h3>Making Learning Fun</h3>
      <p>Modern AI training has evolved from dry lectures to interactive, gamified experiences. Virtual reality simulations and real-time AI feedback make the learning process engaging and memorable. This shift is crucial for ensuring that the workforce remains agile and tech-savvy.</p>
      
      <h3>The Future is Collaborative</h3>
      <p>The most successful professionals of the future will be those who can collaborate effectively with AI systems. Embracing this technology now will set you apart in the job market and open up new avenues for innovation and growth.</p>
    `
  },
  4: {
    title: "Software Engineering in 2026: What's Changing?",
    category: "Trend",
    date: "March 12, 2026",
    author: "William Turner",
    readTime: "7 min read",
    content: `
      <p>The field of software engineering is undergoing a radical transformation. As we move further into 2026, several key trends are redefining how developers work and what skills are prioritized.</p>
      
      <h3>The AI-First Development Lifecycle</h3>
      <p>AI is no longer just an assistant; it's becoming the core of the development lifecycle. From automated code reviews to AI-driven architecture design, engineers are becoming "AI orchestrators" rather than just "code writers". Understanding how to leverage these tools is non-negotiable for modern developers.</p>
      
      <h3>The Rise of Sustainable Software</h3>
      <p>There's a growing emphasis on green coding and sustainable software architecture. Organizations are looking for ways to reduce the carbon footprint of their digital infrastructure. This means optimizing algorithms for energy efficiency and choosing cloud providers with strong sustainability commitments.</p>
      
      <h3>Cybersecurity by Design</h3>
      <p>With threats becoming more sophisticated, security is being integrated earlier into the development process. "Shift-Left" security practices are now the standard, requiring all software engineers to have a foundational understanding of secure coding principles.</p>
    `
  },
  5: {
    title: "Mastering the Art of Cybersecurity",
    category: "Guide",
    date: "March 15, 2026",
    author: "Fatima Al-Fayed",
    readTime: "8 min read",
    content: `
      <p>In an increasingly digital world, the need for cybersecurity experts has reached an all-time high. This guide explores the essential steps and skills needed to build a successful career in this critical field.</p>
      
      <h3>Continuous Learning is Key</h3>
      <p>The threat landscape changes almost daily. To stay relevant, cybersecurity professionals must commit to continuous learning. This includes staying up-to-date with the latest vulnerabilities, attack vectors, and defense strategies. Certifications like CISSP or CEH can be valuable milestones in your journey.</p>
      
      <h3>Practical Experience Over Theory</h3>
      <p>While theoretical knowledge is important, nothing beats hands-on experience. Setting up your own home lab, participating in Capture The Flag (CTF) competitions, and contributing to open-source security projects are excellent ways to build practical skills that employers value.</p>
      
      <h3>The Importance of Soft Skills</h3>
      <p>Cybersecurity isn't just about technology; it's also about people. Effective communication, problem-solving, and critical thinking are essential. You need to be able to explain complex security risks to non-technical stakeholders and work collaboratively with other teams to implement defense measures.</p>
    `
  },
  6: {
    title: "Networking: The Hidden Key to Career Growth",
    category: "Advice",
    date: "March 18, 2026",
    author: "James Wilson",
    readTime: "6 min read",
    content: `
      <p>We've all heard the phrase "it's not what you know, but who you know." In the context of career growth, this couldn't be more true. Networking is one of the most powerful tools in your professional arsenal.</p>
      
      <h3>Building Genuine Connections</h3>
      <p>Networking isn't about collecting business cards; it's about building genuine, mutually beneficial relationships. Focus on how you can help others before asking for help yourself. Attend industry events, join professional organizations, and reach out to people you admire for informational interviews.</p>
      
      <h3>Leveraging Social Media</h3>
      <p>Platforms like LinkedIn have made networking easier than ever. However, it's important to use them effectively. Share your insights, engage with other people's content, and keep your profile up-to-date. A strong online presence can attract opportunities that you might not otherwise have access to.</p>
      
      <h3>Nurturing Your Network</h3>
      <p>Don't just reach out to people when you need something. Nurture your network by checking in periodically, sharing relevant articles, or offering congratulations on their achievements. A healthy network is one that is consistently maintained over time.</p>
    `
  }
};

const ArticleDetail = () => {
  const { id } = useParams();
  const article = ARTICLES_DATA[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Article Not Found</h2>
        <p>Sorry, the article you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: "20px" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const articleStyles = `
    .article-page {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-2xl) var(--spacing-md);
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-weight: 600;
      margin-bottom: var(--spacing-xl);
      transition: color var(--transition-fast);
    }
    .back-link:hover {
      color: var(--vibrant-blue);
    }
    .article-header {
      margin-bottom: var(--spacing-2xl);
    }
    .article-badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(41, 121, 255, 0.1);
      color: var(--vibrant-blue);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--spacing-md);
    }
    .article-title {
      font-size: 3rem;
      line-height: 1.1;
      margin-bottom: var(--spacing-lg);
      color: var(--deep-navy);
    }
    @media (max-width: 600px) {
      .article-title { font-size: 2.25rem; }
    }
    .article-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xl);
      color: var(--text-secondary);
      font-size: 0.875rem;
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .article-content {
      font-size: 1.125rem;
      line-height: 1.7;
      color: var(--text-primary);
    }
    .article-content p {
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }
    .article-content h3 {
      font-size: 1.75rem;
      margin: var(--spacing-2xl) 0 var(--spacing-md);
      color: var(--deep-navy);
    }
    .article-content ul {
      margin-bottom: var(--spacing-xl);
      padding-left: var(--spacing-xl);
    }
    .article-content li {
      margin-bottom: var(--spacing-sm);
    }
    .article-footer {
      margin-top: var(--spacing-2xl);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: `Check out this article on CareerPilot: ${article.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="article-page">
      <style>{articleStyles}</style>
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <article>
        <header className="article-header">
          <span className="article-badge">{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <div className="meta-item">
              <User size={16} /> {article.author}
            </div>
            <div className="meta-item">
              <Calendar size={16} /> {article.date}
            </div>
            <div className="meta-item">
              <Clock size={16} /> {article.readTime}
            </div>
          </div>
        </header>

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="article-footer">
          <button 
            className="meta-item" 
            onClick={handleShare}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              color: 'inherit',
              padding: 0
            }}
          >
            <Share2 size={18} /> Share this article
          </button>
          <Link to="/dashboard" className="btn btn-secondary">
            More Articles
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
