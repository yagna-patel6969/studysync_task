// ===== MOCK DATA FOR STUDYSYNC =====

// Scoring Rules
export const scoringRules = {
  taskCompleted: 5,    // +5 points per completed task
  taskMissed: -2,      // -2 points per missed/incomplete task
  dailyActive: 1,      // +1 point per day active
};

// Calculate score from user stats
export const calculateScore = (user) => {
  return (
    user.tasksCompleted * scoringRules.taskCompleted +
    user.tasksMissed * scoringRules.taskMissed +
    user.daysActive * scoringRules.dailyActive
  );
};

export const currentUser = {
  id: "u1",
  name: "Yagna",
  email: "yagna@studysync.com",
  avatar: null,
  initials: "YA",
  level: 12,
  streak: 14,
  rank: 3,
  badges: ["streak_king", "early_bird", "speed_star", "consistent"],
  joinedDate: "2025-12-15",
  tasksCompleted: 127,
  tasksMissed: 18,
  daysActive: 75,
  studyHours: 248,
};
// Compute current user's score
currentUser.score = calculateScore(currentUser);

export const users = [
  {
    id: "u1", name: "Yagna", initials: "YA", level: 12, streak: 14,
    tasksCompleted: 127, tasksMissed: 18, daysActive: 75,
    badges: ["streak_king", "early_bird", "speed_star"],
  },
  {
    id: "u2", name: "Arjun Patel", initials: "AP", level: 14, streak: 21,
    tasksCompleted: 145, tasksMissed: 10, daysActive: 88,
    badges: ["streak_king", "top_scorer", "group_leader"],
  },
  {
    id: "u3", name: "Priya Sharma", initials: "PS", level: 13, streak: 18,
    tasksCompleted: 138, tasksMissed: 12, daysActive: 82,
    badges: ["speed_star", "consistent", "night_owl"],
  },
  {
    id: "u4", name: "Rahul Gupta", initials: "RG", level: 11, streak: 10,
    tasksCompleted: 112, tasksMissed: 22, daysActive: 65,
    badges: ["early_bird", "consistent"],
  },
  {
    id: "u5", name: "Sneha Reddy", initials: "SR", level: 10, streak: 7,
    tasksCompleted: 98, tasksMissed: 20, daysActive: 55,
    badges: ["speed_star"],
  },
  {
    id: "u6", name: "Karan Singh", initials: "KS", level: 10, streak: 5,
    tasksCompleted: 95, tasksMissed: 25, daysActive: 50,
    badges: ["group_leader"],
  },
  {
    id: "u7", name: "Ananya Iyer", initials: "AI", level: 9, streak: 12,
    tasksCompleted: 89, tasksMissed: 15, daysActive: 60,
    badges: ["consistent", "early_bird"],
  },
  {
    id: "u8", name: "Vikram Joshi", initials: "VJ", level: 9, streak: 3,
    tasksCompleted: 82, tasksMissed: 30, daysActive: 45,
    badges: [],
  },
  {
    id: "u9", name: "Meera Das", initials: "MD", level: 8, streak: 9,
    tasksCompleted: 76, tasksMissed: 18, daysActive: 52,
    badges: ["night_owl"],
  },
  {
    id: "u10", name: "Rohan Verma", initials: "RV", level: 8, streak: 2,
    tasksCompleted: 71, tasksMissed: 28, daysActive: 38,
    badges: [],
  },
];

// Pre-compute scores for each user
users.forEach(u => { u.score = calculateScore(u); });

export const badgeDefinitions = {
  streak_king: {
    name: "🔥 Streak King",
    desc: "14+ day streak",
    color: "#f59e0b",
  },
  early_bird: {
    name: "🌅 Early Bird",
    desc: "Complete tasks before 8 AM",
    color: "#f472b6",
  },
  speed_star: {
    name: "⚡ Speed Star",
    desc: "Complete 5 tasks in 1 day",
    color: "#6366f1",
  },
  consistent: {
    name: "🎯 Consistent",
    desc: "Active 30+ days",
    color: "#10b981",
  },
  top_scorer: {
    name: "🏆 Top Scorer",
    desc: "Reach #1 on leaderboard",
    color: "#fbbf24",
  },
  night_owl: {
    name: "🦉 Night Owl",
    desc: "Study past midnight 10 times",
    color: "#8b5cf6",
  },
  group_leader: {
    name: "👑 Group Leader",
    desc: "Lead 3+ group tasks",
    color: "#06b6d4",
  },
  bookworm: {
    name: "📚 Bookworm",
    desc: "Summarize 20+ notes",
    color: "#ec4899",
  },
};

