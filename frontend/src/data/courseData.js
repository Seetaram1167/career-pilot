const LONG_OVERVIEW_BASE = `
  This comprehensive module is designed to provide you with a deep understanding of the subject matter. We will explore the historical context, current industry standards, and future trends that are shaping the landscape. 
  
  Key Learning Objectives:
  1. Master the fundamental concepts and terminology.
  2. Analyze real-world case studies to understand practical application.
  3. Develop hands-on skills through guided exercises and projects.
  4. Understand the ethical implications and professional responsibilities.
  
  Section 1: The Foundations
  In this section, we dive into the core principles. You will learn how to identify key challenges and use proven frameworks to solve them efficiently. We will cover the basic architecture and the "why" behind every "how."
  
  Section 2: Advanced Strategies
  Moving beyond the basics, we explore complex scenarios. Learn how to optimize your workflows, automate repetitive tasks, and scale your impact. This includes deep dives into toolsets, project management, and cross-functional collaboration.
  
  Section 3: Practical Implementation
  Theory is nothing without practice. This part of the module focuses on "doing." Follow along with our step-by-step video tutorial to build your first project from scratch. You'll also receive a checklist to ensure your implementation meets professional standards.
  
  Summary:
  By the end of this module, you will have a rock-solid foundation and a set of advanced techniques that you can apply immediately to your career or project.
`;

const DEFAULT_CONTENT = {
  description: LONG_OVERVIEW_BASE,
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder for educational video
  resources: [
    { title: "Essential Reading Guide.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { title: "Module Exercise Sheet.docx", url: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc" }
  ]
};

// Helper to convert simple module list to detailed objects with unique videos
const enrichModules = (modules, videoType = "lecture") => modules.map((m, i) => {
  const videos = {
    lecture: [
      "https://www.youtube.com/embed/hiiEeMN7vbQ", // Growth Mindset
      "https://www.youtube.com/embed/xp0OADarZAY", // Active Listening
      "https://www.youtube.com/embed/zK7W36TscS8", // Career Planning
      "https://www.youtube.com/embed/7_YAn5E9D1g"  // Global Education
    ],
    motivation: [
      "https://www.youtube.com/embed/7sxpKhIbr0E", // Grit: The power of passion
      "https://www.youtube.com/embed/Lp7E973zozc", // How to find work you love
      "https://www.youtube.com/embed/H14bBuluwB8", // Angela Duckworth - Grit
      "https://www.youtube.com/embed/5MgBikgcWnY", // The power of vulnerability
      "https://www.youtube.com/embed/qp0Hif3RRI0", // Simon Sinek - Start with Why
      "https://www.youtube.com/embed/hiiEeMN7vbQ", // Growth Mindset Basics
      "https://www.youtube.com/embed/Ks-_Mh1QhMc", // Body Language
      "https://www.youtube.com/embed/fW8amMCVAJQ"  // Growth Mindset Intro
    ]
  };
  
  const videoPool = videos[videoType] || videos.lecture;
  const videoUrl = videoPool[i % videoPool.length];

  return {
    title: m,
    ...DEFAULT_CONTENT,
    videoUrl
  };
});

export const COURSE_MODULES = {
  1: {
    title: "Become a Pro Counsellor Pipeline",
    bundle: true,
    courses: [
      {
        id: "c1",
        title: "Foundation of Counselling",
        modules: enrichModules([
          "What is Career Counselling?",
          "The Role of a Counsellor in 2024",
          "Ethics and Confidentiality",
          "Counselling Psychology Basics"
        ])
      },
      {
        id: "c2",
        title: "Psychology & Student Behavior",
        modules: enrichModules([
          "Understanding the Teenage Mind",
          "Cognitive Development Stages",
          "Empathy and Active Listening",
          "Handling Exam Anxiety"
        ])
      },
      {
        id: "c3",
        title: "Stream Selection Mastery (Grade 10)",
        modules: enrichModules([
          "Science, Commerce, Arts: Detailed Pros/Cons",
          "Integrated vs Traditional Schooling",
          "Subject Mapping Techniques",
          "Identifying Vocational Interests"
        ])
      },
      {
        id: "c4",
        title: "Career Mapping Graduation (Grade 12)",
        modules: enrichModules([
          "Emerging Career Trends",
          "Entrance Exams Roadmap (JEE, NEET, etc.)",
          "Liberal Arts & Multidisciplinary Education",
          "New Age Careers (AI, Sustainability)"
        ])
      },
      {
        id: "c5",
        title: "Global Education & Study Abroad",
        modules: enrichModules([
          "Country Comparison: US, UK, CA, EU",
          "SOP, LOR & Recommendation Letters",
          "Application Timelines & Visa Guidance",
          "Scholarship Hunting Strategies"
        ])
      },
      {
        id: "c6",
        title: "Psychometric Assessment Interpretation",
        modules: enrichModules([
          "Theory of Multiple Intelligences",
          "Holland's Code (RIASEC)",
          "Mapping Test Results to Careers",
          "Advanced Graph Analysis"
        ])
      },
      {
        id: "c7",
        title: "1-on-1 Coaching Framework",
        modules: enrichModules([
          "The 5-Step Session Structure",
          "Handling Difficult Parents/Students",
          "Goal Setting & Action Planning",
          "Follow-up & Student Support"
        ])
      },
      {
        id: "c8",
        title: "The Business of Counselling",
        modules: enrichModules([
          "Personal Branding for Coaches",
          "Acquiring Your First 10 Clients",
          "Scaling to an Independent Practice",
          "Operational Tools & CRM for Counselors"
        ])
      }
    ]
  },
  2: {
    title: "Guiding School Students (10th & 12th)",
    bundle: false,
    modules: enrichModules([
      "Teenage Developmental Stages",
      "Educational Boards Comparison (CBSE, ICSE, IB)",
      "Stream Selection Matrix",
      "Subject Combinations for Competitive Exams",
      "Vocational Education Pathways",
      "Identifying Learning Disabilities",
      "Aptitude Testing Basics",
      "Interest Inventory Analysis",
      "Personality Types & Course Fit",
      "The Impact of Social Media on Choice",
      "Parental Counselling Techniques",
      "Building a Career Roadmap (Age 14-18)",
      "Entrance Exam Strategy Planning",
      "Portfolio Building for Liberal Arts",
      "Interviewing Teenagers",
      "Career Counselling Case Studies"
    ], "motivation")
  },
  3: {
    title: "Study Abroad Admission Guidance",
    bundle: false,
    modules: enrichModules([
      "Introduction to Global Education",
      "Researching International Universities",
      "Standardized Testing (IELTS, TOEFL, SAT)",
      "Financial Planning & Cost of Living",
      "Drafting Winning SOPs",
      "Letters of Recommendation (LOR)",
      "Extra-Curricular Profiles",
      "Applying to US Universities (CommonApp)",
      "Applying to UK (UCAS)",
      "Canadian & Australian PR Pathways",
      "Visa Documentation & Interviews",
      "Post-Study Work Permits & Employment"
    ], "lecture")
  },
  4: {
    title: "Personal Branding & Sales for Coaches",
    bundle: false,
    modules: enrichModules([
      "Defining Your Unique Value Proposition",
      "Website & LinkedIn Optimization",
      "Content Strategy for Counselors",
      "Lead Generation via Webinars",
      "The Art of High-Ticket Sales",
      "Managing Client Testimonials",
      "Email Marketing & Automation",
      "Networking with Schools & Institutions",
      "Setting Your Pricing & Packages",
      "Scaling Your Personal Brand"
    ], "motivation")
  }
};
