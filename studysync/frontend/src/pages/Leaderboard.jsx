import { motion } from 'framer-motion';
import {
  HiOutlineTrophy,
  HiOutlineFire,
  HiOutlineBolt,
  HiOutlineGift,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendarDays,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { badgeDefinitions, scoringRules, getAvatarColor } from '../constants';

import './Leaderboard.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [usersBoard, setUsersBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/leaderboard');
        setUsersBoard(data);
      } catch (error) {
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const top3 = usersBoard.slice(0, 3);
  const userScore = user?.score || 0;

  if (loading) return <div className="page-container"><p>Loading leaderboard...</p></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">
        <HiOutlineTrophy style={{ verticalAlign: 'middle', marginRight: 8, color: '#fbbf24' }} />
        Leaderboard
      </h1>
      <p className="page-subtitle">Compete, climb the ranks, and win exciting prizes!</p>

      {/* Scoring Rules Banner */}
      <motion.div
        className="card scoring-rules-card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="scoring-title">
          <HiOutlineInformationCircle style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Scoring System
        </h3>
        <div className="scoring-chips">
          <div className="scoring-chip positive">
            <HiOutlineCheckCircle />
            <span>Task Completed</span>
            <strong>+{scoringRules.taskCompleted} pts</strong>
          </div>
          <div className="scoring-chip negative">
            <HiOutlineXCircle />
            <span>Task Missed</span>
            <strong>{scoringRules.taskMissed} pts</strong>
          </div>
          <div className="scoring-chip neutral">
            <HiOutlineCalendarDays />
            <span>Daily Active</span>
            <strong>+{scoringRules.dailyActive} pt</strong>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <div className="podium-section">
        {[0, 1, 2].map((idx) => {
          const podiumUser = top3[idx];
          if (!podiumUser) return null;
          const position = idx + 1;
          const medals = ['🥇', '🥈', '🥉'];
          const heights = ['220px', '180px', '150px'];
          const podiumColors = [
            'linear-gradient(180deg, rgba(245, 158, 11, 0.15), transparent)',
            'linear-gradient(180deg, rgba(99, 102, 241, 0.15), transparent)',
            'linear-gradient(180deg, rgba(148, 163, 184, 0.12), transparent)',
          ];
          const orderMap = [0, 1, 2];

          return (
            <motion.div
              key={podiumUser._id}
              className={`podium-card podium-${position}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + orderMap[idx] * 0.15, duration: 0.5 }}
            >
              <motion.div
                className="podium-medal"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 + idx * 0.5 }}
              >
                {medals[idx]}
              </motion.div>
              <div className="avatar avatar-xl" style={{ background: getAvatarColor(idx) }}>
                {podiumUser.initials}
              </div>
              <h3 className="podium-name">{podiumUser._id === user?.id ? 'You' : podiumUser.name}</h3>
              <div className="podium-stats">
                <span className="podium-xp"><HiOutlineBolt /> {podiumUser.score.toLocaleString()} pts</span>
                <span className="podium-streak"><HiOutlineFire /> {podiumUser.streak || 0} days</span>
              </div>
              <div className="podium-score-breakdown">
                <span className="score-mini green">✅ {podiumUser.tasksCompleted}</span>
                <span className="score-mini red">❌ {podiumUser.tasksMissed}</span>
                <span className="score-mini blue">📅 {podiumUser.activeDays || 0}d</span>
              </div>
              <div className="podium-badges">
                {podiumUser.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="podium-badge-item" title={badgeDefinitions[b]?.desc}>
                    {badgeDefinitions[b]?.name.split(' ')[0]}
                  </span>
                ))}
              </div>
              <div className="podium-bar" style={{ height: heights[idx], background: podiumColors[idx] }}>
                <span className="podium-rank">#{position}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <motion.div className="card rankings-card" variants={container} initial="hidden" animate="show">
        <h2 className="section-title">Full Rankings</h2>
        <div className="rankings-table">
          <div className="rankings-header">
            <span className="rank-col">#</span>
            <span className="user-col">Student</span>
            <span className="xp-col">Score</span>
            <span className="completed-col">✅ Done</span>
            <span className="missed-col">❌ Missed</span>
            <span className="streak-col">🔥 Streak</span>
            <span className="badges-col">Badges</span>
          </div>
          {usersBoard.map((u, i) => (
            <motion.div
              key={u._id}
              className={`rankings-row ${u._id === user?.id ? 'is-you' : ''}`}
              variants={item}
            >
              <span className="rank-col">
                <span className={`rank-number rank-${i + 1}`}>{i + 1}</span>
              </span>
              <span className="user-col">
                <div className="avatar avatar-sm" style={{ background: getAvatarColor(i) }}>
                  {u.initials}
                </div>
                <span className="rank-name">{u._id === user?.id ? 'You' : u.name}</span>
                {i < 3 && <span className="rank-medal">{['🥇', '🥈', '🥉'][i]}</span>}
              </span>
              <span className="xp-col xp-value">{u.score.toLocaleString()}</span>
              <span className="completed-col score-green">{u.tasksCompleted}</span>
              <span className="missed-col score-red">{u.tasksMissed}</span>
              <span className="streak-col">
                <HiOutlineFire style={{ color: '#ef4444' }} /> {u.streak}d
              </span>
              <span className="badges-col">
                {u.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="mini-badge" title={badgeDefinitions[b]?.name}>
                    {badgeDefinitions[b]?.name?.split(' ')[0] || '🏅'}
                  </span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges & Prizes Section */}
      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Badge Showcase */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="section-title">
            <HiOutlineStar style={{ verticalAlign: 'middle', marginRight: 8, color: '#fbbf24' }} />
            Badge Collection
          </h2>
          <div className="badge-showcase">
            {Object.entries(badgeDefinitions).map(([key, badge]) => (
              <motion.div
                key={key}
                className="badge-showcase-item"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <span className="badge-emoji">{badge.name.split(' ')[0]}</span>
                <span className="badge-name">{badge.name.split(' ').slice(1).join(' ')}</span>
                <span className="badge-desc">{badge.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Earn Badges */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="section-title">
            <HiOutlineStar style={{ verticalAlign: 'middle', marginRight: 8, color: '#ec4899' }} />
            How to Earn Badges (Tags)
          </h2>
          <div className="prize-list">
            {Object.entries(badgeDefinitions).map(([key, badge], i) => (
              <motion.div
                key={key}
                className="prize-item"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                style={{ padding: 'var(--space-md)' }}
              >
                <span className="prize-icon" style={{ fontSize: '1.5rem' }}>{badge.name.split(' ')[0]}</span>
                <div className="prize-info">
                  <span className="prize-tier" style={{ color: badge.color }}>
                    {badge.name.split(' ').slice(1).join(' ')}
                  </span>
                  <span className="prize-reward" style={{ fontSize: '0.85rem' }}>
                    <strong>Requirement:</strong> {badge.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
