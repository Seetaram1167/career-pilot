import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Code, Brain, Target, ArrowRight, Star, Clock, HelpCircle, Users } from "lucide-react";

const ASSESSMENT_CATEGORIES = [
  {
    id: "career",
    title: "Career Assessment",
    description: "Discover your ideal career path based on your personality, interests, and strengths.",
    icon: <Target size={32} />,
    color: "#3b82f6",
    questions: 8,
    time: "5 mins",
    difficulty: "Beginner",
    path: "/quiz/career"
  },
  {
    id: "coding",
    title: "Coding Assessment",
    description: "Test your programming logic, data structures, and problem-solving skills.",
    icon: <Code size={32} />,
    color: "#8b5cf6",
    questions: 8,
    time: "10 mins",
    difficulty: "Advanced",
    path: "/quiz/coding"
  },
  {
    id: "aptitude",
    title: "Aptitude Assessment",
    description: "Challenge your quantitative, verbal, and logical reasoning abilities.",
    icon: <Brain size={32} />,
    color: "#f59e0b",
    questions: 8,
    time: "10 mins",
    difficulty: "Intermediate",
    path: "/quiz/aptitude"
  },
  {
    id: "practice",
    title: "Practice Assessment",
    description: "Daily bite-sized challenges to keep your mind sharp and skills current.",
    icon: <BookOpen size={32} />,
    color: "#10b981",
    questions: 8,
    time: "5 mins",
    difficulty: "All Levels",
    path: "/quiz/practice"
  },
  {
    id: "softskills",
    title: "Soft Skills Profiler",
    description: "Evaluate your leadership, teamwork, and resilience in workplace scenarios.",
    icon: <Users size={32} />,
    color: "#64748b",
    questions: 8,
    time: "6 mins",
    difficulty: "Beginner",
    path: "/quiz/softskills"
  },
  {
    id: "english",
    title: "English Proficiency",
    description: "Master professional communication, grammar, and verbal reasoning skills.",
    icon: <BookOpen size={32} />,
    color: "#f43f5e",
    questions: 8,
    time: "8 mins",
    difficulty: "Intermediate",
    path: "/quiz/english"
  },
  {
    id: "logic",
    title: "Critical Thinking",
    description: "Solve complex puzzles, logical riddles, and abstract pattern challenges.",
    icon: <HelpCircle size={32} />,
    color: "#06b6d4",
    questions: 8,
    time: "10 mins",
    difficulty: "Advanced",
    path: "/quiz/logic"
  }
];

const Assessments = () => {
  const navigate = useNavigate();

  const assessmentStyles = `
    .assessments-hero {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
      border-radius: 24px;
      margin-bottom: 40px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .assessments-hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 16px;
      color: #fff !important;
    }
    .assessments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    .assessment-card {
      background: var(--white);
      border-radius: 24px;
      padding: 32px;
      border: 1px solid var(--border-color);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .assessment-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
      border-color: var(--vibrant-blue);
    }
    .assessment-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: #fff;
    }
    .assessment-meta {
      display: flex;
      gap: 16px;
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .start-btn {
      margin-top: 24px;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
    }
  `;

  return (
    <div className="page-container">
      <style>{assessmentStyles}</style>
      
      <div className="assessments-hero">
        <h1>Assessments Hub</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Evaluate your skills, discover your potential, and track your growth with our specialized assessment tests.
        </p>
      </div>

      <div className="assessments-grid">
        {ASSESSMENT_CATEGORIES.map((cat) => (
          <div key={cat.id} className="assessment-card">
            <div className="assessment-icon" style={{ backgroundColor: cat.color, boxShadow: `0 10px 20px ${cat.color}33` }}>
              {cat.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{cat.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>{cat.description}</p>
            
            <div className="assessment-meta">
              <div className="meta-item"><HelpCircle size={16} /> {cat.questions} Quest.</div>
              <div className="meta-item"><Clock size={16} /> {cat.time}</div>
              <div className="meta-item"><Star size={16} /> {cat.difficulty}</div>
            </div>

            <button 
              className="btn btn-primary start-btn" 
              style={{ backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }}
              onClick={() => navigate(cat.path)}
            >
              Start Assessment <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
