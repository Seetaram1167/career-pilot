import { Link } from "react-router-dom";
import { Compass, Book, Brain, Target, Users } from "lucide-react";
// CSS injected directly into the component

const ASSESSMENTS = [
  {
    id: 1,
    title: "10th Grade Stream Selector",
    description:
      "Discover which high school stream (Science, Commerce, Arts) aligns with your innate strengths and interests.",
    time: "20 Mins",
    questions: 45,
    icon: <Book size={32} />,
    color: "var(--vibrant-blue)",
  },
  {
    id: 2,
    title: "Personality & Interests Profiler",
    description:
      "Map your unique personality traits to potential career environments where you'll naturally thrive.",
    time: "15 Mins",
    questions: 30,
    icon: <Brain size={32} />,
    color: "var(--warning-orange)",
  },
  {
    id: 3,
    title: "Ideal Career Matcher",
    description:
      "A comprehensive analysis across 8 dimensions to pinpoint your top 3 specific career targets.",
    time: "45 Mins",
    questions: 100,
    icon: <Target size={32} />,
    color: "var(--success-green)",
  },
  {
    id: 4,
    title: "Leadership & Collaboration Style",
    description:
      "Understand how you work in teams, vital for future management and collaborative roles.",
    time: "10 Mins",
    questions: 20,
    icon: <Users size={32} />,
    color: "var(--deep-navy)",
  },
];

const AssessmentLibrary = () => {
  const assessmentStyles = `
    .assessment-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-xl) 0;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .assessment-headerIcon {
      color: var(--vibrant-blue);
      margin-bottom: var(--spacing-sm);
    }
    .assessment-header h1 {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-xs);
      color: var(--deep-navy);
    }
    .assessment-header p {
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .assessment-libraryGrid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-xl);
    }
    .assessment-cardItem {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-xl);
      height: 100%;
    }
    .assessment-iconContainer {
      display: inline-flex;
      padding: var(--spacing-md);
      background-color: var(--soft-grey);
      border-radius: var(--radius-full);
      margin-bottom: var(--spacing-lg);
      align-self: flex-start;
    }
    .assessment-cardItem h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-sm);
    }
    .assessment-description {
      font-size: 0.875rem;
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
    }
    .assessment-metaInfo {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .assessment-tag {
      background-color: var(--soft-grey);
      color: var(--text-secondary);
      font-size: 0.75rem;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-weight: 600;
      border: 1px solid var(--border-color);
    }
    .assessment-startBtn {
      width: 100%;
    }
  `;

  return (
    <>
      <style>{assessmentStyles}</style>
      <div className="page-container">
        <div className="assessment-header">
          <Compass className="assessment-headerIcon" size={48} />
          <h1>Assessment Library</h1>
          <p>
            Scientific, student-focused quizzes to map your exact career
            trajectory.
          </p>
        </div>

        <div className="assessment-libraryGrid">
          {ASSESSMENTS.map((test) => (
            <div key={test.id} className="card assessment-cardItem">
              <div className="assessment-iconContainer" style={{ color: test.color }}>
                {test.icon}
              </div>
              <h3>{test.title}</h3>
              <p className="assessment-description">{test.description}</p>

              <div className="assessment-metaInfo">
                <span className="assessment-tag">{test.questions} Questions</span>
                <span className="assessment-tag">{test.time}</span>
              </div>

              <div>
                <Link
                  to={`/quiz/${test.id}`}
                  className="btn btn-primary assessment-startBtn"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssessmentLibrary;
