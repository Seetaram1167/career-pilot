import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import styles from './CareerQuiz.module.css';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What type of work environment energizes you?",
    options: [
      { id: 'a', text: "A bustling office with lots of collaboration" },
      { id: 'b', text: "A quiet space where I can focus deeply" },
      { id: 'c', text: "Being outdoors or travelling frequently" },
      { id: 'd', text: "A flexible mix of remote and in-person work" }
    ]
  },
  {
    id: 2,
    question: "When faced with a complex problem, what is your first step?",
    options: [
      { id: 'a', text: "Gathering data and analyzing facts" },
      { id: 'b', text: "Brainstorming creative solutions" },
      { id: 'c', text: "Asking experts or discussing with a team" },
      { id: 'd', text: "Trying out a practical, hands-on approach immediately" }
    ]
  },
  {
    id: 3,
    question: "Which subjects do you naturally gravitate towards?",
    options: [
      { id: 'a', text: "Mathematics, coding, or sciences" },
      { id: 'b', text: "Art, literature, or design" },
      { id: 'c', text: "Business, economics, or communication" },
      { id: 'd', text: "Psychology, sociology, or helping others" }
    ]
  }
];

const CareerQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className={styles.quizContainer}>
        <div className={`card ${styles.completionCard}`}>
          <div className={styles.successIcon}>
             <CheckCircle size={64} color="var(--success-green)" />
          </div>
          <h2>Great job building your profile!</h2>
          <p>We are analyzing your responses to build your custom Career Roadmap.</p>
          <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-xl)' }}>
            View My Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
       <div className={styles.quizHeader}>
          <h2>Career Assessment</h2>
          <p>Let's map out your journey.</p>
       </div>
       
       <div className={styles.progressBarContainer}>
          <div 
             className={styles.progressBarFill} 
             style={{ width: `${progressPercentage}%` }}
          />
       </div>
       
       <div className={`card ${styles.questionCard}`}>
          <div className={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}
          </div>
          <h3 className={styles.questionText}>
             {currentQuestion.question}
          </h3>
          
          <div className={styles.optionsList}>
             {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.optionButton} ${answers[currentQuestion.id] === option.id ? styles.selected : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <span className={styles.optionLetter}>{option.id.toUpperCase()}</span>
                  <span className={styles.optionText}>{option.text}</span>
                </button>
             ))}
          </div>

          <div className={styles.quizFooter}>
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}
              <ArrowRight size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
            </button>
          </div>
       </div>
    </div>
  );
};

export default CareerQuiz;
