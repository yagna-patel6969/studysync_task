// ===== APP-WIDE UI CONSTANTS =====
// These are real application rules and UI helpers, NOT demo/mock data.

// Scoring rules (used in leaderboard display)
export const scoringRules = {
  taskCompleted: 5,   // +5 points per completed task
  taskMissed: -2,     // -2 points per missed/incomplete task
  dailyActive: 1,     // +1 point per day active
};

// Badge definitions (shown on profile, leaderboard, etc.)
export const badgeDefinitions = {
  streak_king: {
    name: '🔥 Streak King',
    desc: '14+ day streak',
    color: '#f59e0b',
  },
  early_bird: {
    name: '🌅 Early Bird',
    desc: 'Complete tasks before 8 AM',
    color: '#f472b6',
  },
  speed_star: {
    name: '⚡ Speed Star',
    desc: 'Complete 5 tasks in 1 day',
    color: '#6366f1',
  },
  consistent: {
    name: '🎯 Consistent',
    desc: 'Active 30+ days',
    color: '#10b981',
  },
  top_scorer: {
    name: '🏆 Top Scorer',
    desc: 'Reach #1 on leaderboard',
    color: '#fbbf24',
  },
  night_owl: {
    name: '🦉 Night Owl',
    desc: 'Study past midnight 10 times',
    color: '#8b5cf6',
  },
  group_leader: {
    name: '👑 Group Leader',
    desc: 'Lead 3+ group tasks',
    color: '#06b6d4',
  },
  bookworm: {
    name: '📚 Bookworm',
    desc: 'Summarize 20+ notes',
    color: '#ec4899',
  },
};

// Prize/reward tiers shown on the leaderboard
export const prizeTiers = [
  { tier: 'Diamond', xpRequired: 5000, reward: '₹500 Amazon Gift Card', icon: '💎', color: '#06b6d4' },
  { tier: 'Gold',    xpRequired: 3000, reward: '₹200 Amazon Gift Card', icon: '🥇', color: '#f59e0b' },
  { tier: 'Silver',  xpRequired: 1500, reward: 'Premium Features Unlock', icon: '🥈', color: '#94a3b8' },
  { tier: 'Bronze',  xpRequired: 500,  reward: 'Custom Profile Badge',   icon: '🥉', color: '#cd7c32' },
];

// Avatar gradient palette
export const avatarColors = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #ec4899, #f472b6)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #ef4444, #f87171)',
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  'linear-gradient(135deg, #14b8a6, #2dd4bf)',
];

export const getAvatarColor = (index) => avatarColors[index % avatarColors.length];
