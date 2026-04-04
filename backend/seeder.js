require("dotenv").config();
const mongoose = require("mongoose");
const Mentor = require("./models/Mentor");
const User = require("./models/User");
const connectDB = require("./config/db");

const MOCK_MENTORS = [
  {
    name: "Dr. Sarah Chen",
    role: "Tech Industry Senior Guide",
    company: "Google",
    type: "live",
    rating: 4.9,
    reviews: 128,
    isTopRated: true,
    image: "/mentor-sarah.png",
    tags: ["Software Engineering", "PM", "Interview Prep"],
  },
  {
    name: "Elena Rodriguez",
    role: "Design Lead",
    company: "Creative Studio",
    type: "live",
    rating: 5.0,
    reviews: 215,
    isTopRated: true,
    image: "/mentor-elena.png",
    tags: ["UX/UI Design", "Portfolio Review"],
  },
  {
    name: "Arjun Patel",
    role: "Finance & Strategy Mentor",
    company: "Global Ventures",
    type: "live",
    rating: 4.9,
    reviews: 180,
    isTopRated: false,
    image: "/mentor-arjun.png",
    tags: ["Investment Banking", "Startups", "MBA Prep"],
  },
  {
    name: "Dr. Emily Carter",
    role: "Executive Career Coach",
    company: "Carter Consulting",
    type: "live",
    rating: 5.0,
    reviews: 450,
    isTopRated: true,
    image: "/mentor-emily.png",
    tags: ["Executive Coaching", "Negotiation", "Resume Writing"],
  },
  {
    name: "David Wright",
    role: "Startup Mentor",
    company: "Wright Ventures",
    type: "live",
    rating: 4.8,
    reviews: 88,
    isTopRated: false,
    image: "/mentor-david.png",
    tags: ["Entrepreneurship", "Pitching", "Growth"],
  },
  {
    name: "Priya Sharma",
    role: "Senior Staff Engineer",
    company: "Cloud Systems Inc.",
    type: "live",
    rating: 4.9,
    reviews: 154,
    isTopRated: true,
    image: "/mentor-priya.png",
    tags: ["Software Engineering", "System Design", "Cloud"],
  },
  {
    name: "Sophia Lin",
    role: "Brand Strategy Director",
    company: "Creative Collective",
    type: "live",
    rating: 5.0,
    reviews: 210,
    isTopRated: true,
    image: "/mentor-sophia.png",
    tags: ["Marketing", "Brand Strategy", "Advertising"],
  },
  {
    name: "Olivia Martinez",
    role: "Director of Product",
    company: "Fintech Solutions",
    type: "live",
    rating: 4.8,
    reviews: 112,
    isTopRated: false,
    image: "/mentor-olivia.png",
    tags: ["Product Management", "Agile", "Roadmapping"],
  },
  {
    name: "Wei Chen",
    role: "Blockchain Architect",
    company: "Decentralized Corp",
    type: "live",
    rating: 4.9,
    reviews: 145,
    isTopRated: true,
    image: "/mentor-chen.png",
    tags: ["Fintech", "Blockchain", "Web3"],
  },
  {
    name: "Fatima Al-Fayed",
    role: "Lead Data Scientist",
    company: "AI Innovations",
    type: "live",
    rating: 4.9,
    reviews: 198,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_fatima",
    tags: ["Data Science", "Machine Learning", "Python"],
  },
  {
    name: "Amanda Brooks",
    role: "Principal UX Researcher",
    company: "UserFirst Design",
    type: "live",
    rating: 4.8,
    reviews: 167,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_amanda",
    tags: ["UX Research", "Usability Testing", "Psychology"],
  },
  {
    name: "William Turner",
    role: "Frontend Tech Lead",
    company: "WebWorks Studio",
    type: "live",
    rating: 4.6,
    reviews: 55,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=william_turner",
    tags: ["React", "CSS", "Frontend Development"],
  },
  {
    name: "Dr. Adrian Miller",
    role: "Senior Consultant Surgeon",
    company: "Metropolitan Hospital",
    type: "live",
    rating: 4.9,
    reviews: 156,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_adrian",
    tags: ["Healthcare", "Medicine", "Surgery"],
  },
  {
    name: "Dr. Lisa Wong",
    role: "Clinical Pharmacist",
    company: "HealthFirst Pharma",
    type: "live",
    rating: 4.8,
    reviews: 92,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_lisa",
    tags: ["Pharmacy", "Biotech", "Healthcare"],
  },
  {
    name: "Capt. Robert Sterling",
    role: "Senior Airline Pilot",
    company: "Global Airways",
    type: "live",
    rating: 5.0,
    reviews: 210,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_robert_s",
    tags: ["Aviation", "Pilot", "Aerospace"],
  },
  {
    name: "Sarah Jenkins",
    role: "Aerospace Engineer",
    company: "SpaceX",
    type: "live",
    rating: 4.9,
    reviews: 175,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_jenkins",
    tags: ["Aerospace", "Rocket", "Aerospace Engineering"],
  },
  {
    name: "Marcus Thorne",
    role: "Motion Graphics Lead",
    company: "Studio 5",
    type: "live",
    rating: 4.8,
    reviews: 84,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_marcus_t",
    tags: ["Design", "Motion Graphics", "Artist"],
  },
  {
    name: "Dr. Alan Turing Jr.",
    role: "Research Scientist",
    company: "DeepMind",
    type: "live",
    rating: 5.0,
    reviews: 312,
    isTopRated: true,
    image: "https://i.pravatar.cc/150?u=mentor_turing",
    tags: ["Science", "Research", "AI"],
  },
  {
    name: "Chloe Bennett",
    role: "Content Strategist",
    company: "Streaming Giant",
    type: "live",
    rating: 4.7,
    reviews: 120,
    isTopRated: false,
    image: "https://i.pravatar.cc/150?u=mentor_chloe",
    tags: ["Media", "Entertainment", "Creative"],
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Mentor.deleteMany();
    // await User.deleteMany(); // Removing this as it's too dangerous to wipe users during mentor updates

    // Convert role to specialization as per our schema
    const preparedMentors = MOCK_MENTORS.map((m) => {
      const { role, rating, reviews, ...rest } = m;
      return {
        ...rest,
        specialization: role,
        totalReviews: reviews,
        avgRating: rating,
        bio: `Experienced ${role} ready to guide you on your career path.`,
      };
    });

    await Mentor.insertMany(preparedMentors);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
