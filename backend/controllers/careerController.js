const User = require("../models/User");
const { createNotification } = require("./notificationController");

// Career path definitions with roadmap steps
const CAREER_PATHS = {
  "Software Engineering": {
    description: "You have a strong analytical mind and love building systems. Software Engineering is your calling — from apps to algorithms.",
    roadmap: [
      { title: "Master Core Programming", description: "Learn Python or JavaScript deeply — data structures, OOP, algorithms.", status: "pending" },
      { title: "Build Your First Projects", description: "Create 2–3 portfolio projects: a web app, API, or CLI tool.", status: "pending" },
      { title: "Learn Web/Backend Frameworks", description: "Pick React (frontend) or Node.js/Django (backend) and build with it.", status: "pending" },
      { title: "Study System Design & DSA", description: "Prepare for technical interviews with LeetCode and system design practice.", status: "pending" },
      { title: "Competitive Exams / Degree", description: "Target JEE / B.Tech in CS or enroll in a top coding bootcamp.", status: "pending" },
      { title: "Land an Internship", description: "Apply to tech companies for SWE internships to gain real experience.", status: "pending" },
      { title: "Get Your First Job", description: "Apply for Junior/Associate Software Engineer roles at startups or MNCs.", status: "pending" },
    ],
  },
  "Data Science": {
    description: "You love uncovering patterns in data and making data-driven decisions. Data Science and AI are your ideal domains.",
    roadmap: [
      { title: "Build a Strong Math Foundation", description: "Study Statistics, Linear Algebra, and Calculus (Khan Academy / NPTEL).", status: "pending" },
      { title: "Learn Python for Data", description: "Master Pandas, NumPy, Matplotlib, and Scikit-learn.", status: "pending" },
      { title: "Study Machine Learning", description: "Complete Andrew Ng's ML course or fast.ai — understand models deeply.", status: "pending" },
      { title: "Work on Real Datasets", description: "Complete 3 Kaggle competitions or personal data projects.", status: "pending" },
      { title: "Learn Deep Learning Basics", description: "Explore TensorFlow or PyTorch for neural network fundamentals.", status: "pending" },
      { title: "Target a B.Tech / MCA in Data Science", description: "Appear for GATE, JEE or university-specific entrance exams.", status: "pending" },
      { title: "Land a Data Analyst / Scientist Role", description: "Apply for internships and entry-level roles at analytics firms.", status: "pending" },
    ],
  },
  "Medicine & Healthcare": {
    description: "You are compassionate, science-driven, and want to heal people. Medicine is a deeply rewarding path that demands dedication.",
    roadmap: [
      { title: "Excel in Biology & Chemistry", description: "Focus on Class 11–12 NCERT Biology and Chemistry thoroughly.", status: "pending" },
      { title: "Prepare for NEET UG", description: "Join a coaching institute or self-study for 1–2 years with mock tests.", status: "pending" },
      { title: "Crack NEET & Enter MBBS", description: "Target government medical colleges for MBBS (5.5 years).", status: "pending" },
      { title: "Complete Clinical Rotations", description: "Gain hands-on hospital experience during your internship year.", status: "pending" },
      { title: "Choose a Specialization", description: "Prepare for PG entrance (NEET-PG) to specialize in your area of interest.", status: "pending" },
      { title: "Complete MD / MS Residency", description: "3-year postgraduate residency in your chosen specialty.", status: "pending" },
      { title: "Practice & Contribute", description: "Join a hospital, open a clinic, or pursue research in your domain.", status: "pending" },
    ],
  },
  "Design & Architecture": {
    description: "You have a creative eye and love aesthetics, space, and expression. Design or Architecture will let you shape the world visually.",
    roadmap: [
      { title: "Develop Your Creative Portfolio", description: "Start drawing, designing, or building models. Document everything.", status: "pending" },
      { title: "Prepare for NID DAT / NATA / UCEED", description: "Target National design or architecture entrance exams.", status: "pending" },
      { title: "Enroll in B.Des or B.Arch", description: "Join a top design school (NID, MIT, SPA) or architecture college.", status: "pending" },
      { title: "Learn Design Tools", description: "Master Figma, Adobe Suite, AutoCAD, or Rhino as per your stream.", status: "pending" },
      { title: "Complete Studio Projects", description: "Build 5–6 diverse projects showcasing your range and depth.", status: "pending" },
      { title: "Intern with a Studio/Firm", description: "Get industry exposure through internships at design or architecture firms.", status: "pending" },
      { title: "Build a Professional Practice", description: "Launch your own studio or join an established firm as a junior designer.", status: "pending" },
    ],
  },
  "Business & Management": {
    description: "You are a natural leader with a head for strategy and numbers. Business and Management will let you drive organizations forward.",
    roadmap: [
      { title: "Build Communication & Leadership Skills", description: "Join debate clubs, MUN, and student government for real experience.", status: "pending" },
      { title: "Target Commerce/Economics Stream", description: "Focus on Accountancy, Economics, Business Studies in Class 12.", status: "pending" },
      { title: "Prepare for IPMAT / CLAT / BBA Entrances", description: "Crack integrated MBA programs at IIMs or top BBA colleges.", status: "pending" },
      { title: "Study Core Business Subjects", description: "Understand Marketing, Finance, Operations, and Organizational Behavior.", status: "pending" },
      { title: "Intern with Companies", description: "Get summer internships in consulting, finance, marketing or operations.", status: "pending" },
      { title: "Prepare for MBA Entrance (CAT/GMAT)", description: "Target top B-schools after 2–3 years of work experience.", status: "pending" },
      { title: "Move into Leadership Roles", description: "Grow from analyst to manager to C-suite with consistent performance.", status: "pending" },
    ],
  },
  "Law & Civil Services": {
    description: "You think critically, argue well, and care about justice and society. Law or Civil Services will give you the power to drive real change.",
    roadmap: [
      { title: "Study Political Science, History & Economics", description: "Build your foundation in humanities subjects through Class 12.", status: "pending" },
      { title: "Prepare for CLAT (Law) or UPSC (IAS)", description: "Target CLAT for NLU admission or start UPSC foundation early.", status: "pending" },
      { title: "Enroll in BA LLB or B.A. (Hons)", description: "Complete a 5-year integrated law program or a humanities degree.", status: "pending" },
      { title: "Build Case Study & Mooting Skills", description: "Participate in moot courts, legal aid clinics, and law review writing.", status: "pending" },
      { title: "Intern with Lawyers / Government Offices", description: "Gain practical exposure through legal or civil services internships.", status: "pending" },
      { title: "Clear Bar Council Exam (Law) or UPSC Mains", description: "Qualify the All India Bar Exam or clear UPSC Mains & Interview.", status: "pending" },
      { title: "Build Your Practice / Join the Service", description: "Practice as an advocate or serve as an IAS/IPS/IFS officer.", status: "pending" },
    ],
  },
};

