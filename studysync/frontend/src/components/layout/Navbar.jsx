import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [notifs, setNotifs] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifs();
      // Polling for new notifications every 60 seconds
      const interval = setInterval(fetchNotifs, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifs = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifs(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const notifIcons = {
    deadline: '⏰',
    achievement: '🏆',
    group: '👥',
    ai: '🤖',
    leaderboard: '📊',
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifs(notifs.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifs(notifs.map(n => n._id === notif._id ? { ...n, read: true } : n));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    setShowNotifs(false);
    if (notif.type === 'deadline' || notif.type === 'task') navigate('/tasks');
    else if (notif.type === 'achievement' || notif.type === 'leaderboard') navigate('/leaderboard');
    else if (notif.type === 'group') navigate('/groups');
    else navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <HiOutlineMagnifyingGlass className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks, notes, groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="navbar-actions">
        <motion.button
          className="btn btn-primary btn-sm add-task-btn"
          onClick={() => navigate('/tasks', { state: { openModal: true } })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlinePlus />
          <span>Add Task</span>
        </motion.button>

        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
        </button>

        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="navbar-icon-btn"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <HiOutlineBell />
            {unreadCount > 0 && (
              <motion.span
                className="notif-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                className="notif-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="notif-header">
                  <h3>Notifications</h3>
                  <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
                </div>
                <div className="notif-list">
                  {notifs.map((notif) => (
                    <div
                      key={notif._id}
                      className={`notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => handleNotifClick(notif)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="notif-icon">{notifIcons[notif.type]}</span>
                      <div className="notif-content">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.read && <span className="notif-dot" />}
                    </div>
                  ))}
                  {notifs.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No notifications yet
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="navbar-user">
        {/* Profile / Logout Menu */}
        <div className="profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
          <button 
            className="avatar-btn" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {user?.initials || 'U'}
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className="notif-dropdown"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ right: 0, width: '200px', padding: 'var(--space-sm)' }}
              >
                <div style={{ padding: 'var(--space-sm)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-sm)' }}>
                  <p style={{ fontWeight: 'bold' }}>{user?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="btn"
                  style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', background: 'transparent' }}
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
