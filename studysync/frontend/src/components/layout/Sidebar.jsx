import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlineTrophy,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineInformationCircle,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/tasks', icon: HiOutlineClipboardDocumentList, label: 'Tasks' },
  { path: '/leaderboard', icon: HiOutlineTrophy, label: 'Leaderboard' },
  { path: '/ai-tools', icon: HiOutlineSparkles, label: 'AI Tools' },
  { path: '/groups', icon: HiOutlineUserGroup, label: 'Groups' },
  { path: '/progress', icon: HiOutlineChartBar, label: 'Progress' },
  { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

const secondaryNavItems = [
  { path: '/about', icon: HiOutlineInformationCircle, label: 'About Us' },
  { path: '/contact', icon: HiOutlinePhone, label: 'Contact Us' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useAuth();

  const scoreProgress = Math.min(100, Math.round(((user?.score || 0) / 1000) * 100));

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header with Logo */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <img src="/logo.svg" className="logo-icon" alt="StudySync Logo" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                className="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                StudySync
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Collapse Toggle — positioned on border edge */}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrap">
                <item.icon className="nav-icon" />
                {isActive && (
                  <motion.div
                    className="nav-active-bg"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    className="nav-label"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
        
        <div style={{ margin: 'var(--space-md) 0 var(--space-sm)', borderTop: '1px solid var(--border-color)' }}></div>

        {secondaryNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrap">
                <item.icon className="nav-icon" />
                {isActive && (
                  <motion.div
                    className="nav-active-bg"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    className="nav-label"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — Level + Score */}
      <div className="sidebar-footer">
        <div className="xp-section">
          <div className="xp-header">
            <span className="xp-level">Lvl {user?.level || 1}</span>
            {!collapsed && (
              <span className="xp-score">{user?.score || 0} pts</span>
            )}
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-fill"
              initial={{ width: 0 }}
              animate={{ width: `${scoreProgress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          {!collapsed && (
            <span className="xp-text">
              {user?.score || 0} / 1,000 to next level
            </span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
