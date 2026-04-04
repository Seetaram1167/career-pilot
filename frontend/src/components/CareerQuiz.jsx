import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, X, HelpCircle, FileText } from "lucide-react";
import { API_BASE_URL } from "../apiConfig";

const QUIZ_DATA = {
  career: {
    title: "Career Assessment",
    themeColor: "#3b82f6",
    description: "Discover your ideal career path honestly — we'll map out your future.",
    questions: [
      { id: 1, question: "What type of work environment energizes you the most?", options: [{ id: "a", text: "A bustling office with lots of team collaboration" }, { id: "b", text: "A quiet space where I can focus deeply alone" }, { id: "c", text: "Outdoors, travelling, or working in different locations" }, { id: "d", text: "A creative studio or design-led environment" }] },
      { id: 2, question: "When you face a complex problem, what is your first instinct?", options: [{id:"a", text:"Analyze data and study facts"}, {id:"b", text:"Creative brainstorm for solutions"}, {id:"c", text:"Seek expert guidance"}, {id:"d", text:"Hands-on trial and error"}] },
      { id: 3, question: "Which subjects did you naturally excel at in school?", options: [{id:"a", text:"Mathematics and Coding"}, {id:"b", text:"Art, Design, or Literature"}, {id:"c", text:"Biology or Chemistry"}, {id:"d", text:"Business and Economics"}] },
      { id: 4, question: "What kind of impact do you want your work to have?", options: [{id:"a", text:"Build tech for millions"}, {id:"b", text:"Heal or help people directly"}, {id:"c", text:"Inspire through creative art"}, {id:"d", text:"Change policy or laws"}] },
      { id: 5, question: "How do you prefer to manage your responsibilities?", options: [{id:"a", text:"Lead and manage large teams"}, {id:"b", text:"Collaborate in a small group"}, {id:"c", text:"Work entirely independently"}, {id:"d", text:"Interact with clients/public"}] },
      { id: 6, question: "Which activity sounds most rewarding to you?", options: [{id:"a", text:"Debugging complex software"}, {id:"b", text:"Designing a user interface"}, {id:"c", text:"Conducting scientific research"}, {id:"d", text:"Managing a global project"}] },
      { id: 7, question: "How do you handle high-pressure deadlines?", options: [{id:"a", text:"I thrive on the challenge"}, {id:"b", text:"I stay calm and organized"}, {id:"c", text:"I focus on one task at a time"}, {id:"d", text:"I prefer steady, low-pressure work"}] },
      { id: 8, question: "What is your primary motivator for working?", options: [{id:"a", text:"Technical mastery"}, {id:"b", text:"Creative freedom"}, {id:"c", text:"Helping others"}, {id:"d", text:"Leadership and growth"}] }
    ]
  },
  coding: {
    title: "Coding Assessment",
    themeColor: "#8b5cf6",
    description: "Evaluate your technical logic, syntax knowledge, and problem-solving skills.",
    questions: [
      { id: 1, question: "What is the time complexity of searching in a balanced BST?", options: [{ id: "a", text: "O(1)" }, { id: "b", text: "O(log n)" }, { id: "c", text: "O(n)" }, { id: "d", text: "O(n log n)" }] },
      { id: 2, question: "Which data structure follows the LIFO principle?", options: [{ id: "a", text: "Queue" }, { id: "b", text: "Stack" }, { id: "c", text: "Linked List" }, { id: "d", text: "Hash Table" }] },
      { id: 3, question: "In JavaScript, what does '===' operator check for?", options: [{ id: "a", text: "Value equality only" }, { id: "b", text: "Type and Value equality" }, { id: "c", text: "Reference equality" }, { id: "d", text: "Partial matching" }] },
      { id: 4, question: "What is the primary purpose of a 'Double Linked List'?", options: [{ id: "a", text: "Save memory space" }, { id: "b", text: "Allow traversal in both directions" }, { id: "c", text: "Sort data faster" }, { id: "d", text: "Store only integers" }] },
      { id: 5, question: "Which keyword handles exceptions in JavaScript?", options: [{ id: "a", text: "catch" }, { id: "b", text: "handle" }, { id: "c", text: "throw" }, { id: "d", text: "try...catch" }] },
      { id: 6, question: "What does 'flex-direction' do in CSS Flexbox?", options: [{ id: "a", text: "Sets item size" }, { id: "b", text: "Defines main axis direction" }, { id: "c", text: "Controls spacing" }, { id: "d", text: "Aligns along cross axis" }] },
      { id: 7, question: "Which is NOT a valid Git command?", options: [{ id: "a", text: "git push" }, { id: "b", text: "git stage" }, { id: "c", text: "git commit" }, { id: "d", text: "git branch" }] },
      { id: 8, question: "What is the output of 'typeof NaN' in JavaScript?", options: [{ id: "a", text: "string" }, { id: "b", text: "number" }, { id: "c", text: "undefined" }, { id: "d", text: "object" }] }
    ]
  },
  aptitude: {
    title: "Aptitude Assessment",
    themeColor: "#f59e0b",
    description: "Sharpen your logical reasoning, numerical ability, and verbal skills.",
    questions: [
      { id: 1, question: "If 15 men finish work in 20 days, how many days for 25 men?", options: [{ id: "a", text: "12 Days" }, { id: "b", text: "10 Days" }, { id: "c", text: "15 Days" }, { id: "d", text: "18 Days" }] },
      { id: 2, question: "Missing number in series: 2, 6, 12, 20, 30, ?", options: [{ id: "a", text: "40" }, { id: "b", text: "42" }, { id: "c", text: "44" }, { id: "d", text: "38" }] },
      { id: 3, question: "A train 140m long passes a 160m platform at 60 km/hr. Time?", options: [{ id: "a", text: "15s" }, { id: "b", text: "18s" }, { id: "c", text: "20s" }, { id: "d", text: "12s" }] },
      { id: 4, question: "If 'A' is brother of 'B', 'B' is sister of 'C', how is 'A' related to 'C'?", options: [{ id: "a", text: "Brother" }, { id: "b", text: "Father" }, { id: "c", text: "Cousin" }, { id: "d", text: "Uncle" }] },
      { id: 5, question: "What is the average of first 50 natural numbers?", options: [{ id: "a", text: "25.0" }, { id: "b", text: "25.5" }, { id: "c", text: "26.0" }, { id: "d", text: "24.5" }] },
      { id: 6, question: "Sells item for $240 at loss of 20%. Cost price?", options: [{ id: "a", text: "$300" }, { id: "b", text: "$280" }, { id: "c", text: "$320" }, { id: "d", text: "$290" }] },
      { id: 7, question: "Odd one out: 27, 64, 125, 144, 216?", options: [{ id: "a", text: "64" }, { id: "b", text: "144" }, { id: "c", text: "125" }, { id: "d", text: "27" }] },
      { id: 8, question: "If 1st Jan 2024 was Monday, what will 1st Jan 2025 be?", options: [{ id: "a", text: "Tuesday" }, { id: "b", text: "Wednesday" }, { id: "c", text: "Thursday" }, { id: "d", text: "None" }] }
    ]
  },
  practice: {
    title: "Practice Assessment",
    themeColor: "#10b981",
    description: "Quick daily practice to strengthen your understanding and confidence.",
    questions: [
      { id: 1, question: "Which Soft Skill is most valued by employers?", options: [{ id: "a", text: "Typing speed" }, { id: "b", text: "Emotional Intelligence" }, { id: "c", text: "Knowing 5 languages" }, { id: "d", text: "Advanced Excel" }] },
      { id: 2, question: "Best way to handle negative feedback?", options: [{ id: "a", text: "Ignore it" }, { id: "b", text: "Grow from it" }, { id: "c", text: "Defend immediately" }, { id: "d", text: "Resign" }] },
      { id: 3, question: "Time management is about...", options: [{ id: "a", text: "Working more hours" }, { id: "b", text: "Prioritizing tasks" }, { id: "c", text: "Multi-tasking" }, { id: "d", text: "No breaks" }] },
      { id: 4, question: "Active listening involves...", options: [{ id: "a", text: "Waiting to speak" }, { id: "b", text: "Concentrating on speaker" }, { id: "c", text: "Checking phone" }, { id: "d", text: "Agreeing blindly" }] },
      { id: 5, question: "Healthy way to manage work stress?", options: [{ id: "a", text: "Avoid hard tasks" }, { id: "b", text: "Regular exercise" }, { id: "c", text: "Late nights" }, { id: "d", text: "More caffeine" }] },
      { id: 6, question: "What is 'critical thinking'?", options: [{ id: "a", text: "Finding faults" }, { id: "b", text: "Objective analysis" }, { id: "c", text: "Being skeptical" }, { id: "d", text: "Memorizing" }] },
      { id: 7, question: "Team collaboration requires...", options: [{ id: "a", text: "Solo effort" }, { id: "b", text: "Communication and trust" }, { id: "c", text: "Competition" }, { id: "d", text: "Silence" }] },
      { id: 8, question: "SMART goals: S, M, A, R and ...?", options: [{ id: "a", text: "Technological" }, { id: "b", text: "Time-bound" }, { id: "c", text: "Theoretical" }, { id: "d", text: "Total" }] }
    ]
  },
  softskills: {
    title: "Soft Skills Profiler",
    themeColor: "#64748b",
    description: "Evaluate your leadership, teamwork, and resilience in workplace scenarios.",
    questions: [
      { id: 1, question: "How do you respond when a team member disagrees with your strategy?", options: [{ id: "a", text: "I argue for my point firmly" }, { id: "b", text: "I listen and seek a compromise" }, { id: "c", text: "I let the leader decide" }, { id: "d", text: "I work separately on my part" }] },
      { id: 2, question: "If a project is falling behind a tight deadline, what is your move?", options: [{ id: "a", text: "I work overtime alone" }, { id: "b", text: "I communicate with the lead for support" }, { id: "c", text: "I deprioritize non-essential tasks" }, { id: "d", text: "I keep working at normal pace" }] },
      { id: 3, question: "What is the most important element of an effective apology at work?", options: [{ id: "a", text: "Explaining why it happened" }, { id: "b", text: "Taking ownership without excuses" }, { id: "c", text: "Waiting for things to cool down" }, { id: "d", text: "Sending a quick email" }] },
      { id: 4, question: "When receiving negative feedback, you usually...", options: [{ id: "a", text: "Feel demotivated" }, { id: "b", text: "Analyze it for growth points" }, { id: "c", text: "Defend your work immediately" }, { id: "d", text: "Ignore it if you disagree" }] },
      { id: 5, question: "How do you handle a toxic or difficult coworker?", options: [{ id: "a", text: "I confront them directly" }, { id: "b", text: "I remain professional and neutral" }, { id: "c", text: "I avoid them entirely" }, { id: "d", text: "I complain to management" }] },
      { id: 6, question: "Integrity in the workplace means...", options: [{ id: "a", text: "Following every single rule" }, { id: "b", text: "Being honest even when it's hard" }, { id: "c", text: "Never making any mistakes" }, { id: "d", text: "Working the longest hours" }] },
      { id: 7, question: "What is your best leadership quality?", options: [{ id: "a", text: "Commanding respect" }, { id: "b", text: "Empowering others to succeed" }, { id: "c", text: "Always having the right answer" }, { id: "d", text: "Doing the work myself" }] },
      { id: 8, question: "How do you stay resilient during stressful periods?", options: [{ id: "a", text: "I work through it without breaks" }, { id: "b", text: "I practice mindfulness and balance" }, { id: "c", text: "I vent my frustration to others" }, { id: "d", text: "I withdraw from social contact" }] }
    ]
  },
  english: {
    title: "English Proficiency",
    themeColor: "#f43f5e",
    description: "Master professional communication, grammar, and verbal reasoning skills.",
    questions: [
      { id: 1, question: "Which of the following sentences is grammatically correct?", options: [{ id: "a", text: "She don't know the answer." }, { id: "b", text: "She doesn't know the answer." }, { id: "c", text: "She doesn't knows the answer." }, { id: "d", text: "She don't knows the answer." }] },
      { id: 2, question: "Choose the synonym for 'Eloquent':", options: [{ id: "a", text: "Confused" }, { id: "b", text: "Articulate" }, { id: "c", text: "Silent" }, { id: "d", text: "Simple" }] },
      { id: 3, question: "What is the correct formal salutation for someone you don't know?", options: [{ id: "a", text: "Hey there!" }, { id: "b", text: "To Whom It May Concern," }, { id: "c", text: "Dear Friend," }, { id: "d", text: "Hi Sir," }] },
      { id: 4, question: "Which word is an antonym of 'Transparent'?", options: [{ id: "a", text: "Clear" }, { id: "b", text: "Opaque" }, { id: "c", text: "Hidden" }, { id: "d", text: "Brilliant" }] },
      { id: 5, question: "Identify the noun in this sentence: 'The heavy rain lasted for three days.'", options: [{ id: "a", text: "Heavy" }, { id: "b", text: "Rain" }, { id: "c", text: "Lasted" }, { id: "d", text: "Three" }] },
      { id: 6, question: "Choose the correct spelling:", options: [{ id: "a", text: "Accomodation" }, { id: "b", text: "Accommodation" }, { id: "c", text: "Acomodation" }, { id: "d", text: "Accomodasion" }] },
      { id: 7, question: "Which phrase is common in a polite business rejection?", options: [{ id: "a", text: "We don't like you." }, { id: "b", text: "Unfortunately, we cannot proceed." }, { id: "c", text: "You failed the test." }, { id: "d", text: "Try someone else." }] },
      { id: 8, question: "What does the idiom 'Piece of cake' mean?", options: [{ id: "a", text: "Something delicious" }, { id: "b", text: "Something very easy" }, { id: "c", text: "Something expensive" }, { id: "d", text: "Something small" }] }
    ]
  },
  logic: {
    title: "Critical Thinking",
    themeColor: "#06b6d4",
    description: "Solve complex puzzles, logical riddles, and abstract pattern challenges.",
    questions: [
      { id: 1, question: "What comes next in the sequence: O, T, T, F, F, S, S, ...?", options: [{ id: "a", text: "N" }, { id: "b", text: "E" }, { id: "c", text: "T" }, { id: "d", text: "S" }] },
      { id: 2, question: "If all Bloops are Razzies and all Razzies are Jazzies, then all Bloops are Jazzies.", options: [{ id: "a", text: "True" }, { id: "b", text: "False" }, { id: "c", text: "Maybe" }, { id: "d", text: "Insufficient Info" }] },
      { id: 3, question: "A doctor gives you 3 pills and tells you to take one every half hour. How long will they last?", options: [{ id: "a", text: "1.5 hours" }, { id: "b", text: "1 hour" }, { id: "c", text: "2 hours" }, { id: "d", text: "30 minutes" }] },
      { id: 4, question: "Some months have 30 days, some have 31. How many have 28?", options: [{ id: "a", text: "1" }, { id: "b", text: "6" }, { id: "c", text: "12" }, { id: "d", text: "None" }] },
      { id: 5, question: "Which word does NOT belong with the others?", options: [{ id: "a", text: "Leopard" }, { id: "b", text: "Cougar" }, { id: "c", text: "Elephant" }, { id: "d", text: "Jaguar" }] },
      { id: 6, question: "If you have me, you want to share me. If you share me, you haven't got me. What am I?", options: [{ id: "a", text: "A secret" }, { id: "b", text: "A joke" }, { id: "c", text: "A coin" }, { id: "d", text: "A shadow" }] },
      { id: 7, question: "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", options: [{ id: "a", text: "22" }, { id: "b", text: "20" }, { id: "c", text: "23" }, { id: "d", text: "26" }] },
      { id: 8, question: "If Emily is 8, her brother is half her age. When Emily is 100, how old will her brother be?", options: [{ id: "a", text: "50" }, { id: "b", text: "96" }, { id: "c", text: "92" }, { id: "d", text: "46" }] }
    ]
  }
};

