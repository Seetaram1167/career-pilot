import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Award, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  Lock
} from "lucide-react";
import { COURSE_MODULES } from "../data/courseData";
import Certificate from "./Certificate";
import ModuleViewer from "./ModuleViewer";

const CourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseData = COURSE_MODULES[id];
  const [completedModules, setCompletedModules] = useState(() => {
    // Load progress from localStorage on initial state
    try {
      const savedProgress = localStorage.getItem(`course_progress_${id}`);
      return savedProgress ? JSON.parse(savedProgress) : {};
    } catch (e) {
      return {};
    }
  });
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [userName, setUserName] = useState("Pro Student");

  useEffect(() => {
    // Save progress whenever it changes
    localStorage.setItem(`course_progress_${id}`, JSON.stringify(completedModules));
  }, [completedModules, id]);

  useEffect(() => {
    // Try to get user name from localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) setUserName(user.name);
    } catch (e) {
      console.log("Could not find user in localStorage");
    }

    // Initialize expanded course for bundle
    if (courseData?.bundle && courseData.courses.length > 0) {
      setExpandedCourse(courseData.courses[0].id);
    }
  }, [courseData]);

  // Sync completion to achievements automatically
  useEffect(() => {
    const progress = calculateProgress();
    if (progress === 100) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          if (!currentUser.achievements) currentUser.achievements = [];
          const alreadyExists = currentUser.achievements.some(a => a.courseName === courseData.title);
          if (!alreadyExists) {
            currentUser.achievements.push({
              id: `CERT-${Date.now()}`,
              courseName: courseData.title,
              date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
              userName: currentUser.name || "Pro Student"
            });
            localStorage.setItem('user', JSON.stringify(currentUser));
            // Dispatch event for other components to update
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (e) {
        console.error("Auto-save achievement failed:", e);
      }
    }
  }, [completedModules, courseData]);

  if (!courseData) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2>Course Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/certifications")}>Back to Certifications</button>
      </div>
    );
  }

  const toggleModule = (moduleId) => {
    setCompletedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    if (courseData.bundle) {
      courseData.courses.forEach(c => {
        total += c.modules.length;
        c.modules.forEach(m => {
          if (completedModules[m.title]) completed++;
        });
      });
    } else {
      total = courseData.modules.length;
      courseData.modules.forEach(m => {
        if (completedModules[m.title]) completed++;
      });
    }

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const isComplete = calculateProgress() === 100;

  const styles = `
    .course-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .course-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      padding: 40px;
      border-radius: 24px;
      color: white;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
    }
    .course-header h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: white !important;
    }
    .progress-bar-container {
      margin-top: 24px;
      background: rgba(255,255,255,0.1);
      height: 12px;
      border-radius: 6px;
      position: relative;
    }
    .progress-bar-fill {
      height: 100%;
      background: #10b981;
      border-radius: 6px;
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .bundle-grid {
      display: grid;
      gap: 20px;
    }
    .course-section {
      background: var(--white);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s;
    }
    .course-section-header {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: var(--white);
      opacity: 0.9;
    }
    .course-section-header:hover {
      background: var(--soft-grey);
    }
    .module-list {
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
      background: var(--white);
    }
    .module-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
    }
    .module-item:last-child { border-bottom: none; }
    .module-item:hover { transform: translateX(4px); transition: 0.2s; }
    
    .certificate-btn {
      margin-top: 40px;
      width: 100%;
      padding: 24px;
      border-radius: 16px;
      background: ${isComplete ? 'linear-gradient(to right, #4f46e5, #7c3aed)' : '#e2e8f0'};
      color: ${isComplete ? 'white' : '#94a3b8'};
      font-weight: 800;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      cursor: ${isComplete ? 'pointer' : 'not-allowed'};
      border: none;
      transition: all 0.3s;
    }
    .certificate-btn:hover {
      ${isComplete ? 'transform: scale(1.02); box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);' : ''}
    }
  `;

  if (showCertificate) {
    return <Certificate userName={userName} courseName={courseData.title} onBack={() => setShowCertificate(false)} />;
  }

  // Prepare all modules for navigation logic
  const allModules = [];
  if (courseData.bundle) {
    courseData.courses.forEach(c => {
      if (c.modules) allModules.push(...c.modules);
    });
  } else if (courseData.modules) {
    allModules.push(...courseData.modules);
  }
  
  const currentIndex = selectedModule ? allModules.findIndex(m => m.title === selectedModule.title) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < allModules.length - 1;
  const nextModule = hasNext ? allModules[currentIndex + 1] : null;

  const collectCertificate = () => {
    // Save to user achievements
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        if (!currentUser.achievements) currentUser.achievements = [];
        
        // Prevent duplicates
        const alreadyExists = currentUser.achievements.some(a => a.courseName === courseData.title);
        
        if (!alreadyExists) {
          currentUser.achievements.push({
            id: `CERT-${Date.now()}`,
            courseName: courseData.title,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            userName: currentUser.name || "Pro Student"
          });
          localStorage.setItem('user', JSON.stringify(currentUser));
          // Dispatch event for other components to update
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.error("Failed to save achievement:", e);
    }
    
    setShowCertificate(true);
  };

  return (
    <div className="course-page">
      <style>{styles}</style>
      <button className="btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }} onClick={() => navigate("/certifications")}>
        <ArrowLeft size={18} /> Back to Certifications
      </button>

      <div className="course-header">
        <h1>{courseData.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Academy Master Program • {courseData.bundle ? `${courseData.courses.length} Courses` : 'Full Modules'}</span>
          <span style={{ fontWeight: 800, color: '#10b981' }}>{calculateProgress()}% COMPLETE</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
      </div>

      <div className="bundle-grid">
        {courseData.bundle ? (
          courseData.courses.map((course) => (
            <div key={course.id} className="course-section">
              <div className="course-section-header" onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'var(--soft-grey)', color: 'var(--vibrant-blue)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{course.title}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{course.modules.length} Modules</span>
                  </div>
                </div>
                {expandedCourse === course.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedCourse === course.id && (
                <div className="module-list" style={{ animation: 'fadeIn 0.3s' }}>
                  {course.modules.map((module, mIdx) => (
                    <div key={mIdx} className="module-item" onClick={() => setSelectedModule(module)}>
                      {completedModules[module.title] ? <CheckCircle2 size={24} color="#10b981" fill="#10b98122" /> : <Circle size={24} color="var(--border-color)" />}
                      <span style={{ color: completedModules[module.title] ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: completedModules[module.title] ? 600 : 400 }}>{module.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="course-section">
            <div className="module-list">
              {courseData.modules.map((module, mIdx) => (
                <div key={mIdx} className="module-item" onClick={() => setSelectedModule(module)}>
                  {completedModules[module.title] ? <CheckCircle2 size={24} color="#10b981" fill="#10b98122" /> : <Circle size={24} color="#cbd5e1" />}
                  <span style={{ color: completedModules[module.title] ? '#1e293b' : '#64748b', fontWeight: completedModules[module.title] ? 600 : 400 }}>{module.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="certificate-btn" disabled={!isComplete} onClick={() => isComplete && collectCertificate()}>
        {isComplete ? <Award size={28} /> : <Lock size={24} />}
        {isComplete ? "COLLECT YOUR CERTIFICATE" : `FINISH ALL MODULES TO UNLOCK (${calculateProgress()}%)`}
      </button>

      <ModuleViewer 
        module={selectedModule} 
        isOpen={!!selectedModule} 
        onClose={() => setSelectedModule(null)}
        onToggleComplete={(title) => toggleModule(title)}
        isCompleted={selectedModule && selectedModule.title && completedModules[selectedModule.title]}
        hasNext={hasNext}
        onNext={() => setSelectedModule(nextModule)}
      />
    </div>
  );
};

export default CourseContent;
