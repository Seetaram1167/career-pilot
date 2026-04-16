import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, IndianRupee, Layout, Users, TrendingUp, Image as ImageIcon, Camera } from "lucide-react";
import { API_BASE_URL } from "../apiConfig";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("mentors");
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    bio: "",
    company: "",
    price: 2500,
    discount: 0,
    type: "live",
    tags: "",
    image: "",
    isTopRated: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "mentors") {
        const res = await fetch(`${API_BASE_URL}/admin/mentors`, { headers });
        setMentors(await res.json());
      } else if (activeTab === "students") {
        const res = await fetch(`${API_BASE_URL}/admin/students`, { headers });
        setStudents(await res.json());
      } else if (activeTab === "transactions") {
        const res = await fetch(`${API_BASE_URL}/admin/transactions`, { headers });
        setTransactions(await res.json());
      } else if (activeTab === "admins") {
        const res = await fetch(`${API_BASE_URL}/admin/admins`, { headers });
        setAdmins(await res.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleOpenModal = (mentor = null) => {
    if (mentor) {
      setEditingMentor(mentor);
      setFormData({
        name: mentor.name,
        specialization: mentor.specialization,
        bio: mentor.bio,
        company: mentor.company || "",
        price: mentor.price,
        discount: mentor.discount || 0,
        type: mentor.type || "live",
        tags: mentor.tags ? mentor.tags.join(", ") : "",
        isTopRated: mentor.isTopRated || false,
        image: mentor.image || "",
      });
    } else {
      setEditingMentor(null);
      setFormData({
        name: "",
        specialization: "",
        bio: "",
        company: "",
        price: 1500,
        discount: 0,
        type: "live",
        tags: "",
        isTopRated: false,
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      if (name === "isTopRated" && !editingMentor) {
        newData.price = val ? 2500 : 1500;
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token } = JSON.parse(localStorage.getItem("user"));
    const url = editingMentor 
      ? `${API_BASE_URL}/admin/mentors/${editingMentor._id}` 
      : `${API_BASE_URL}/admin/mentors`;
    const method = editingMentor ? "PUT" : "POST";

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      price: Number(formData.price),
      discount: Number(formData.discount),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save mentor");
      }
    } catch (error) {
      console.error("Error saving mentor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    
    const { token } = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/mentors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error deleting mentor:", error);
    }
  };

  const panelStyles = `
    .admin-container { 
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-card: #ffffff;
      --bg-nav: #f1f5f9;
      --bg-active: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border-main: #e2e8f0;
      --border-muted: #f1f5f9;
      --accent: #3b82f6;
      --shadow: 0 4px 20px rgba(0,0,0,0.03);

      padding: 40px; 
      max-width: 1400px; 
      width: 100%;
      overflow-x: hidden;
      margin: 0 auto; 
      color: var(--text-main); 
      font-family: 'Outfit', sans-serif;
    }

    [data-theme='dark'] .admin-container {
      --bg-primary: #0d1117;
      --bg-secondary: #090c10;
      --bg-card: #0d1117;
      --bg-nav: #161b22;
      --bg-active: #21262d;
      --text-main: #c9d1d9;
      --text-muted: #8b949e;
      --border-main: #30363d;
      --border-muted: #21262d;
      --accent: #38bdf8;
      --shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; margin-top: 10px; gap: 15px; }
    
    .nav-tabs { display: flex; gap: 8px; background: var(--bg-nav); padding: 6px; border-radius: 14px; width: fit-content; border: 1px solid var(--border-main); }
    .nav-tab { padding: 10px 24px; border-radius: 10px; border: none; background: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; color: var(--text-muted); transition: all 0.2s; white-space: nowrap; }
    .nav-tab.active { background: var(--bg-active); color: var(--accent); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid var(--border-main); }
    
    .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .stat-card { background: var(--bg-card); padding: 25px; border-radius: 20px; border: 1.5px solid var(--border-main); display: flex; align-items: center; gap: 15px; box-shadow: var(--shadow); }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(56, 189, 248, 0.1); color: var(--accent); }
    
    .table-container { background: var(--bg-card); border-radius: 24px; border: 1.5px solid var(--border-main); overflow-x: auto; overflow-y: hidden; box-shadow: var(--shadow); width: 100%; -webkit-overflow-scrolling: touch; }
    .admin-table { width: 100%; min-width: 900px; border-collapse: collapse; white-space: nowrap; }
    .admin-table th { background: var(--bg-nav); padding: 20px; text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border-main); }
    .admin-table td { padding: 18px 20px; border-bottom: 1px solid var(--border-muted); vertical-align: middle; font-size: 0.95rem; color: var(--text-main); }
    .admin-table tr:hover { background: var(--bg-nav); }
    
    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { width: 40px; height: 40px; border-radius: 12px; background: var(--bg-nav); display: flex; align-items: center; justify-content: center; color: var(--accent); font-weight: 800; border: 1px solid var(--border-main); min-width: 40px; }
    
    .badge { padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 6px; }
    .badge-blue { background: rgba(56, 189, 248, 0.1); color: var(--accent); border: 1px solid rgba(56, 189, 248, 0.2); }
    .badge-amber { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .badge-green { background: rgba(52, 211, 153, 0.1); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); }
    .badge-slate { background: var(--bg-nav); color: var(--text-muted); border: 1px solid var(--border-main); }

    .expanded-row { background: var(--bg-secondary) !important; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; padding: 20px; }
    .detail-card { background: var(--bg-nav); padding: 20px; border-radius: 16px; border: 1px solid var(--border-main); transition: transform 0.2s; }
    .detail-card:hover { transform: translateY(-2px); border-color: var(--accent); }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); padding: 10px; }
    .modal-card { background: var(--bg-card); width: 100%; max-width: 650px; border-radius: 32px; padding: 40px; border: 1.5px solid var(--border-main); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .form-group label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .form-group input, .form-group select, .form-group textarea { padding: 14px 18px; border: 1.5px solid var(--border-main); border-radius: 14px; font-size: 1rem; transition: all 0.2s; background: var(--bg-secondary); color: var(--text-main); }
    .form-group input:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1); background: var(--bg-card); }
    
    .action-btns { display: flex; gap: 8px; }
    .action-btns .icon-btn { color: var(--text-muted); }
    .icon-btn:hover { background: var(--bg-nav); color: var(--accent); }
    .icon-btn.delete:hover { color: #f85149; background: rgba(248, 81, 73, 0.1); }

    @media (max-width: 768px) {
      .admin-container { padding: 20px 12px; overflow-x: hidden; width: 100vw; box-sizing: border-box; }
      .admin-table { min-width: 100%; }
      .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; margin: 0 -12px; width: calc(100% + 24px); }
      .admin-header { flex-direction: column; align-items: stretch; gap: 15px; width: 100%; }
      .admin-add-btn { width: 100%; justify-content: center; color: #0F172A !important; font-weight: 800 !important; }
      .nav-tabs { overflow-x: auto; width: 100%; padding-bottom: 4px; border-radius: 8px; justify-content: flex-start; scrollbar-width: none; }
      .nav-tabs::-webkit-scrollbar { display: none; }
      .admin-stats { grid-template-columns: 1fr; gap: 12px; }
      .form-grid { grid-template-columns: 1fr; gap: 12px; }
      .form-group.full { grid-column: span 1 !important; }
      .modal-card { padding: 24px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 20px; }
      .details-grid { grid-template-columns: 1fr; }
      .admin-table th, .admin-table td { padding: 12px 14px; font-size: 0.85rem; }
    }
  `;

  return (
    <div className="admin-container">
      <style>{panelStyles}</style>
      
      <div className="admin-header">
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === "mentors" ? "active" : ""}`} onClick={() => setActiveTab("mentors")}>Mentors</button>
          <button className={`nav-tab ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>Students</button>
          <button className={`nav-tab ${activeTab === "transactions" ? "active" : ""}`} onClick={() => setActiveTab("transactions")}>Transactions</button>
          <button className={`nav-tab ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>Admins</button>
        </div>
        {activeTab === "mentors" && (
          <button className="btn btn-primary admin-add-btn" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add New Mentor
          </button>
        )}
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div>
            <div style={{fontSize: '0.85rem', color: '#64748b'}}>Total {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
            <div style={{fontSize: '1.25rem', fontWeight: 800}}>
              {activeTab === "mentors" ? mentors.length : activeTab === "students" ? students.length : activeTab === "transactions" ? transactions.length : admins.length}
            </div>
          </div>
        </div>
        {activeTab === "transactions" && (
          <div className="stat-card">
            <div className="stat-icon"><IndianRupee size={24} /></div>
            <div>
              <div style={{fontSize: '0.85rem', color: '#64748b'}}>Total Revenue</div>
              <div style={{fontSize: '1.25rem', fontWeight: 800}}>₹{transactions.reduce((acc, t) => acc + t.amountPaid, 0)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="admin-table">
          {activeTab === "mentors" && (
            <>
              <thead>
                <tr>
                  <th>Mentor</th>
                  <th>Specialization</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Loading...</td></tr> : mentors.map(mentor => (
                  <tr key={mentor._id}>
                    <td><div className="user-info"><img src={mentor.image} alt="" style={{width: 32, height: 32, borderRadius: '50%'}} /> <strong>{mentor.name}</strong></div></td>
                    <td>{mentor.specialization}</td>
                    <td><span className="badge badge-slate">{mentor.type}</span></td>
                    <td><span className="badge badge-blue">₹{mentor.price}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit" onClick={() => handleOpenModal(mentor)}><Edit2 size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(mentor._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}

          {activeTab === "students" && (
            <>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Bookings (T/C)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px'}}>Loading...</td></tr> : students.map(student => (
                  <React.Fragment key={student._id}>
                    <tr>
                      <td><div className="user-info"><div className="user-avatar">{student.name.charAt(0)}</div> <strong>{student.name}</strong></div></td>
                      <td>{student.email}</td>
                      <td><span className="badge badge-blue">{student.totalBooked} Booked</span> / <span className="badge badge-green">{student.completedBooked} Done</span></td>
                      <td>
                        <button className="btn" style={{fontSize: '0.8rem', padding: '6px 12px'}} onClick={() => setExpandedStudent(expandedStudent === student._id ? null : student._id)}>
                          {expandedStudent === student._id ? "Close Details" : "View History"}
                        </button>
                      </td>
                    </tr>
                    {expandedStudent === student._id && (
                      <tr className="expanded-row">
                        <td colSpan="4">
                          <div style={{padding: '0 20px 20px'}}>
                            <div style={{display: 'flex', gap: '20px', marginBottom: '20px', background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-main)'}}>
                              <div style={{flex: 1}}>
                                <h4 style={{marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Career Achievements</h4>
                                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                  {student.totalBooked >= 1 && <span className="badge badge-blue">🎯 First Session</span>}
                                  {student.completedBooked >= 3 && <span className="badge badge-green">🔥 Consistent</span>}
                                  {student.totalBooked >= 5 && <span className="badge badge-amber">👑 Leader</span>}
                                  {student.totalBooked === 0 && <span className="badge badge-slate">🌱 Newcomer</span>}
                                </div>
                              </div>
                              <div style={{flex: 1, textAlign: 'right'}}>
                                <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px'}}>Total Investment</div>
                                <div style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)'}}>₹{student.bookings.reduce((acc, b) => acc + b.amount, 0)}</div>
                              </div>
                            </div>
                            <h4 style={{marginBottom: '15px', paddingLeft: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>MENTOR BOOKING HISTORY</h4>
                            <div className="details-grid">
                            {student.bookings.length > 0 ? student.bookings.map(b => (
                              <div key={b.id} className="detail-card">
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
                                  <span className={`badge ${b.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>{b.status.toUpperCase()}</span>
                                  <span style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(b.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{fontWeight: 700, marginBottom: 4}}>{b.topic}</div>
                                <div style={{fontSize: '0.85rem', color: '#475569'}}>Mentor: {b.mentor?.name || "N/A"}</div>
                                <div style={{fontSize: '0.85rem', color: '#475569', marginTop: 4}}>Amount: ₹{b.amount}</div>
                              </div>
                            )) : <div style={{gridColumn: 'span 3', padding: '20px', textAlign: 'center', color: '#64748b'}}>No bookings found for this student.</div>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </>
          )}

          {activeTab === "transactions" && (
            <>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Mentor / Topic</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Loading...</td></tr> : transactions.map(t => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td><strong>{t.studentId?.name || "Unknown"}</strong><br/><small>{t.studentId?.email}</small></td>
                    <td><strong>{t.sessionId?.mentorId?.name || "N/A"}</strong><br/><small>{t.topic}</small></td>
                    <td>₹{t.amountPaid}</td>
                    <td><span className={`badge ${t.paymentStatus === 'completed' ? 'badge-green' : 'badge-amber'}`}>{t.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </>
          )}

          {activeTab === "admins" && (
            <>
              <thead>
                <tr>
                  <th>Admin Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="3" style={{textAlign: 'center', padding: '40px'}}>Loading...</td></tr> : admins.map(admin => (
                  <tr key={admin._id}>
                    <td><div className="user-info"><div className="user-avatar" style={{background: '#020617', color: 'white'}}>{admin.name.charAt(0)}</div> <strong>{admin.name}</strong></div></td>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '25px'}}>{editingMentor ? "Edit Mentor" : "Add New Mentor"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input name="specialization" value={formData.specialization} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Session Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="live">Live</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '12px'}}>
                   <input type="checkbox" name="isTopRated" id="isTopRated" checked={formData.isTopRated} onChange={handleInputChange} style={{width: '20px', height: '20px', cursor: 'pointer'}} />
                   <label htmlFor="isTopRated" style={{marginBottom: 0, cursor: 'pointer'}}>Top Rated Mentor</label>
                </div>
                <div className="form-group">
                  <label>Base Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
                </div>
                <div className="form-group full">
                  <label>Tags (Comma separated)</label>
                  <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="React, Node, UX..." />
                </div>
                <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                  <label>Mentor Profile Picture</label>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-main)' }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={formData.image || "https://i.pravatar.cc/150"} 
                        alt="Preview" 
                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--accent)' }} 
                      />
                      <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--accent)', color: 'white', padding: 4, borderRadius: '50%', border: '2px solid var(--bg-card)' }}>
                        <Camera size={12} />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input 
                        type="text" 
                        name="image" 
                        value={formData.image} 
                        onChange={handleInputChange} 
                        placeholder="Paste Image URL or upload below..." 
                        style={{ marginBottom: 0, padding: '10px 14px', fontSize: '0.85rem' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--bg-nav)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                          <ImageIcon size={14} /> Browse Photo
                          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Supports JPG, PNG</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group full">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" required />
                </div>
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                  {editingMentor ? "Save Changes" : "Create Mentor"}
                </button>
                <button type="button" className="btn" style={{flex: 1, background: 'var(--soft-grey)'}} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
