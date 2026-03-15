import { HiOutlineUserGroup, HiOutlineLightBulb, HiOutlineStar } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import './About.css';

export default function About() {
  return (
    <div className="page-container">
      <div className="about-header">
        <h1 className="page-title text-center">About StudySync</h1>
        <p className="page-subtitle text-center" style={{ maxWidth: 600, margin: '0 auto var(--space-2xl)' }}>
          We believe that studying shouldn't be a chore. StudySync was built to revolutionize how students approach learning by mixing productivity tools with gamification.
        </p>
      </div>

      <div className="grid-3">
        <motion.div className="card about-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="about-icon"><HiOutlineUserGroup /></div>
          <h3>Built For Students</h3>
          <p>Created with the modern student in mind, offering group tasks, collaborative learning, and rich AI tools to summarize and explain topics.</p>
        </motion.div>
        
        <motion.div className="card about-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="about-icon"><HiOutlineStar /></div>
          <h3>Gamified Experience</h3>
          <p>Earn XP, badges, and compete on the global leaderboard. Studying is more effective when it's engaging and rewarding.</p>
        </motion.div>

        <motion.div className="card about-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="about-icon"><HiOutlineLightBulb /></div>
          <h3>AI-Powered Insights</h3>
          <p>From generating flashcards to resolving doubts instantly, our AI integration is like having a personal tutor available 24/7.</p>
        </motion.div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <h2>Our Mission</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 800, margin: '16px auto 0', lineHeight: 1.8 }}>
          Our mission is to empower learners worldwide by providing a smart, intuitive, and highly motivational environment. 
          By combining proven pedagogical techniques with modern web technology, we aim to help you achieve your academic 
          goals without the burnout.
        </p>
      </div>
    </div>
  );
}