const CareerQuiz = () => {
  const { type = "career" } = useParams();
  const navigate = useNavigate();
  const quizData = QUIZ_DATA[type] || QUIZ_DATA.career;
  const QUESTIONS = quizData.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Auto-scroll to top on mount or type change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercentage = ((currentIndex) / QUESTIONS.length) * 100;
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const handleOptionSelect = (optionId) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
    setShowWarning(false);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
      setShowWarning(false);
    } else {
      // Award badge on completion
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const currentBadges = user.badges || [];
        if (!currentBadges.includes(type)) {
          user.badges = [...currentBadges, type];
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const quizStyles = `
    .quiz-container { max-width: 820px; margin: 0 auto; padding: 20px; }
    .quiz-header { text-align: left; margin-bottom: 30px; }
    .quiz-header h2 { font-size: 2.2rem; margin-bottom: 4px; color: ${quizData.themeColor}; }
    .quiz-progressMeta { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px; }
    .quiz-progressBarContainer { height: 10px; background: var(--border-color); border-radius: 20px; overflow: hidden; margin-bottom: 40px; }
    .quiz-progressBarFill { height: 100%; background: ${quizData.themeColor}; border-radius: 20px; transition: width 0.4s ease-out; box-shadow: 0 0 15px ${quizData.themeColor}cc; }
    .quiz-questionCard { background: var(--white); border-radius: 28px; padding: 40px; border: 1px solid var(--border-color); position: relative; }
    .quiz-questionNumber { font-size: 0.9rem; font-weight: 800; color: ${quizData.themeColor}; text-transform: uppercase; margin-bottom: 12px; }
    .quiz-questionText { font-size: 1.8rem; margin-bottom: 32px; color: var(--deep-navy); line-height: 1.4; }
    .quiz-optionsList { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
    .quiz-optionButton { display: flex; align-items: center; padding: 20px 24px; background: var(--white); border: 2px solid var(--border-color); border-radius: 16px; cursor: pointer; transition: all 0.3s; color: var(--text-primary); }
    .quiz-optionButton:hover { border-color: ${quizData.themeColor}; background: rgba(0,0,0,0.02); transform: translateX(8px); }
    .quiz-optionButton.selected { border-color: ${quizData.themeColor}; background: ${quizData.themeColor}11; }
    .quiz-optionLetter { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--soft-grey); font-weight: 800; margin-right: 16px; flex-shrink: 0; }
    .quiz-optionButton.selected .quiz-optionLetter { background: ${quizData.themeColor}; color: #fff; }
    .quiz-footer { display: flex; justify-content: space-between; padding-top: 32px; border-top: 1px solid var(--border-color); }
    .quiz-backBtn { background: none; border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 24px; color: var(--text-secondary); cursor: pointer; font-weight: 600; }
    .quiz-backBtn:hover:not(:disabled) { border-color: ${quizData.themeColor}; color: ${quizData.themeColor}; }
    .quiz-completionCard { text-align: center; padding: 60px 40px; background: var(--white); border-radius: 32px; border: 1px solid var(--border-color); }
  `;

  if (isFinished) {
    return (
      <div className="quiz-container">
        <style>{quizStyles}</style>
        <div className="quiz-completionCard">
          <CheckCircle size={80} color="var(--success-green)" style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>{quizData.title} Complete! 🎉</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 32 }}>
            {type === 'career' 
              ? "Great job! We've analyzed your responses and built your personalized career roadmap." 
              : `Excellent effort! You've successfully finished the ${quizData.title}.`}
          </p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '16px 40px', fontSize: '1.1rem', backgroundColor: quizData.themeColor, borderColor: quizData.themeColor, color: '#fff' }}
            onClick={() => navigate("/dashboard")}
          >
            {type === 'career' ? "View My Roadmap" : "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <style>{quizStyles}</style>
      <div className="quiz-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: quizData.themeColor, margin: 0 }}>{quizData.title}</h2>
          <button 
            className="quiz-backBtn" 
            onClick={() => navigate("/assessments")}
            style={{ fontSize: '0.8rem', padding: '8px 16px', borderStyle: 'dashed' }}
          >
            <X size={14} style={{ marginRight: 6 }} /> Cancel Test
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{quizData.description}</p>
      </div>

      <div className="quiz-progressWrapper">
        <div className="quiz-progressMeta">
          <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
          <span style={{ color: quizData.themeColor }}>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="quiz-progressBarContainer">
          <div className="quiz-progressBarFill" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className="quiz-questionCard">
        {showWarning && (
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: 12, fontWeight: 700, zIndex: 10 }}>
            Please select an option first!
          </div>
        )}
        <div className="quiz-questionNumber">Question {currentIndex + 1}</div>
        <h3 className="quiz-questionText">{currentQuestion.question}</h3>

        <div className="quiz-optionsList">
          {currentQuestion.options.map((opt) => (
            <button 
              key={opt.id} 
              className={`quiz-optionButton ${answers[currentQuestion.id] === opt.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt.id)}
            >
              <span className="quiz-optionLetter">{opt.id.toUpperCase()}</span>
              {opt.text}
            </button>
          ))}
        </div>

        <div className="quiz-footer">
          <button className="quiz-backBtn" onClick={handleBack} disabled={currentIndex === 0} style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}>
            <ArrowLeft size={18} style={{ marginRight: 8 }} /> Back
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            style={{ backgroundColor: quizData.themeColor, borderColor: quizData.themeColor, color: '#fff', padding: '12px 32px' }}
          >
            {isLastQuestion ? 'Finish' : 'Next'} <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerQuiz;