export const prizeTiers = [
  {
    tier: "Diamond",
    xpRequired: 5000,
    reward: "₹500 Amazon Gift Card",
    icon: "💎",
    color: "#06b6d4",
  },
  {
    tier: "Gold",
    xpRequired: 3000,
    reward: "₹200 Amazon Gift Card",
    icon: "🥇",
    color: "#f59e0b",
  },
  {
    tier: "Silver",
    xpRequired: 1500,
    reward: "Premium Features Unlock",
    icon: "🥈",
    color: "#94a3b8",
  },
  {
    tier: "Bronze",
    xpRequired: 500,
    reward: "Custom Profile Badge",
    icon: "🥉",
    color: "#cd7c32",
  },
];

export const tasks = [
  {
    id: "t1",
    title: "Complete React Chapter 5",
    description: "Study hooks and context API",
    priority: "critical",
    status: "in-progress",
    category: "study",
    deadline: "2026-03-15",
    createdAt: "2026-03-10",
    xpReward: 50,
    tags: ["React", "Frontend"],
  },
  {
    id: "t2",
    title: "Submit ML Assignment",
    description: "Neural network implementation with TensorFlow",
    priority: "high",
    status: "todo",
    category: "assignment",
    deadline: "2026-03-16",
    createdAt: "2026-03-11",
    xpReward: 80,
    tags: ["ML", "Python"],
  },
  {
    id: "t3",
    title: "Review Data Structures Notes",
    description: "Binary trees and graph traversals",
    priority: "medium",
    status: "todo",
    category: "study",
    deadline: "2026-03-17",
    createdAt: "2026-03-12",
    xpReward: 30,
    tags: ["DSA", "Algorithms"],
  },
  {
    id: "t4",
    title: "Database Project Report",
    description: "Write MongoDB schema design document",
    priority: "high",
    status: "in-progress",
    category: "project",
    deadline: "2026-03-14",
    createdAt: "2026-03-08",
    xpReward: 60,
    tags: ["MongoDB", "Database"],
  },
  {
    id: "t5",
    title: "Practice Coding Problems",
    description: "Solve 5 LeetCode medium problems",
    priority: "medium",
    status: "done",
    category: "practice",
    deadline: "2026-03-13",
    createdAt: "2026-03-10",
    xpReward: 40,
    tags: ["DSA", "LeetCode"],
  },
  {
    id: "t6",
    title: "Read System Design Article",
    description: "Distributed systems fundamentals",
    priority: "low",
    status: "done",
    category: "study",
    deadline: "2026-03-12",
    createdAt: "2026-03-09",
    xpReward: 20,
    tags: ["System Design"],
  },
  {
    id: "t7",
    title: "Physics Lab Report",
    description: "Write up the pendulum experiment results",
    priority: "critical",
    status: "todo",
    category: "assignment",
    deadline: "2026-03-15",
    createdAt: "2026-03-11",
    xpReward: 70,
    tags: ["Physics", "Lab"],
  },
  {
    id: "t8",
    title: "Math Tutorial Worksheet",
    description: "Complete calculus integration exercises",
    priority: "low",
    status: "done",
    category: "study",
    deadline: "2026-03-11",
    createdAt: "2026-03-08",
    xpReward: 25,
    tags: ["Math", "Calculus"],
  },
];

export const groups = [
  {
    id: "g1",
    name: "Advanced React Course",
    description: "Study group for the Advanced React masterclass",
    leaderId: "u1",
    members: ["u1", "u3", "u5", "u8", "u9"],
    tasks: [
      {
        id: "gt1",
        title: "Solve Codeforces Contest",
        assignee: "u1",
        status: "in-progress",
        deadline: "2026-03-16",
      },
      {
        id: "gt2",
        title: "Review Graph Algorithms",
        assignee: "u2",
        status: "todo",
        deadline: "2026-03-17",
      },
      {
        id: "gt3",
        title: "Mock Interview Practice",
        assignee: "u3",
        status: "done",
        deadline: "2026-03-13",
      },
    ],
    xp: 14500,
    createdAt: "2026-01-15",
  },
  {
    id: "g2",
    name: "Machine Learning 101",
    description: "Working through Andrew Ng ML course",
    leaderId: "u2",
    members: ["u2", "u1", "u4", "u6"],
    tasks: [
      {
        id: "gt4",
        title: "Dataset Preprocessing",
        assignee: "u1",
        status: "done",
        deadline: "2026-03-12",
      },
      {
        id: "gt5",
        title: "Train CNN Model",
        assignee: "u4",
        status: "in-progress",
        deadline: "2026-03-18",
      },
      {
        id: "gt6",
        title: "Write Research Paper",
        assignee: "u6",
        status: "todo",
        deadline: "2026-03-20",
      },
    ],
    xp: 320,
    createdAt: "2026-02-01",
  },
  {
    id: "g3",
    name: "Exam Prep: Calculus",
    description: "Final exam study group for Math 301",
    leaderId: "u3",
    members: ["u3", "u7", "u10"],
    tasks: [
      {
        id: "gt7",
        title: "Design UI Mockups",
        assignee: "u3",
        status: "done",
        deadline: "2026-03-11",
      },
      {
        id: "gt8",
        title: "Build REST API",
        assignee: "u1",
        status: "in-progress",
        deadline: "2026-03-16",
      },
      {
        id: "gt9",
        title: "Deploy to Cloud",
        assignee: "u8",
        status: "todo",
        deadline: "2026-03-22",
      },
    ],
    xp: 280,
    createdAt: "2026-02-10",
  },
];

