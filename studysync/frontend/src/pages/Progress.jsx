import { motion } from 'framer-motion';
import {
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowTrendingUp,
  HiOutlineFire,
  HiOutlineEnvelope,
  HiOutlineBolt,
} from 'react-icons/hi2';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { studyStats, weeklyReport } from '../data/mockData';
import './Progress.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Progress() {
  const { user } = useAuth();
  const completionRate = Math.round((weeklyReport.completed / (weeklyReport.completed + weeklyReport.pending + weeklyReport.ongoing)) * 100);

  const stats = {
    tasksCompleted: user?.tasksCompleted || 0,
    studyHours: 0,
    score: user?.score || 0,
    streak: user?.streak || 0,
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <HiOutlineChartBar style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Progress & Reports
      </h1>
      <p className="page-subtitle">Track your study journey and weekly performance</p>

      {/* Weekly Report Card */}
      <motion.div
        className="card weekly-report-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="report-header">
          <div>
            <h2 className="section-title">
              <HiOutlineEnvelope style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Weekly Report
            </h2>
            <span className="report-week">Week of {new Date(weeklyReport.weekOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <span className="badge badge-primary">📧 Email sent</span>
        </div>

        <motion.div className="report-stats grid-4" variants={container} initial="hidden" animate="show">
          <motion.div className="report-stat-card" variants={item}>
            <HiOutlineCheckCircle className="report-stat-icon" style={{ color: 'var(--color-success)' }} />
            <span className="report-stat-value">{weeklyReport.completed}</span>
            <span className="report-stat-label">Completed</span>
          </motion.div>
          <motion.div className="report-stat-card" variants={item}>
            <HiOutlineClock className="report-stat-icon" style={{ color: 'var(--color-warning)' }} />
            <span className="report-stat-value">{weeklyReport.pending}</span>
            <span className="report-stat-label">Pending</span>
          </motion.div>
          <motion.div className="report-stat-card" variants={item}>
            <HiOutlineArrowTrendingUp className="report-stat-icon" style={{ color: 'var(--color-primary)' }} />
            <span className="report-stat-value">{weeklyReport.ongoing}</span>
            <span className="report-stat-label">Ongoing</span>
          </motion.div>
          <motion.div className="report-stat-card" variants={item}>
            <HiOutlineFire className="report-stat-icon" style={{ color: 'var(--color-danger)' }} />
            <span className="report-stat-value">{weeklyReport.streakDays}d</span>
            <span className="report-stat-label">Streak</span>
          </motion.div>
        </motion.div>

        <div className="report-tip">
          💡 <strong>AI Tip:</strong> {weeklyReport.improvementTip}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Study Hours Chart */}
        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-title">📊 Daily Study Hours</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studyStats.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Completion Trend */}
        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="section-title">📈 Task Completion Trend</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={studyStats.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                  }}
                />
                <Area
                  type="monotone" dataKey="completed" stroke="#10b981"
                  fill="url(#areaGradient)" strokeWidth={2}
                />
                <Area
                  type="monotone" dataKey="total" stroke="#6366f1"
                  fill="url(#areaGradient2)" strokeWidth={2} strokeDasharray="5 5"
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Category Breakdown */}
        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="section-title">🎯 Category Breakdown</h3>
          <div className="pie-chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={studyStats.categoryBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {studyStats.categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {studyStats.categoryBreakdown.map((cat) => (
                <div key={cat.name} className="pie-legend-item">
                  <span className="pie-dot" style={{ background: cat.color }} />
                  <span>{cat.name}</span>
                  <span className="pie-value">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Consistency Heatmap */}
        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="section-title">🔥 Consistency Heatmap</h3>
          <p className="heatmap-subtitle">Last 90 days of activity</p>
          <div className="heatmap-grid">
            {studyStats.heatmap.map((day, i) => (
              <div
                key={i}
                className="heatmap-cell"
                style={{
                  background: day.count === 0 ? 'var(--bg-tertiary)' :
                    day.count === 1 ? 'rgba(99, 102, 241, 0.2)' :
                    day.count === 2 ? 'rgba(99, 102, 241, 0.4)' :
                    day.count === 3 ? 'rgba(99, 102, 241, 0.6)' :
                    'rgba(99, 102, 241, 0.9)',
                }}
                title={`${day.date}: ${day.count} tasks`}
              />
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="heatmap-cell" style={{ background: 'var(--bg-tertiary)' }} />
            <div className="heatmap-cell" style={{ background: 'rgba(99, 102, 241, 0.2)' }} />
            <div className="heatmap-cell" style={{ background: 'rgba(99, 102, 241, 0.4)' }} />
            <div className="heatmap-cell" style={{ background: 'rgba(99, 102, 241, 0.6)' }} />
            <div className="heatmap-cell" style={{ background: 'rgba(99, 102, 241, 0.9)' }} />
            <span>More</span>
          </div>
        </motion.div>
      </div>

      {/* Overall Stats */}
      <motion.div
        className="card overall-stats-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <h3 className="section-title">🏅 Overall Stats</h3>
        <div className="overall-stats-grid">
          <div className="overall-stat">
            <span className="overall-stat-value">{stats.tasksCompleted}</span>
            <span className="overall-stat-label">Total Tasks Completed</span>
          </div>
          <div className="overall-stat">
            <span className="overall-stat-value">{stats.studyHours}h</span>
            <span className="overall-stat-label">Total Study Hours</span>
          </div>
          <div className="overall-stat">
            <span className="overall-stat-value">{stats.score.toLocaleString()}</span>
            <span className="overall-stat-label">Total Score</span>
          </div>
          <div className="overall-stat">
            <span className="overall-stat-value">{completionRate}%</span>
            <span className="overall-stat-label">Completion Rate</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
