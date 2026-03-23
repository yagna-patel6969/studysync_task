import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineBolt,
  HiOutlineFire,
  HiOutlineTrophy,
  HiOutlineBell,
  HiOutlineEnvelope,
  HiOutlineCog6Tooth,
  HiOutlineCalendar,
  HiOutlinePaintBrush,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { badgeDefinitions, getAvatarColor } from '../constants';

import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [emailPref, setEmailPref] = useState(true);
  const [notifPref, setNotifPref] = useState(true);
  const [calendarLinked, setCalendarLinked] = useState(false);
  const [userRank, setUserRank] = useState('-');

  useEffect(() => {
    checkCalendarStatus();
    fetchUserRank();
    
    // Check URL for OAuth callback results
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('calendar') === 'success') {
      toast.success('Google Calendar linked successfully!');
      navigate('/profile', { replace: true });
    } else if (queryParams.get('calendar') === 'error') {
      toast.error('Failed to link Google Calendar.');
      navigate('/profile', { replace: true });
    }
  }, [location, navigate]);

  const checkCalendarStatus = async () => {
    try {
      const { data } = await api.get('/calendar/status');
      setCalendarLinked(data.isLinked);
    } catch (error) {
      console.error('Failed to fetch calendar status:', error);
    }
  };

  const fetchUserRank = async () => {
    try {
      const { data } = await api.get('/users/leaderboard');
      const index = data.findIndex(u => u._id === user?.id);
      if (index !== -1) {
        setUserRank(index + 1);
      }
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  };

  const handleCalendarAuth = async () => {
    if (calendarLinked) {
      // Unlink
      if (window.confirm('Are you sure you want to unlink your Google Calendar?')) {
        try {
          await api.post('/calendar/unlink');
          setCalendarLinked(false);
          toast.success('Calendar unlinked successfully');
        } catch (error) {
          toast.error('Failed to unlink calendar');
        }
      }
    } else {
      // Link
      try {
        const { data } = await api.get('/calendar/auth');
        if (data.url) {
          window.location.href = data.url; // Redirect to Google OAuth
        }
      } catch (error) {
        toast.error('Failed to initiate calendar linking');
      }
    }
  };

  const xpProgress = ((user?.score || 0) % 1000) / 10; // Progress to next 1000 pts
  const level = user?.level || 1;
  const score = user?.score || 0;
  const joinedDate = user?.createdAt || new Date();

  return (
    <div className="page-container">
      <h1 className="page-title">Profile & Settings</h1>
      <p className="page-subtitle">Manage your account and preferences</p>

      {/* Profile Header */}
      <motion.div
        className="card profile-header-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="avatar avatar-xl" style={{ background: getAvatarColor(0) }}>
              {user?.initials || 'U'}
            </div>
            <div className="profile-level-badge">Lvl {level}</div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-joined">Member since {new Date(joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="profile-quick-stats">
            <div className="pq-stat">
              <HiOutlineBolt style={{ color: 'var(--color-primary)' }} />
              <span className="pq-value">{score.toLocaleString()}</span>
              <span className="pq-label">Score</span>
            </div>
            <div className="pq-stat">
              <HiOutlineFire style={{ color: 'var(--color-danger)' }} />
              <span className="pq-value">{user?.streak || 0}</span>
              <span className="pq-label">Streak</span>
            </div>
            <div className="pq-stat">
              <HiOutlineTrophy style={{ color: 'var(--color-warning)' }} />
              <span className="pq-value">#{userRank}</span>
              <span className="pq-label">Rank</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="profile-xp-section">
          <div className="flex-between">
            <span className="xp-info">Level {level} → Level {level + 1}</span>
            <span className="xp-info">{score} / 1,000 pts</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Badge Collection */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-title">🏆 My Badges</h3>
          <div className="profile-badges">
            {Object.entries(badgeDefinitions).map(([key, badge]) => {
              const earned = user?.badges?.includes(key);
              return (
                <motion.div
                  key={key}
                  className={`profile-badge ${earned ? 'earned' : 'locked'}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="profile-badge-emoji">{badge.name.split(' ')[0]}</span>
                  <span className="profile-badge-name">{badge.name.split(' ').slice(1).join(' ')}</span>
                  {!earned && <span className="locked-overlay">🔒</span>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-title">
            <HiOutlineCog6Tooth style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Settings
          </h3>

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <HiOutlineBell className="setting-icon" />
                <div>
                  <span className="setting-name">Push Notifications</span>
                  <span className="setting-desc">Get notified about deadlines and achievements</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifPref}
                  onChange={() => setNotifPref(!notifPref)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <HiOutlineEnvelope className="setting-icon" />
                <div>
                  <span className="setting-name">Weekly Email Reports</span>
                  <span className="setting-desc">Receive progress reports every Friday</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={emailPref}
                  onChange={() => setEmailPref(!emailPref)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <HiOutlineCalendar className="setting-icon" />
                <div>
                  <span className="setting-name">Google Calendar</span>
                  <span className="setting-desc">Sync task deadlines with your calendar</span>
                </div>
              </div>
              <button
                className={`btn ${calendarLinked ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                onClick={handleCalendarAuth}
              >
                {calendarLinked ? '✓ Linked (Click to Unlink)' : 'Connect'}
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <HiOutlinePaintBrush className="setting-icon" />
                <div>
                  <span className="setting-name">Theme</span>
                  <span className="setting-desc">Dark mode (default)</span>
                </div>
              </div>
              <span className="badge badge-primary">Dark</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Summary */}
      <motion.div
        className="card"
        style={{ marginTop: 'var(--space-lg)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="section-title">📊 Lifetime Stats</h3>
        <div className="lifetime-stats-grid">
          <div className="lifetime-stat">
            <span className="lifetime-value">{user?.tasksCompleted || 0}</span>
            <span className="lifetime-label">Tasks Completed</span>
          </div>
          <div className="lifetime-stat">
            <span className="lifetime-value">0h</span>
            <span className="lifetime-label">Study Hours</span>
          </div>
          <div className="lifetime-stat">
            <span className="lifetime-value">{user?.badges?.length || 0}</span>
            <span className="lifetime-label">Badges Earned</span>
          </div>
          <div className="lifetime-stat">
            <span className="lifetime-value">{user?.streak || 0}</span>
            <span className="lifetime-label">Best Streak</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