// Score answers across 10 questions and determine career path
const scoreAnswers = (answers) => {
  const scores = {
    tech: 0,       // Software Engineering / Data Science
    data: 0,       // Data Science specifically
    medical: 0,    // Medicine & Healthcare
    creative: 0,   // Design & Architecture
    business: 0,   // Business & Management
    law: 0,        // Law & Civil Services
  };

  // Q1 – Work environment
  if (answers[1] === "a") { scores.business += 2; }
  if (answers[1] === "b") { scores.tech += 2; scores.data += 1; }
  if (answers[1] === "c") { scores.law += 1; scores.medical += 1; }
  if (answers[1] === "d") { scores.creative += 2; }

  // Q2 – Problem solving
  if (answers[2] === "a") { scores.data += 2; scores.tech += 1; }
  if (answers[2] === "b") { scores.creative += 2; }
  if (answers[2] === "c") { scores.business += 1; scores.law += 1; }
  if (answers[2] === "d") { scores.medical += 2; scores.tech += 1; }

  // Q3 – Subjects
  if (answers[3] === "a") { scores.tech += 2; scores.data += 2; }
  if (answers[3] === "b") { scores.creative += 2; }
  if (answers[3] === "c") { scores.medical += 2; }
  if (answers[3] === "d") { scores.business += 1; scores.law += 2; }

  // Q4 – Career impact
  if (answers[4] === "a") { scores.tech += 2; }
  if (answers[4] === "b") { scores.medical += 2; }
  if (answers[4] === "c") { scores.creative += 2; }
  if (answers[4] === "d") { scores.law += 2; scores.business += 1; }

  // Q5 – Communication style
  if (answers[5] === "a") { scores.business += 2; }
  if (answers[5] === "b") { scores.tech += 1; scores.data += 1; }
  if (answers[5] === "c") { scores.data += 2; scores.creative += 1; }
  if (answers[5] === "d") { scores.medical += 2; scores.law += 1; }

  // Q6 – Tech relationship
  if (answers[6] === "a") { scores.tech += 2; scores.data += 1; }
  if (answers[6] === "b") { scores.creative += 2; }
  if (answers[6] === "c") { scores.medical += 1; scores.law += 1; }
  if (answers[6] === "d") { scores.data += 2; scores.business += 1; }

  // Q7 – Exciting activity
  if (answers[7] === "a") { scores.tech += 1; scores.data += 2; }
  if (answers[7] === "b") { scores.creative += 2; }
  if (answers[7] === "c") { scores.medical += 2; }
  if (answers[7] === "d") { scores.law += 2; scores.business += 1; }

  // Q8 – Numbers/Data comfort
  if (answers[8] === "a") { scores.data += 2; scores.tech += 1; }
  if (answers[8] === "b") { scores.creative += 1; }
  if (answers[8] === "c") { scores.business += 2; }
  if (answers[8] === "d") { scores.law += 2; scores.creative += 1; }

  // Q9 – Success definition
  if (answers[9] === "a") { scores.tech += 2; scores.business += 1; }
  if (answers[9] === "b") { scores.medical += 2; }
  if (answers[9] === "c") { scores.creative += 2; }
  if (answers[9] === "d") { scores.business += 2; scores.law += 1; }

  // Q10 – Long-term projects
  if (answers[10] === "a") { scores.medical += 1; scores.law += 1; scores.tech += 1; }
  if (answers[10] === "b") { scores.creative += 2; }
  if (answers[10] === "c") { scores.medical += 2; }
  if (answers[10] === "d") { scores.business += 2; }

  // Combine tech + data to decide between SWE and DS
  const highestScore = Math.max(...Object.values(scores));
  const topCategory = Object.entries(scores).find(([, v]) => v === highestScore)[0];

  const pathMap = {
    tech: "Software Engineering",
    data: scores.data >= scores.tech ? "Data Science" : "Software Engineering",
    medical: "Medicine & Healthcare",
    creative: "Design & Architecture",
    business: "Business & Management",
    law: "Law & Civil Services",
  };

  return pathMap[topCategory] || "Software Engineering";
};

// @desc    Evaluate Career Quiz and save results + roadmap
// @route   POST /api/career/evaluate
// @access  Private
const evaluateCareer = async (req, res) => {
  const { answers } = req.body;

  if (!answers || Object.keys(answers).length === 0) {
    res.status(400);
    throw new Error("No answers provided");
  }

  const topCareerPath = scoreAnswers(answers);
  const careerData = CAREER_PATHS[topCareerPath];

  const resultData = {
    topCareerPath,
    description: careerData.description,
    roadmap: careerData.roadmap,
    evaluatedAt: new Date(),
    rawAnswers: answers,
  };

  const user = await User.findById(req.user.id);

  if (user) {
    user.results = resultData;
    await user.save();
    res.status(200).json(resultData);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

module.exports = { evaluateCareer };
