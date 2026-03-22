import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineTrophy,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineCalendar,
} from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/users/leaderboard')
        ]);
        setTasks(tasksRes.data);
        setLeaderboard(usersRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const todayTasks = tasks.filter((t) => t.status !== 'done').slice(0, 4);
  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const pendingCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  
  // Find current user rank
  const userRankIndex = leaderboard.findIndex(u => u._id === user?.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-';

  const statsCards = [
    { icon: HiOutlineCheckCircle, label: 'Completed', value: completedCount, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: HiOutlineClock, label: 'Pending', value: pendingCount, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    { icon: HiOutlineFire, label: 'Day Streak', value: user?.streak || 0, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
    { icon: HiOutlineArrowTrendingUp, label: 'Total Score', value: (user?.score || 0).toLocaleString(), color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  ];

  const priorityColors = {
    critical: 'var(--priority-critical)',
    high: 'var(--priority-high)',
    medium: 'var(--priority-medium)',
    low: 'var(--priority-low)',
  };

  if (loading) return <div className="page-container"><p>Loading dashboard...</p></div>;

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-text">
          <h1 className="page-title">
            Welcome back, <span className="text-gradient">{user?.name}!</span>
          </h1>
          <p className="page-subtitle">
            You have {pendingCount + inProgressCount} active tasks today. Let's crush them! 🚀
          </p>
        </div>
        <div className="welcome-decoration">
          <div className="decoration-circle c1" />
          <div className="decoration-circle c2" />
          <div className="decoration-circle c3" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid-4" variants={container} initial="hidden" animate="show">
        {statsCards.map((stat, i) => (
          <motion.div key={i} className="stat-card card" variants={item}>
            <div className="stat-icon-wrap" style={{ background: stat.gradient }}>
              <stat.icon className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="dashboard-grid">
        {/* Today's Tasks */}
        <motion.div
          className="card today-tasks-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <HiOutlineCalendar style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Today's Tasks
            </h2>
            <span className="badge badge-primary">{todayTasks.length} active</span>
          </div>

          <div className="today-tasks-list">
            {todayTasks.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No active tasks for today!</p>
            )}
            {todayTasks.map((task, i) => (
              <motion.div
                key={task._id}
                className="today-task-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div
                  className="task-priority-dot"
                  style={{ background: priorityColors[task.priority] }}
                />
                <div className="today-task-info">
                  <span className="today-task-title">{task.title}</span>
                  <span className="today-task-meta">
                    {task.deadline ? `Due ${new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No deadline'}
                  </span>
                </div>
                <span className={`badge badge-${task.status === 'in-progress' ? 'warning' : 'primary'}`}>
                  {task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Mini Leaderboard */}
          <motion.div
            className="card mini-leaderboard-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                <HiOutlineTrophy style={{ verticalAlign: 'middle', marginRight: 8, color: '#fbbf24' }} />
                Leaderboard
              </h2>
              <span className="badge badge-warning">#{userRank}</span>
            </div>
            <div className="mini-leader-list">
              {leaderboard.slice(0, 5).map((u, i) => (
                <div key={u._id} className={`mini-leader-item ${u._id === user?.id ? 'is-you' : ''}`}>
                  <span className="leader-pos">{i + 1}</span>
                  <div className="avatar avatar-sm" style={{ background: `hsl(${i * 60}, 70%, 55%)` }}>
                    {u.initials}
                  </div>
                  <span className="leader-name">{u._id === user?.id ? 'You' : u.name}</span>
                  <span className="leader-xp">{u.score.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            className="card ai-suggest-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              <HiOutlineSparkles style={{ verticalAlign: 'middle', marginRight: 8, color: '#818cf8' }} />
              AI Suggestions
            </h2>
            <div className="ai-suggest-list">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '10px' }}>
                Complete more tasks to receive personalized AI study suggestions!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
