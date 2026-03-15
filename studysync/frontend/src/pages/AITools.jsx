import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBookOpen,
  HiOutlineSpeakerWave,
  HiOutlineLightBulb,
  HiOutlinePaperAirplane,
  HiOutlineArrowPath,
  HiOutlineLink,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';
import { aiSuggestions } from '../data/mockData';
import './AITools.css';

export default function AITools() {
  const [activeMode, setActiveMode] = useState('summarize');
  const [notesInput, setNotesInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'Hi! I\'m your AI study assistant. Ask me any doubt about your subjects, and I\'ll explain it in detail! 🎓' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const modes = [
    { id: 'summarize', icon: HiOutlineDocumentText, label: 'Summarize Notes' },
    { id: 'doubts', icon: HiOutlineChatBubbleLeftRight, label: 'Doubt Solver' },
    { id: 'resources', icon: HiOutlineBookOpen, label: 'Resources' },
    { id: 'podcast', icon: HiOutlineSpeakerWave, label: 'Voice Notes' },
    { id: 'explorer', icon: HiOutlineLightBulb, label: 'Topic Explorer' },
  ];

  const handleSummarize = () => {
    if (!notesInput.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setSummaryResult({
        summary: 'React Hooks allow you to use state and other React features in functional components. The key hooks are useState for state management, useEffect for side effects, useContext for accessing context, and useRef for persistent references. Custom hooks let you extract and reuse component logic.',
        keyPoints: [
          'useState manages component state without classes',
          'useEffect replaces lifecycle methods (componentDidMount, etc.)',
          'useContext provides global state access without prop drilling',
          'Custom hooks enable logic reuse across components',
        ],
        relatedTopics: ['React Context API', 'State Management with Redux', 'React Performance Optimization', 'React Server Components'],
        realWorldUse: 'Used in production apps like Facebook, Instagram, and Airbnb for building interactive UIs with complex state management.',
        importance: 'Critical for modern React development. 95% of new React projects use hooks exclusively.',
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        content: `Great question about "${chatInput}"!\n\nLet me explain this step by step:\n\n1. **Core Concept**: This relates to fundamental principles in computer science and mathematics.\n\n2. **How it works**: The mechanism involves breaking down the problem into smaller sub-problems and solving them efficiently.\n\n3. **Example**: Consider a real-world scenario like organizing a library - you'd use similar principles to categorize and retrieve information.\n\n4. **Key takeaway**: Understanding this concept helps you build more efficient solutions.\n\nWould you like me to dive deeper into any specific aspect? 🤔`,
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const scheduledTasks = [
    { title: 'Review React Hooks before test', priority: 'high', reason: 'Exam in 2 days', time: 'Tomorrow 9:00 AM' },
    { title: 'Practice Dynamic Programming', priority: 'medium', reason: 'Weak area identified', time: 'Tomorrow 2:00 PM' },
    { title: 'Revise MongoDB queries', priority: 'high', reason: 'Assignment due in 3 days', time: 'March 16, 10:00 AM' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">
        <HiOutlineSparkles style={{ verticalAlign: 'middle', marginRight: 8, color: '#818cf8' }} />
        AI Study Tools
      </h1>
      <p className="page-subtitle">Your intelligent study companion powered by AI</p>

      {/* Mode Selector */}
      <div className="ai-mode-selector">
        {modes.map((mode) => (
          <motion.button
            key={mode.id}
            className={`ai-mode-btn ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => setActiveMode(mode.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <mode.icon className="ai-mode-icon" />
            <span>{mode.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="ai-content-area">
        {/* Summarize Notes */}
        <AnimatePresence mode="wait">
          {activeMode === 'summarize' && (
            <motion.div
              key="summarize"
              className="ai-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="ai-input-section card">
                <h3 className="section-title">📝 Paste Your Notes</h3>
                <textarea
                  className="input textarea ai-textarea"
                  placeholder="Paste your study notes here... The AI will generate a concise summary, key points, related topics, and real-world applications."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
                <div className="ai-input-actions">
                  <motion.button
                    className="btn btn-primary"
                    onClick={handleSummarize}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><HiOutlineArrowPath className="spin" /> Processing...</>
                    ) : (
                      <><HiOutlineSparkles /> Summarize with AI</>
                    )}
                  </motion.button>
                </div>
              </div>

              {summaryResult && (
                <motion.div
                  className="ai-result-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="card summary-card">
                    <h3 className="result-title">📋 Summary</h3>
                    <p className="result-text">{summaryResult.summary}</p>
                  </div>

                  <div className="card">
                    <h3 className="result-title">🎯 Key Points</h3>
                    <ul className="key-points-list">
                      {summaryResult.keyPoints.map((point, i) => (
                        <li key={i} className="key-point">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid-2">
                    <div className="card">
                      <h3 className="result-title">🔗 Related Topics</h3>
                      <div className="related-topics">
                        {summaryResult.relatedTopics.map((topic, i) => (
                          <span key={i} className="related-topic-chip">{topic}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <h3 className="result-title">🌍 Real-World Use</h3>
                      <p className="result-text">{summaryResult.realWorldUse}</p>
                      <p className="importance-text">
                        <strong>Importance:</strong> {summaryResult.importance}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Doubt Solver Chat */}
          {activeMode === 'doubts' && (
            <motion.div
              key="doubts"
              className="ai-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="card chat-card">
                <div className="chat-messages">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`chat-bubble ${msg.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {msg.role === 'ai' && <span className="chat-avatar">🤖</span>}
                      <div className="chat-content">
                        {msg.content.split('\n').map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="chat-input-area">
                  <input
                    className="input chat-input"
                    placeholder="Ask any doubt..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  />
                  <motion.button
                    className="btn btn-primary btn-icon"
                    onClick={handleSendChat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HiOutlinePaperAirplane />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resources */}
          {activeMode === 'resources' && (
            <motion.div
              key="resources"
              className="ai-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="card">
                <h3 className="section-title">📚 AI Recommended Resources</h3>
                <p className="page-subtitle" style={{ marginBottom: 16 }}>Based on your tasks and study patterns</p>
                <div className="resource-grid">
                  {aiSuggestions.filter(s => s.type === 'resource').map((res, i) => (
                    <motion.div
                      key={i}
                      className="resource-card"
                      whileHover={{ y: -4, borderColor: 'var(--border-hover)' }}
                    >
                      <div className="resource-type-icon">
                        {res.category === 'lecture' ? '🎬' : res.category === 'article' ? '📰' : '🔧'}
                      </div>
                      <div className="resource-info">
                        <h4 className="resource-title">{res.title}</h4>
                        <span className="resource-source">
                          <HiOutlineLink /> {res.source}
                        </span>
                      </div>
                      <span className={`badge badge-${res.category === 'lecture' ? 'primary' : res.category === 'article' ? 'cyan' : 'success'}`}>
                        {res.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Voice / Podcast */}
          {activeMode === 'podcast' && (
            <motion.div
              key="podcast"
              className="ai-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="card podcast-card">
                <div className="podcast-visual">
                  <div className="podcast-icon-wrap">
                    <HiOutlineSpeakerWave className="podcast-big-icon" />
                  </div>
                  <div className="sound-waves">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="sound-bar"
                        animate={{ height: [10, 30 + Math.random() * 30, 10] }}
                        transition={{ repeat: Infinity, duration: 0.8 + Math.random() * 0.5, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="podcast-title">AI Voice Notes</h3>
                <p className="podcast-desc">
                  Convert your study notes into podcast-style audio summaries. 
                  Paste your notes in the Summarize tab first, then generate voice notes here.
                </p>
                <div className="podcast-controls">
                  <button className="btn btn-primary btn-lg">
                    <HiOutlineSpeakerWave /> Generate Voice Summary
                  </button>
                </div>
                <p className="podcast-hint">
                  🎧 Listen to your notes while commuting, exercising, or relaxing
                </p>
              </div>
            </motion.div>
          )}

          {/* Topic Explorer */}
          {activeMode === 'explorer' && (
            <motion.div
              key="explorer"
              className="ai-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="card">
                <h3 className="section-title">
                  <HiOutlineLightBulb style={{ verticalAlign: 'middle', marginRight: 8, color: '#fbbf24' }} />
                  AI Auto-Scheduled Tasks
                </h3>
                <p className="page-subtitle" style={{ marginBottom: 16 }}>
                  Based on your pending tasks and study patterns, AI has scheduled these for you:
                </p>
                <div className="scheduled-tasks">
                  {scheduledTasks.map((task, i) => (
                    <motion.div
                      key={i}
                      className="scheduled-task-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <div className="scheduled-left">
                        <HiOutlineAcademicCap className="scheduled-icon" />
                        <div className="scheduled-info">
                          <h4>{task.title}</h4>
                          <span className="scheduled-reason">💡 {task.reason}</span>
                        </div>
                      </div>
                      <div className="scheduled-right">
                        <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                        <span className="scheduled-time">🕐 {task.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