export const weeklyReport = {
  weekOf: "2026-03-08",
  completed: 3,
  pending: 4,
  ongoing: 2,
  totalXpEarned: 85,
  studyHours: 18.5,
  streakDays: 14,
  topCategory: "study",
  improvementTip:
    "Focus on completing high-priority assignments before deadlines.",
};

export const studyStats = {
  daily: [
    { day: "Mon", hours: 3.5, tasks: 2 },
    { day: "Tue", hours: 4.0, tasks: 3 },
    { day: "Wed", hours: 2.5, tasks: 1 },
    { day: "Thu", hours: 5.0, tasks: 4 },
    { day: "Fri", hours: 3.0, tasks: 2 },
    { day: "Sat", hours: 1.5, tasks: 1 },
    { day: "Sun", hours: 4.5, tasks: 3 },
  ],
  weekly: [
    { week: "W1", completed: 8, total: 12 },
    { week: "W2", completed: 10, total: 13 },
    { week: "W3", completed: 7, total: 11 },
    { week: "W4", completed: 12, total: 14 },
    { week: "W5", completed: 9, total: 12 },
    { week: "W6", completed: 11, total: 13 },
  ],
  categoryBreakdown: [
    { name: "Study", value: 40, color: "#6366f1" },
    { name: "Assignments", value: 25, color: "#ec4899" },
    { name: "Projects", value: 20, color: "#06b6d4" },
    { name: "Practice", value: 15, color: "#10b981" },
  ],
  heatmap: generateHeatmapData(),
};

function generateHeatmapData() {
  const data = [];
  const today = new Date("2026-03-14");
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5),
    });
  }
  return data;
}

export const aiSuggestions = [
  {
    type: "resource",
    title: "React Hooks Deep Dive",
    source: "YouTube - Fireship",
    url: "#",
    category: "lecture",
  },
  {
    type: "resource",
    title: "Understanding Neural Networks",
    source: "3Blue1Brown",
    url: "#",
    category: "lecture",
  },
  {
    type: "resource",
    title: "MongoDB Schema Design Best Practices",
    source: "MongoDB Blog",
    url: "#",
    category: "article",
  },
  {
    type: "resource",
    title: "Graph Algorithms Visualized",
    source: "VisuAlgo",
    url: "#",
    category: "tool",
  },
  {
    type: "task",
    title: "Review React Context API",
    priority: "high",
    reason: "Upcoming deadline for React Chapter 5",
  },
  {
    type: "task",
    title: "Practice Binary Tree Problems",
    priority: "medium",
    reason: "Weak area based on recent performance",
  },
];

export const notifications = [
  {
    id: "n1",
    type: "deadline",
    message: "Database Project Report due tomorrow!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "achievement",
    message: "You earned the 🔥 Streak King badge!",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "group",
    message: 'Arjun completed "Review Graph Algorithms"',
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    type: "ai",
    message: "AI scheduled 2 new tasks based on your pending work",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n5",
    type: "leaderboard",
    message: "You moved up to #3 on the leaderboard!",
    time: "2 days ago",
    read: true,
  },
];

export const avatarColors = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #f472b6)",
  "linear-gradient(135deg, #10b981, #34d399)",
  "linear-gradient(135deg, #f59e0b, #fbbf24)",
  "linear-gradient(135deg, #ef4444, #f87171)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #14b8a6, #2dd4bf)",
];

export const getAvatarColor = (index) =>
  avatarColors[index % avatarColors.length];
