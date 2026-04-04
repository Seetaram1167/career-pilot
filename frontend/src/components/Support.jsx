import React, { useState } from "react";
import { HelpCircle, Mail, MessageSquare, Phone, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";

const FAQ_DATA = [
  {
    question: "How do I choose the right career assessment?",
    answer: "If you're unsure where to start, we recommend the 'Career Assessment' first. It analyzes your personality and interests to give you a broad direction. You can then dive into more specialized tests like 'Coding' or 'Soft Skills'."
  },
  {
    question: "Can I retake an assessment?",
    answer: "Yes! You can retake any assessment at any time from your Dashboard. We actually recommend retaking them every few months as your skills and interests grow."
  },
  {
    question: "How do I book a session with a mentor?",
    answer: "Once you have your assessment results, head over to the 'Mentors' tab. You can browse experts in your matched field and book a session directly from their profile."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption to protect your profile and assessment data. Your results are only visible to you and (if requested) your assigned mentor."
  },
  {
    question: "Do I get a certificate after finishing a test?",
    answer: "Yes, once you complete an assessment, your 'Trophy Room' is updated with a badge. For specialized tracks, you can also view and download a Pro-Cert from your profile."
  }
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const supportStyles = `
    .support-hero {
      text-align: center;
      padding: 60px 20px;
      margin-bottom: 40px;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .support-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: flex-start;
    }
    @media (max-width: 900px) {
      .support-grid { grid-template-columns: 1fr; }
    }
    .faq-container { display: flex; flex-direction: column; gap: 16px; }
    .faq-item {
      background: var(--white);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
    }
    .faq-question {
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-weight: 700;
      color: var(--deep-navy);
    }
    .faq-answer {
      padding: 0 24px 20px;
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.95rem;
    }
    .support-contactForm {
      background: var(--white);
      padding: 40px;
      border-radius: 24px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .contact-input {
      width: 100%;
      padding: 14px 18px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 16px;
      background: var(--soft-grey);
      font-family: inherit;
      transition: all 0.3s;
    }
    .contact-input:focus { border-color: var(--vibrant-blue); outline: none; background: #fff; }
    .support-channelCard {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      margin-top: 12px;
      color: #fff;
      text-decoration: none;
      transition: all 0.3s;
    }
    .support-channelCard:hover { background: rgba(255,255,255,0.08); transform: translateX(8px); }
  `;

  return (
    <div className="page-container">
      <style>{supportStyles}</style>

      <div className="support-hero">
        <HelpCircle size={48} color="var(--vibrant-blue)" style={{ marginBottom: 16 }} />
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 12 }}>Customer Care</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 32px' }}>
          We're here to help you navigate your career journey. Find quick answers or reach out to our team directly.
        </p>
        
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:support@careerpilot.com" className="support-channelCard">
            <Mail size={20} /> <span>Email Us</span>
          </a>
          <a href="https://wa.me/919876543210" className="support-channelCard">
            <MessageSquare size={20} color="#25D366" /> <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="support-grid">
        {/* FAQ Section */}
        <section>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 24, color: 'var(--deep-navy)' }}>Common Questions</h2>
          <div className="faq-container">
            {FAQ_DATA.map((faq, index) => (
              <div key={index} className="faq-item" style={{ borderColor: openFaq === index ? 'var(--vibrant-blue)' : 'var(--border-color)' }}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section>
          <div className="support-contactForm">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8, color: 'var(--deep-navy)' }}>Direct Message</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Can't find what you're looking for? Send us a message.</p>
            
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={64} color="var(--success-green)" style={{ marginBottom: 16 }} />
                <h3>Message Sent Successfully!</h3>
                <p>Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input 
                  className="contact-input" 
                  type="text" 
                  placeholder="Your Name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input 
                  className="contact-input" 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input 
                  className="contact-input" 
                  type="text" 
                  placeholder="Subject" 
                  required 
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
                <textarea 
                  className="contact-input" 
                  rows="5" 
                  placeholder="How can we help?" 
                  required 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: 10 }}>
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
