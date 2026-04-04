import { useState, useRef, useEffect } from "react";
import { X, Send, Rocket } from "lucide-react";


// ── Robot FAB Icon ────────────────────────────────────────────────────────────
const RobotIcon = () => (
  <svg width="64" height="74" viewBox="0 0 65 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="rustTexture" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.47 0 0 0 0 0.28 0 0 0 0 0.1 0 0 0 0.4 0" />
        <feComposite operator="in" in2="SourceGraphic" />
        <feBlend mode="multiply" in2="SourceGraphic" />
      </filter>
      
      <linearGradient id="bodyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBDF4B" />
        <stop offset="100%" stopColor="#C49B06" />
      </linearGradient>

      <radialGradient id="lensDepth" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="70%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#082F49" />
      </radialGradient>
    </defs>

    {/* Treads */}
    <g transform="translate(10, 52)">
       <path d="M5 0H40L45 15H0L5 0Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1"/>
    </g>

    {/* Arms */}
    <path d="M18 36L6 48" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
    <g className="right-arm" style={{ transformOrigin: '47px 36px' }}>
      <path d="M47 36L59 48" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Body */}
    <rect x="18" y="30" width="29" height="26" rx="2" fill="url(#bodyYellow)" stroke="#78350F" strokeWidth="1" filter="url(#rustTexture)"/>
    <rect x="23" y="34" width="19" height="10" rx="1" fill="#1E293B" fillOpacity="0.8"/>
    
    {/* Neck (Shortened for 40-size structure) */}
    <rect x="29" y="27" width="6" height="3" fill="#475569" />

    {/* Binocular Eyes */}
    <g transform="translate(32, 16)">
      <g transform="rotate(-12 -2 0)">
        <path d="M-22 -8C-22 -11 -20 -13 -17 -13H-2C0 -13 2 -11 2 -8V6C2 9 0 11 -2 11H-17C-20 11 -22 9 -22 6V-8Z" fill="#FBDF4B" stroke="#78350F" filter="url(#rustTexture)"/>
        <circle cx="-10" cy="-1" r="7" fill="#0F172A"/>
        <circle className="eye" cx="-10" cy="-1" r="5" fill="url(#lensDepth)" style={{ transformOrigin: '-10px -1px' }}/>
      </g>
      <g transform="rotate(12 2 0)">
        <path d="M2 -8C2 -11 4 -13 7 -13H22C24 -13 26 -11 26 -8V6C26 9 24 11 22 11H7C4 11 2 9 2 6V-8Z" fill="#FBDF4B" stroke="#78350F" filter="url(#rustTexture)"/>
        <circle cx="14" cy="-1" r="7" fill="#0F172A"/>
        <circle className="eye" cx="14" cy="-1" r="5" fill="url(#lensDepth)" style={{ transformOrigin: '14px -1px' }}/>
      </g>
    </g>
  </svg>
);

// ── Pilot Logo (Mini Head) ───────────────────────────────────────────────────
const PilotLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 65 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(32, 14)">
      <g transform="rotate(-12 -2 0)">
        <path d="M-22 -8C-22 -11 -20 -13 -17 -13H-2C0 -13 2 -11 2 -8V6C2 9 0 11 -2 11H-17C-20 11 -22 9 -22 6V-8Z" fill="#FBDF4B" stroke="#78350F" filter="url(#rustTexture)"/>
        <circle cx="-10" cy="-1" r="7" fill="#0F172A"/>
        <circle cx="-10" cy="-1" r="5" fill="#0EA5E9" />
      </g>
      <g transform="rotate(12 2 0)">
        <path d="M2 -8C2 -11 4 -13 7 -13H22C24 -13 26 -11 26 -8V6C26 9 24 11 22 11H7C4 11 2 9 2 6V-8Z" fill="#FBDF4B" stroke="#78350F" filter="url(#rustTexture)"/>
        <circle cx="14" cy="-1" r="7" fill="#0F172A"/>
        <circle cx="14" cy="-1" r="5" fill="#0EA5E9" />
      </g>
    </g>
  </svg>
);

