import { useState } from 'react';
import { HiOutlineChatBubbleLeftEllipsis, HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-container">
      <div className="contact-header text-center">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We'd love to hear from you. Reach out with questions, feedback, or just to say hi!</p>
      </div>

      <div className="grid-2">
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="section-title">Get In Touch</h2>
          
          <div className="contact-info-list" style={{ marginTop: 'var(--space-lg)' }}>
            <div className="contact-item">
              <div className="contact-icon"><HiOutlineEnvelope /></div>
              <div>
                <h4>Email Support</h4>
                <p>support@studysync.app</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon"><HiOutlineChatBubbleLeftEllipsis /></div>
              <div>
                <h4>Community Discord</h4>
                <p>discord.gg/studysync</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><HiOutlineMapPin /></div>
              <div>
                <h4>Headquarters</h4>
                <p>123 Innovation Drive, Tech City, 90210</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="section-title">Send a Message</h2>
          
          {submitted ? (
            <div className="success-message">
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input required className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input required className="input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea required className="input textarea" rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
