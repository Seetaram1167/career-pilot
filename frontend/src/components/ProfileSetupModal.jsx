import { useState, useRef } from "react";
import { X, Camera, Save, Upload, Briefcase, GraduationCap, Calendar, User, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../apiConfig";

const DEVELOPER_INTERESTS = [
  "Full Stack Development", "Artificial Intelligence", "Blockchain", 
  "Cybersecurity", "Cloud Computing", "Mobile App Dev", 
  "Data Science", "UI/UX Design", "Game Development", "DevOps"
];

const ProfileSetupModal = ({ user, onSuccess, onClose }) => {
  const [step, setStep] = useState(1);
  
  // Safe date initialization
  const getInitialDob = () => {
    if (!user.dob) return "";
    try {
      const date = new Date(user.dob);
      return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : "";
    } catch (e) {
      return "";
    }
  };

  const [formData, setFormData] = useState({
    profilePic: user.profilePic || "",
    bio: user.bio || "",
    interests: user.interests || [],
    dob: getInitialDob(),
    education: user.education || "",
    experience: user.experience || "",
  });
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e, nextStep = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onSuccess(updatedUser, !nextStep); // only close if no next step
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (nextStep) setStep(nextStep);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePicture = (e) => {
    e.stopPropagation();
    handleSubmit(null, 1); // Save and stay on step 1
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const modalStyles = `
    .profile-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 25, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(12px);
    }
    .profile-modal-container {
      background: #121826;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 24px;
      width: 95%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      color: #fff;
    }
    .profile-modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.6rem;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .profile-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .step-indicator {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .step-dot {
      height: 4px;
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
    .step-dot.active {
      background: #3b82f6;
    }
    .upload-area {
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.02);
      position: relative;
    }
    .upload-area.drag-active {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
    }
    .profile-preview {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 1rem;
      border: 4px solid #1e293b;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }
    .interests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .interest-card {
      padding: 0.75rem;
      border-radius: 12px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: center;
      transition: all 0.2s;
    }
    .interest-card.selected {
      background: rgba(59, 130, 246, 0.1);
      border-color: #3b82f6;
      color: #60a5fa;
    }
    .form-input {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.875rem 1.25rem;
      color: #fff;
      width: 100%;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      ring: 2px solid rgba(59, 130, 246, 0.2);
    }
    .btn-professional {
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }
    .btn-next { background: #3b82f6; color: #fff; }
    .btn-next:hover { background: #2563eb; transform: translateY(-1px); }
    .btn-back { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }
    .btn-back:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    
    .animate-in {
      animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;

  return (
    <div className="profile-modal-backdrop modal-backdrop-animate">
      <style>{modalStyles}</style>
      <div className="profile-modal-container modal-content-animate">
        <button className="profile-modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        <header style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {step === 1 ? 'Professional Identity' : step === 2 ? 'Tech Skills & Interests' : 'Experience & Background'}
          </h2>
          <p style={{ color: '#94a3b8' }}>Provide your professional details to personalize your career pilot experience.</p>
        </header>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-in">
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Profile Picture</label>
                <div 
                  className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  {formData.profilePic ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="avatar-preview-wrapper" style={{ position: 'relative' }}>
                        <img src={formData.profilePic} alt="Preview" className="profile-preview" />
                        {saveSuccess && (
                          <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#10b981', color: '#fff', borderRadius: '50%', padding: '4px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button 
                          type="button" 
                          className="btn-professional" 
                          style={{ background: '#3b82f6', color: '#fff', fontSize: '0.875rem' }}
                          onClick={handleUpdatePicture}
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Profile Picture'}
                        </button>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>or drag another to change</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: '#3b82f6' }}>
                        <Upload size={32} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Upload your photo</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>PNG, JPG or WebP (Max 2MB)</p>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}>Professional Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className="form-input" 
                  rows="4" 
                  placeholder="e.g. Senior Full Stack Developer passionate about scalable architecture and high-performance applications..."
                ></textarea>
              </div>

              <button type="button" className="btn-professional btn-next" style={{ width: '100%' }} onClick={() => handleSubmit(null, 2)} disabled={loading}>
                {loading ? 'Saving...' : <>Save & Continue to Skills <Save size={18} /></>}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in">
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#e2e8f0' }}>Areas of Expertise</label>
                <div className="interests-grid">
                  {DEVELOPER_INTERESTS.map((interest) => (
                    <div 
                      key={interest} 
                      className={`interest-card ${formData.interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}><Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-professional btn-back" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={loading}>Back</button>
                <button type="button" className="btn-professional btn-next" style={{ flex: 2 }} onClick={() => handleSubmit(null, 3)} disabled={loading}>
                  {loading ? 'Saving...' : <>Save & Almost there</>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in">
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}><GraduationCap size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Education</label>
                <input 
                  type="text" 
                  name="education" 
                  value={formData.education} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="e.g. MS in Computer Science" 
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}><Briefcase size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Professional Experience</label>
                <textarea 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  className="form-input" 
                  rows="4" 
                  placeholder="e.g. 5+ years building cloud-native solutions at Fortune 500 companies..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-professional btn-back" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="btn-professional btn-next" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Processing...' : <><CheckCircle2 size={18} /> Complete Setup</>}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