// ── Knowledge Base ────────────────────────────────────────────────────────────
// IMPORTANT: reschedule entry is BEFORE booking to ensure correct matching
const KB = [
  { patterns: ["hello","hi","hey","hiya","howdy","sup","namaste"],
    response: "Hey there! 👋 I'm Pilot — your AI study buddy and CareerPilot guide! Feel free to ask me anything — study doubts, coding questions, career stuff, or how to use the app. What's on your mind?" },

  { patterns: ["who are you","what are you","your name","introduce yourself"],
    response: "I'm Pilot 🚀 — an AI assistant built right into CareerPilot! I love chatting about study topics like Maths, Science, Coding, History, and helping you navigate the app too — bookings, mentors, profile setup, everything. Just ask! 😄" },

  // ── reschedule BEFORE booking ──
  { patterns: ["reschedule","change booking","move session","change date","change time","reschudle","change my booking","want to reschedule","how to reschedule"],
    response: "Oh sure, rescheduling is pretty simple! 😊 Just head to your Dashboard and click on \"Manage Bookings\". Find the upcoming session you want to move, hit the Reschedule button next to it, pick a new date and time, then confirm. That's all there is to it! Let me know if you get stuck anywhere." },

  { patterns: ["book a","how to book","book mentor","booking","schedule session","appointment","reserve","want to book"],
    response: "Booking a mentor is super easy! 😊 Head over to the Mentors section from the top menu, find someone who looks like a great fit, and click Book a Session. You'll choose a topic, date, and time — then hit Confirm and you're sorted! You can manage everything from your Dashboard anytime." },

  { patterns: ["mentor","find mentor","browse mentor","marketplace","expert"],
    response: "Great idea to connect with a mentor! 🧑‍💼 Go to the Mentors section from the navigation bar — there you'll see a bunch of industry experts across all kinds of fields like tech, design, finance, and more. Each profile tells you what they specialise in so you can pick the best match!" },

  { patterns: ["career quiz","quiz","career test","assessment"],
    response: "The Career Quiz is honestly a great starting point! 🎯 It helps map your personality and strengths to real career paths. Just head to the Explore section and take it — only takes a few minutes and the recommendations it gives are really personalised!" },

  { patterns: ["dashboard","manage booking"],
    response: "Your Dashboard is your personal hub for everything! 📊 Check upcoming bookings, update your profile, track your progress, access certifications — it's all there from one place. Just click Dashboard from the top menu." },

  { patterns: ["profile","edit profile","update profile","change picture","bio","experience"],
    response: "Updating your profile is simple! ✏️ Go to your Dashboard and click your profile or the edit icon. You can add a bio, upload a profile photo, fill in education and work experience, and choose your interests. A complete profile really helps mentors understand you better!" },

  { patterns: ["sign up","register","create account","join careerpilot"],
    response: "Signing up is free and pretty quick! 🚀 Click Sign Up in the top navigation, enter your name, email, and phone number, then continue to your academic details and password. After that you'll go through the Career Quiz which personalises everything for you — pretty cool right! 😄" },

  { patterns: ["login","sign in","log in"],
    response: "Easy one! 🔐 Just click Login in the top-right corner, enter your email and password, and you're in. Ping me if something's not working properly!" },

  { patterns: ["certification","certificate","certify","credential","badge"],
    response: "Certifications are a brilliant way to stand out! 🏆 Check out the Certifications section from the main menu — programs are tailored to different career paths. Complete the coursework, pass the assessment, and you'll earn a verified credential you can show off everywhere!" },

  { patterns: ["service","services","what do you offer","features","what can this app do"],
    response: "CareerPilot is packed with good stuff! 😄 You've got the Career Quiz to discover your ideal path, a Mentor Marketplace to connect with experts, session booking for 1-on-1 guidance, Certifications you can earn, an Exam Hub for structured prep, and Career Articles to stay inspired. All in one place!" },

  { patterns: ["cost","price","free","paid","subscription","fee"],
    response: "CareerPilot is completely free to join 😊 Browsing mentors, the career quiz, and reading articles are all free. Some specific mentor sessions or certification programs might have fees set by the provider, so just check the individual listing for those details." },

  { patterns: ["contact","support","report","issue","bug","problem with app"],
    response: "Sorry to hear something's not working smoothly! 😟 Please use the Contact section on the site or reach out to our team directly. We typically get back within 24 hours and genuinely love hearing feedback!" },

  // ── MATHS ──
  { patterns: ["algebra","algebraic","linear equation","what is algebra"],
    response: "Algebra is basically the part of maths where we use letters like x and y to stand in for unknown values and then figure out what they are! 📐 So something like 2x + 3 = 7 means you solve to find x = 2. The golden rule is always do the same operation to both sides of the equation. Want me to work through a specific problem with you?" },

  { patterns: ["pythagoras","pythagorean","right triangle","hypotenuse"],
    response: "The Pythagorean Theorem — classic! 📐 In a right-angled triangle, a² + b² = c² where c is the hypotenuse (the longest side). So if the two shorter sides are 3 and 4, then 9 + 16 = 25, meaning c = 5. The 3-4-5 triple comes up so often it's worth remembering! Want a practice problem? 😊" },

  { patterns: ["calculus","derivative","integral","differentiation","integration"],
    response: "Calculus is about change and accumulation — once it clicks it's so satisfying! 😄 Derivatives tell you how fast something is changing (like the slope at a point), while integrals tell you the total accumulated amount (like area under a curve). The core derivative rule is d/dx(xⁿ) = nxⁿ⁻¹, and for integrals it flips: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. What specific part is tripping you up?" },

  { patterns: ["trigonometry","sine","cosine","tangent","sin cos tan","trig"],
    response: "Trig is all about the relationships between angles and sides in triangles! 📐 Remember SOH-CAH-TOA — Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. Values like sin(30°) = 0.5, sin(90°) = 1, cos(45°) = √2/2 are worth knowing by heart. Is there a specific identity or problem you're working through?" },

  { patterns: ["probability","chances","likelihood","statistics","permutation","combination"],
    response: "Probability tells us how likely something is to happen! 🎲 The formula is P(event) = favourable outcomes / total outcomes. Rolling a 3 on a die is 1/6, about 16.7%. For permutations order matters (nPr = n!/(n-r)!), for combinations it doesn't (nCr = n!/(r!(n-r)!)). Want an example worked out step by step?" },

  { patterns: ["geometry","area","volume","perimeter","shapes","circle"],
    response: "Geometry is all about shapes and space! 📐 A few formulas you'll use constantly — area of a circle is πr², area of a triangle is ½ × base × height, circumference of a circle is 2πr. For 3D stuff: cylinder volume is πr²h and a sphere is (4/3)πr³. Which shape or problem are you working on?" },

  // ── PHYSICS ──
  { patterns: ["newton","laws of motion","force","acceleration","velocity","speed","momentum"],
    response: "Newton's laws of motion are the foundation of mechanics! ⚡ The first law says objects keep doing what they're doing unless a force acts on them (that's inertia). The second gives us F = ma — force equals mass times acceleration. The third says every action has an equal and opposite reaction. Equations like v = u + at and s = ut + ½at² are the ones you'll actually plug numbers into. What problem are you working through?" },

  { patterns: ["gravity","gravitational","free fall","weight"],
    response: "Gravity is the force that keeps everything grounded! 🌍 On Earth it's 9.8 m/s² downward. Your weight is just mass times gravity — W = mg. Galileo showed that all objects fall at the same rate when you ignore air resistance, which is honestly a bit mind-blowing. On the Moon it's only 1.6 m/s² so you'd weigh about six times less there! Anything specific you want to solve?" },

  { patterns: ["electricity","ohm","current","voltage","resistance","circuit","electric"],
    response: "Electricity becomes intuitive once Ohm's Law clicks! ⚡ V = IR — Voltage = Current × Resistance. Power is P = VI. In a series circuit the current is the same everywhere but voltage splits across components. In a parallel circuit the voltage is the same but current splits. Resistors in series add up directly, but in parallel you take the reciprocal sum. What are you stuck on?" },

  { patterns: ["wave","frequency","wavelength","sound","light","optics"],
    response: "Waves are really cool! 🌊 The key relationship is v = fλ — wave speed equals frequency times wavelength. Sound travels at about 343 m/s in air. Light travels at 3 × 10⁸ m/s. For optics, remember the mirror formula: 1/f = 1/v + 1/u. Lenses use the same formula but refraction changes the direction of light rather than reflecting it. What specifically are you studying?" },

  // ── CHEMISTRY ──
  { patterns: ["chemistry","atom","molecule","compound","chemical","reaction","element"],
    response: "Chemistry is the study of matter and how it transforms! ⚗️ Atoms are the smallest building blocks of elements. When atoms bond you get molecules — like H₂O is two hydrogen atoms bonded to one oxygen. One mole of anything contains 6.022 × 10²³ particles (Avogadro's number), which is key for calculations. What specific reaction, formula, or concept are you stuck on?" },

  { patterns: ["periodic table","group","period","valence","noble gas","metals","nonmetals"],
    response: "The periodic table is so beautifully organised! 🧪 Elements in the same column (group) have the same number of outer electrons and similar properties. Rows (periods) tell you how many electron shells there are. Moving across a period, atomic radius shrinks, electronegativity goes up, and ionisation energy increases. Group 18 are noble gases — they're chemically stable because their outer shell is completely full. What do you want to know more about?" },

  { patterns: ["acid","base","ph","neutral","alkali","salt"],
    response: "Acids and bases are all about hydrogen ions! ⚗️ An acid releases H⁺ ions in solution, a base releases OH⁻ ions. pH runs from 0 to 14 — below 7 is acidic, 7 is neutral, above 7 is basic. When an acid and base react they form a salt and water — that's neutralisation. Strong acids like HCl are fully ionised, weak acids like acetic acid are only partially ionised. What specific aspect are you studying?" },

  // ── BIOLOGY ──
  { patterns: ["biology","cell","mitosis","meiosis","dna","genetics","photosynthesis","evolution"],
    response: "Biology is the study of everything alive — and it's endlessly fascinating! 🌱 Mitosis creates 2 identical daughter cells for growth and repair. Meiosis creates 4 genetically varied cells for reproduction. DNA is the instruction manual of life, with base pairs A-T and G-C. Photosynthesis converts CO₂ + H₂O + sunlight into glucose and oxygen. Which topic or concept would you like to dig into?" },

  { patterns: ["human body","heart","lungs","kidney","organ","digestive","nervous system","brain"],
    response: "The human body is incredibly well-designed! 🫀 The heart pumps blood around 60-100 times per minute. The lungs take in oxygen and expel CO₂. The kidneys filter about 180 litres of blood per day! The nervous system — brain and nerves — is the body's communication network, operating through electrical signals. Which organ or system are you studying?" },

  // ── CODING ──
  { patterns: ["python","coding in python","python tutorial","learn python"],
    response: "Python is such a great language to learn! 🐍 Its syntax is clean and beginner-friendly. Key things to start with: variables (x = 5), lists ([1,2,3]), for loops, functions (def greet():), and then classes for OOP. Python is used everywhere — data science, AI, web backends, scripting. What Python concept are you working on?" },

  { patterns: ["javascript","js","react","node","frontend","web development"],
    response: "JavaScript is the language of the web! ⚡ Everything interactive on a webpage is JavaScript. Key concepts — variables (let/const), functions, arrays, objects, and asynchronous code (callbacks, promises, async/await). React builds on top of JS with a component-based model. This entire CareerPilot app is built with React! What JS concept are you trying to wrap your head around?" },

  { patterns: ["programming","coding","code","algorithm","software","developer"],
    response: "Love coding chat! 💻 The most important concepts to nail are: variables and data types, control flow (if/else, loops), functions, and then data structures and OOP. The best way to learn is to build things — even small projects teach you so much more than reading. What language or concept are you working on?" },

  { patterns: ["data structure","array","linked list","stack","queue","tree","graph"],
    response: "Data structures are how you organise data to be useful and efficient! 🗂️ Arrays give you O(1) access by index. Stacks are LIFO (last in, first out — like a pile of plates). Queues are FIFO (first in, first out — like a queue at a shop). Trees are hierarchical, great for searching. Graphs connect nodes via edges and model networks, maps, and social connections. Which one do you want to go deeper on?" },

  { patterns: ["oop","object oriented","class","inheritance","polymorphism","encapsulation"],
    response: "OOP changes the way you think about code! 🏗️ The four pillars: Encapsulation (keeping data and methods bundled), Inheritance (child class gets the parent's features), Polymorphism (same method name, different behaviour depending on the class), and Abstraction (hiding complexity). Think of a Dog class that inherits from Animal — it gets speak() but overrides it to say 'Woof!' instead of the default. What's confusing you about it?" },

  // ── HISTORY ──
  { patterns: ["world war","ww1","ww2","world war 1","world war 2","history"],
    response: "History is so gripping! 🌍 WW1 (1914–1918) started with the assassination of Archduke Franz Ferdinand and ended with the Treaty of Versailles, completely redrawing the map of Europe. WW2 (1939–1945) began with Germany's invasion of Poland and ended with Allied victory — including the devastatingly consequential atomic bombs on Hiroshima and Nagasaki. Want to go deeper on any event, person, or country from either war?" },

  { patterns: ["india","indian history","mughal","british india","independence","gandhi","nehru"],
    response: "Indian history is incredibly rich! 🇮🇳 Starting way back with the Indus Valley Civilisation around 3000 BCE, then the Maurya Empire and Ashoka's spread of Buddhism, the Mughal Empire that gave us the Taj Mahal, and then British colonial rule from 1858 until independence on 15 August 1947 — won through the tireless work of Gandhi, Nehru, Bhagat Singh, Dr. Ambedkar and many others. Which period or person are you studying?" },

  // ── ENGLISH ──
  { patterns: ["grammar","tense","parts of speech","essay","writing","english","noun","verb"],
    response: "Oh I love grammar chat! 📝 The core parts of speech are nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, and interjections. For tenses, the three main families are simple (I write/wrote/will write), progressive (I am/was/will be writing), and perfect (I have/had/will have written). For essays — a clear intro with your thesis, one main idea per body paragraph with evidence, and a strong conclusion. What are you working on specifically?" },

  // ── STUDY TIPS ──
  { patterns: ["study tip","how to study","memorize","focus","concentrate","revision","learn better","memory"],
    response: "Ooh I love study strategy chat! 📚 The most powerful technique is Active Recall — instead of re-reading, close the book and try to recall what you just learned. Pair that with Spaced Repetition (reviewing the same content after 1 day, then 3 days, then a week) and the retention is incredible. The Pomodoro method (25 mins focused work, 5 min break) also really helps with concentration. And please don't underestimate sleep — memories consolidate while you sleep, so pulling all-nighters is counterproductive! What are you studying?" },

  { patterns: ["exam prep","board exam","jee","neet","upsc","test preparation","competitive exam","jee prep","neet prep"],
    response: "Exam season is stressful but very manageable with the right approach! 💪 The single most effective thing is past papers — patterns repeat more than most people realise. Know your syllabus inside out, focus on high-weightage topics first, and always practise under timed conditions. For JEE it's about deep conceptual understanding, not memorisation. For NEET, biology diagrams and processes are really key. For UPSC, NCERTs and daily newspaper reading are non-negotiable. What exam are you prepping for?" },

  // ── MISC ──
  { patterns: ["help","what can you do","what do you know","topics","what do you cover"],
    response: "Happy to help! 😄 Here's what I can chat about — on the study side: Maths (algebra, calculus, trig, geometry, probability), Physics (Newton's laws, electricity, gravity, waves), Chemistry (atoms, periodic table, acids/bases), Biology (cells, DNA, photosynthesis, human body), Coding (Python, JavaScript, OOP, data structures), History (world wars, Indian history), and English (grammar, essay writing). On the CareerPilot side I can help with bookings, mentors, profile, quiz, certifications and anything about the app. What do you need?" },

  { patterns: ["thanks","thank you","thx","ty","appreciate","helpful","awesome","great"],
    response: "Aww that makes me happy! 🌟 You're so welcome. Come back any time more doubts pop up — I'm always here for you 🚀" },

  { patterns: ["bye","goodbye","see you","later","ciao"],
    response: "Bye! 👋 Keep going — you're doing great! I'll be right here whenever you need me 🚀✨" },
];

