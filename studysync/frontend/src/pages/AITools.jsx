import { useState, useEffect } from 'react';
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
import api from '../api';
import toast from 'react-hot-toast';
import './AITools.css';

export default function AITools() {
  const [activeMode, setActiveMode] = useState('summarize');
  const [notesInput, setNotesInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hi! I'm your AI study assistant. Ask me any doubt about your subjects, and I'll explain it in detail! 🎓" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const modes = [
    { id: 'summarize', icon: HiOutlineDocumentText, label: 'Summarize Notes' },
    { id: 'doubts',    icon: HiOutlineChatBubbleLeftRight, label: 'Doubt Solver' },
    { id: 'resources', icon: HiOutlineBookOpen, label: 'Resources' },
    { id: 'podcast',   icon: HiOutlineSpeakerWave, label: 'Voice Notes' },
    { id: 'explorer',  icon: HiOutlineLightBulb, label: 'Topic Explorer' },
  ];

  // Fetch resources when that tab is opened
  useEffect(() => {
    if (activeMode === 'resources' && resources.length === 0) {
      fetchResources();
    }
  }, [activeMode]);

  // Fetch AI suggestions when Topic Explorer tab is opened
  useEffect(() => {
    if (activeMode === 'explorer' && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [activeMode]);

  const fetchResources = async () => {
    setResourcesLoading(true);
    try {
      const { data } = await api.get('/ai/resources');
      setResources(data);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const { data } = await api.get('/ai/suggestions');
      setSuggestions(data);
    } catch (error) {
      toast.error('Failed to load suggestions');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!notesInput.trim()) return;
    setIsProcessing(true);
    setSummaryResult(null);
    try {
      const { data } = await api.post('/ai/summarize', { text: notesInput });
      setSummaryResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to summarize notes');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');

    // Show a typing indicator
    setChatMessages(prev => [...prev, { role: 'ai', content: '...', loading: true }]);
    try {
      const { data } = await api.post('/ai/chat', { message: currentInput });
      setChatMessages(prev => [
        ...prev.filter(m => !m.loading),
        { role: 'ai', content: data.reply },
      ]);
    } catch (error) {
      setChatMessages(prev => prev.filter(m => !m.loading));
      toast.error('Failed to get response');
    }
  };

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
        <AnimatePresence mode="wait">
          {/* Summarize Notes */}
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

                  {summaryResult.keyPoints?.length > 0 && (
                    <div className="card">
                      <h3 className="result-title">🎯 Key Points</h3>
                      <ul className="key-points-list">
                        {summaryResult.keyPoints.map((point, i) => (
                          <li key={i} className="key-point">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid-2">
                    {summaryResult.relatedTopics?.length > 0 && (
                      <div className="card">
                        <h3 className="result-title">🔗 Related Topics</h3>
                        <div className="related-topics">
                          {summaryResult.relatedTopics.map((topic, i) => (
                            <span key={i} className="related-topic-chip">{topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
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
                        {msg.loading ? (
                          <span style={{ color: 'var(--text-muted)' }}>Thinking...</span>
                        ) : (
                          msg.content.split('\n').map((line, j) => (
                            <p key={j}>{line}</p>
                          ))
                        )}
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
                <p className="page-subtitle" style={{ marginBottom: 16 }}>Based on your task tags and study patterns</p>
                {resourcesLoading ? (
                  <p style={{ color: 'var(--text-muted)', padding: 20 }}>Loading resources...</p>
                ) : resources.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: 20, textAlign: 'center' }}>
                    🚀 Create tasks with topic tags (e.g. "React", "ML") to receive personalized resource recommendations!
                  </p>
                ) : (
                  <div className="resource-grid">
                    {resources.map((res, i) => (
                      <motion.a
                        key={i}
                        className="resource-card"
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, borderColor: 'var(--border-hover)' }}
                        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
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
                      </motion.a>
                    ))}
                  </div>
                )}
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

          {/* Topic Explorer / AI Suggestions */}
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
                  AI Priority Suggestions
                </h3>
                <p className="page-subtitle" style={{ marginBottom: 16 }}>
                  Based on your deadlines and task status, here's what to focus on:
                </p>
                {suggestionsLoading ? (
                  <p style={{ color: 'var(--text-muted)', padding: 20 }}>Loading suggestions...</p>
                ) : suggestions.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: 20, textAlign: 'center' }}>
                    🎉 All caught up! Create tasks with deadlines to receive prioritized study suggestions.
                  </p>
                ) : (
                  <div className="scheduled-tasks">
                    {suggestions.map((task, i) => (
                      <motion.div
                        key={i}
                        className="scheduled-task-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="scheduled-left">
                          <HiOutlineAcademicCap className="scheduled-icon" />
                          <div className="scheduled-info">
                            <h4>{task.title}</h4>
                            <span className="scheduled-reason">💡 {task.reason}</span>
                          </div>
                        </div>
                        <div className="scheduled-right">
                          <span className={`badge priority-${task.priority}`}>{task.priorityLabel}</span>
                          {task.deadline && (
                            <span className="scheduled-time">
                              🕐 {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