const QUICK_REPLIES = ["How to reschedule? 📅", "Explain Algebra 📐", "Python basics 💻", "Study tips 📚"];

// ── AI Engine ─────────────────────────────────────────────────────────────────
function getAIResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some((p) => lower.includes(p))) return entry.response;
  }
  return "That's a great question and I want to make sure I give you a helpful answer! 🤔 Could you rephrase it a bit? Or type \"help\" to see all the topics I can chat about — Maths, Science, Coding, History, career stuff, and more. I'm here for it all! 😄";
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderMessage(text) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i} style={{ display: "block", lineHeight: "1.65" }}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} style={{ color: "#facc15" }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </span>
    );
  });
}

function TypingBubble() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 2px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: "7px", height: "7px", background: "#64748b", borderRadius: "50%",
          display: "inline-block",
          animation: `aiBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Widget ────────────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Hide welcome bubble after 15 seconds of inactivity
  useEffect(() => {
    if (!open) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 15000);
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(false);
    }
  }, [open]);

  const wasMoved = useRef(false);
  const startCoords = useRef({ x: 0, y: 0 });
  
  // Draggable State - Reset default to bottom-right with safe margins
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("chat-pos");
    const initial = { x: window.innerWidth - 100, y: window.innerHeight - 110 };
    if (!saved) return initial;
    try {
      const pos = JSON.parse(saved);
      // Force into safe 32px bounds if screen size changed or bounds tightened
      return {
        x: Math.max(32, Math.min(window.innerWidth - 100, pos.x)),
        y: Math.max(32, Math.min(window.innerHeight - 110, pos.y))
      };
    } catch (e) { return initial; }
  });
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem("chat-pos", JSON.stringify(position));
  }, [position]);

  const onMouseDown = (e) => {
    if (open) return;
    setIsDragging(false);
    wasMoved.current = false;
    startCoords.current = { x: e.clientX, y: e.clientY };
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    
    const onMouseMove = (moveEvent) => {
      const dist = Math.sqrt(
        Math.pow(moveEvent.clientX - startCoords.current.x, 2) + 
        Math.pow(moveEvent.clientY - startCoords.current.y, 2)
      );
      if (dist > 5) wasMoved.current = true;

      const newX = Math.max(32, Math.min(window.innerWidth - 112, moveEvent.clientX - dragStartPos.current.x));
      setPosition({ x: newX, y: moveEvent.clientY - dragStartPos.current.y }); // Free vertical move with 32px safe-x
      setIsDragging(true);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onTouchStart = (e) => {
    if (open) return;
    setIsDragging(false);
    wasMoved.current = false;
    const touch = e.touches[0];
    startCoords.current = { x: touch.clientX, y: touch.clientY };
    dragStartPos.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };

    const onTouchMove = (moveEvent) => {
      const t = moveEvent.touches[0];
      const dist = Math.sqrt(
        Math.pow(t.clientX - startCoords.current.x, 2) + 
        Math.pow(t.clientY - startCoords.current.y, 2)
      );
      if (dist > 5) wasMoved.current = true;

      const newX = Math.max(32, Math.min(window.innerWidth - 112, t.clientX - dragStartPos.current.x));
      setPosition({ x: newX, y: touch.clientY - dragStartPos.current.y }); 
      setIsDragging(true);
    };

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      setIsDragging(false);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  const snapToEdge = () => {
    setIsDragging(false);
    setIsSnapping(true);
    const midX = window.innerWidth / 2;
    const targetX = position.x < midX ? 32 : window.innerWidth - 100;
    setPosition(prev => ({ ...prev, x: targetX }));
    
    // Clear snapping state after transition
    setTimeout(() => setIsSnapping(false), 400);
  };

  const handleFabClick = () => {
    if (!wasMoved.current) {
      handleOpen();
    }
  };

  const [messages, setMessages] = useState([{
    role: "ai",
    text: "Hey! I'm Pilot 🚀\nAsk me any study doubt or career question — Maths, Science, Coding, History, how to use CareerPilot — I'm here for all of it! 😄",
    id: 1,
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);





  const handleOpen = () => {
    setOpen((o) => !o);
  };

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: msg, id: Date.now() }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [...p, { role: "ai", text: getAIResponse(msg), id: Date.now() + 1 }]);
    }, 700 + Math.random() * 600);
  };

  const css = `
    @keyframes aiBounce {
      0%,80%,100%{transform:translateY(0);opacity:.35;}
      40%{transform:translateY(-7px);opacity:1;}
    }
    @keyframes panelIn {
      from{opacity:0;transform:translateY(18px) scale(.96);}
      to{opacity:1;transform:translateY(0) scale(1);}
    }
    @keyframes fabPulse {
      0%{box-shadow:0 0 0 0 rgba(250,204,21,.55);}
      70%{box-shadow:0 0 0 16px rgba(250,204,21,0);}
      100%{box-shadow:0 0 0 0 rgba(250,204,21,0);}
    }
    @keyframes msgSlide {
      from{opacity:0;transform:translateY(8px);}
      to{opacity:1;transform:translateY(0);}
    }
    @keyframes robotBlink {
      0%, 45%, 55%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.1); }
    }
    @keyframes robotBlinkFast {
      0%, 10%, 20%, 30%, 100% { transform: scaleY(1); }
      5%, 15%, 25% { transform: scaleY(0.1); }
    }
    .eye { 
      transition: transform 0.1s ease;
    }
    .blink .eye {
      animation: robotBlinkFast 2s infinite;
    }
    .cp-fab:hover .right-arm {
      animation: handWave 0.6s ease-in-out infinite alternate;
    }
    @keyframes handWave {
      from { transform: rotate(0deg); }
      to { transform: rotate(-60deg); }
    }
    .dragging .eye {
      transform: scaleY(0.1);
    }
    .cp-fab{
      position:fixed;bottom:26px;right:26px;z-index:9999;
      width:80px;height:80px;
      background:transparent;
      border:none;
      cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.4));
      transition:all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .cp-welcome-popup {
      position: absolute;
      top: -45px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(251, 223, 75, 0.6);
      color: #FBDF4B;
      padding: 8px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 0 20px rgba(251, 223, 75, 0.1);
      animation: floatPopup 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28), bounceBubble 2s infinite ease-in-out;
      z-index: 10000;
    }
    .cp-welcome-popup.on-left { left: 0; --tx: 0%; transform: none; }
    .cp-welcome-popup.on-right { left: auto; right: 0; --tx: 0%; transform: none; }

    .cp-welcome-popup::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid rgba(15, 23, 42, 0.95);
    }
    .cp-welcome-popup.on-left::after { left: 34px; transform: translateX(-50%); }
    .cp-welcome-popup.on-right::after { left: auto; right: 34px; transform: translateX(50%); }

    @keyframes bounceBubble {
      0%, 100% { transform: translateY(0) translateX(var(--tx, -50%)); }
      50% { transform: translateY(-5px) translateX(var(--tx, -50%)); }
    }
    @keyframes floatPopup {
      from { opacity: 0; transform: translateY(10px) translateX(var(--tx, -50%)); }
      to { opacity: 1; transform: translateY(0) translateX(var(--tx, -50%)); }
    }
    .cp-fab:hover{transform:scale(1.1) translateY(-5px); }
    .cp-fab::before {
      content: '';
      position: absolute;
      bottom: 5px; width: 40px; height: 10px;
      background: rgba(0,0,0,0.2);
      filter: blur(5px);
      border-radius: 50%;
      z-index: -1;
      animation: shadowPulse 2s infinite ease-in-out;
    }
    @keyframes shadowPulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.3); opacity: 0.1; }
    }
    .cp-panel{
      position:fixed;bottom:100px;right:26px;z-index:9999;
      width:380px;height:560px;
      border-radius:24px;overflow:hidden;
      display:flex;flex-direction:column;
      background:rgba(6, 14, 30, 0.85);
      backdrop-filter: blur(25px);
      border:1px solid rgba(255,255,255,.1);
      box-shadow:0 40px 100px rgba(0,0,0,.8), 0 0 40px rgba(250, 204, 21, 0.05);
      animation:panelIn .35s cubic-bezier(.16,1,.3,1) forwards;
    }
    .cp-hdr{
      display:flex;align-items:center;gap:12px;
      padding:16px 20px;
      background:rgba(15, 30, 58, 0.4);
      border-bottom:1px solid rgba(255,255,255,.08);
      flex-shrink:0;
    }
    .cp-hdr-name{font-weight:900;color:#fff;font-size:1.1rem;letter-spacing:.02em;}
    .cp-hdr-status{font-size:.75rem;color:#facc15;font-weight:600;display:flex;align-items:center;gap:6px;margin-top:1px;}
    .cp-dot{width:8px;height:8px;border-radius:50%;background:#facc15;display:inline-block;box-shadow: 0 0 8px #facc15;}
    .cp-row.ai .cp-bubble{
      background:rgba(255,255,255,0.05);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .cp-row.user .cp-bubble{
      background: linear-gradient(135deg, #EAB308 0%, #D97706 100%);
      box-shadow: 0 4px 15px rgba(234, 179, 8, 0.3);
      color: #0f172a;
    }
    .cp-x{background:rgba(255,255,255,.06);border:none;color:#94a3b8;cursor:pointer;padding:6px;border-radius:9px;display:flex;transition:all .18s;}
    .cp-x:hover{background:rgba(255,255,255,.12);color:#fff;}
    .cp-msgs{
      flex:1;overflow-y:auto;padding:14px 14px 8px;
      display:flex;flex-direction:column;gap:10px;
      scrollbar-width:thin;scrollbar-color:#1e293b transparent;
    }
    .cp-msgs::-webkit-scrollbar{width:4px;}
    .cp-msgs::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px;}
    .cp-row{display:flex;align-items:flex-end;gap:7px;}
    .cp-row.user{flex-direction:row-reverse;}
    .cp-av{
      width:30px;height:30px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;font-size:.78rem;font-weight:700;
    }
    .cp-av.ai{background:linear-gradient(135deg,#facc15,#7c3aed);}
    .cp-av.user{background:#1e293b;color:#94a3b8;}
    .cp-bubble{
      max-width:84%;padding:9px 13px;
      font-size:.855rem;line-height:1.55;
      word-break:break-word;border-radius:16px;
      animation:msgSlide .22s ease forwards;
    }
    .cp-bubble.ai{
      background:rgba(30,41,59,.85);
      border:1px solid rgba(255,255,255,.06);
      color:#e2e8f0;border-bottom-left-radius:4px;
    }
    .cp-bubble.user{
      background:linear-gradient(135deg,#facc15,#f97316);
      color:#0f1726;font-weight:600;border-bottom-right-radius:4px;
    }
    .cp-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;}
    .cp-chip{
      padding:5px 12px;border-radius:999px;font-size:.78rem;
      background:transparent;border:1px solid rgba(250,204,21,.35);
      color:#facc15;cursor:pointer;font-family:var(--font-primary);
      transition:all .18s;white-space:nowrap;
    }
    .cp-chip:hover{background:rgba(250,204,21,.12);border-color:#facc15;}
    .cp-footer{padding:10px 12px 12px;background:#060e1e;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0;}
    .cp-irow{
      display:flex;align-items:center;gap:8px;
      background:#0f1e3a;border:1px solid rgba(255,255,255,.09);
      border-radius:13px;padding:6px 8px 6px 13px;transition:border-color .2s;
    }
    .cp-irow:focus-within{border-color:rgba(250,204,21,.5);}
    .cp-input{
      flex:1;background:none;border:none;outline:none;
      color:#f1f5f9;font-size:.88rem;font-family:var(--font-primary);
    }
    .cp-input::placeholder{color:#334155;}
    .cp-send{
      width:34px;height:34px;border-radius:10px;
      background:linear-gradient(135deg,#facc15,#f97316);
      color:#0f172a;border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:all .18s;flex-shrink:0;
    }
    .cp-send:hover{transform:scale(1.06);}
    .cp-send:disabled{opacity:.35;cursor:not-allowed;transform:none;}
    .cp-hint{text-align:center;font-size:.7rem;color:#334155;margin-top:6px;}
    /* ── Tooltip ── */
    @keyframes tooltipPop {
      0%{opacity:0;transform:translateY(10px) scale(.92);}
      60%{transform:translateY(-3px) scale(1.02);}
      100%{opacity:1;transform:translateY(0) scale(1);}
    }
    @keyframes tooltipBounce {
      0%,100%{transform:translateY(0);}
      50%{transform:translateY(-4px);}
    }
    .cp-tooltip-wrap{
      position:fixed;bottom:98px;right:18px;z-index:9998;
      animation:tooltipPop .45s cubic-bezier(.16,1,.3,1) forwards;
    }
    .cp-tooltip{
      background:linear-gradient(135deg,#1e293b,#0f172a);
      border:1px solid rgba(250,204,21,.35);
      border-radius:16px;padding:12px 14px 12px 12px;
      display:flex;align-items:flex-start;gap:10px;
      box-shadow:0 12px 40px rgba(0,0,0,.5),0 0 0 1px rgba(250,204,21,.1);
      max-width:220px;
      animation:tooltipBounce 2s 1.5s ease-in-out infinite;
    }
    .cp-tooltip-robot{
      width:36px;height:36px;border-radius:12px;
      background:linear-gradient(135deg,#facc15,#f97316);
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;
    }
    .cp-tooltip-text{flex:1;}
    .cp-tooltip-title{font-size:.82rem;font-weight:700;color:#f1f5f9;margin-bottom:2px;}
    .cp-tooltip-sub{font-size:.75rem;color:#94a3b8;line-height:1.4;}
    .cp-tooltip-close{
      background:none;border:none;color:#64748b;cursor:pointer;
      padding:0;line-height:1;font-size:14px;flex-shrink:0;margin-top:-2px;
    }
    .cp-tooltip-close:hover{color:#f1f5f9;}
    /* Arrow pointing down */
    .cp-tooltip::after{
      content:'';position:absolute;bottom:-8px;right:28px;
      border-left:8px solid transparent;border-right:8px solid transparent;
      border-top:8px solid rgba(250,204,21,.35);
    }
    .cp-tooltip-wrap{position:relative;}
    @media(max-width:430px){
      .cp-panel{width:calc(100vw - 24px);right:12px;bottom:86px;}
      .cp-fab{right:14px;bottom:14px;}
      .cp-tooltip-wrap{right:12px;bottom:90px;}
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* FAB — Robot Icon */}
      <button 
        className={`cp-fab ${isHovered || isDragging ? 'blink' : ''} ${isDragging ? 'dragging' : ''}`} 
        onClick={handleFabClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Move me or click to Chat! 🤖" 
        aria-label="Open Pilot AI chat"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          bottom: 'auto',
          right: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isSnapping ? 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
        }}
      >
        {(showWelcome || isHovered) && !open && (
          <div className={`cp-welcome-popup ${position.x < window.innerWidth / 2 ? 'on-left' : 'on-right'}`}>
             {isHovered ? "Hello! 🖐️" : "I'm WALL-E! 🖐️"}
          </div>
        )}
        {open ? <X size={24} color="#0f172a" /> : <RobotIcon />}
      </button>

      {open && (
        <div className="cp-panel" style={{
          left: Math.min(window.innerWidth - 390, Math.max(20, position.x - 308)),
          top: Math.max(20, position.y - 560),
          bottom: 'auto',
          right: 'auto'
        }}>
          <div className="cp-hdr">
            <PilotLogo size={42} />
            <div className="cp-hdr-info">
              <div className="cp-hdr-name">Pilot AI ✨</div>
              <div className="cp-hdr-status"><span className="cp-dot" /> Online · Study help & career guide</div>
            </div>
            <button className="cp-x" onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button>
          </div>

          <div className="cp-msgs">
            {messages.map((msg) => (
              <div key={msg.id} className={`cp-row ${msg.role}`}>
                {msg.role === "ai" && <div className="cp-av ai"><Rocket size={13} color="#0f172a" /></div>}
                <div className={`cp-bubble ${msg.role}`}>{renderMessage(msg.text)}</div>
                {msg.role === "user" && <div className="cp-av user">Me</div>}
              </div>
            ))}

            {isTyping && (
              <div className="cp-row ai">
                <div className="cp-av ai"><Rocket size={13} color="#0f172a" /></div>
                <div className="cp-bubble ai"><TypingBubble /></div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div className="cp-chips">
                {QUICK_REPLIES.map((q) => (
                  <button key={q} className="cp-chip" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="cp-footer">
            <div className="cp-irow">
              <input
                ref={inputRef}
                className="cp-input"
                type="text"
                placeholder="Ask a study doubt or anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                disabled={isTyping}
              />
              <button className="cp-send" onClick={() => sendMessage()} disabled={!input.trim() || isTyping} aria-label="Send">
                <Send size={15} />
              </button>
            </div>
            <p className="cp-hint">Ask about Maths, Science, Coding, History or CareerPilot 🚀</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
