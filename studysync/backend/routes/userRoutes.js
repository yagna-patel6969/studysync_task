const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get Leaderboard Data (Top 50 users sorted by Score)
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('-password')
      .sort({ score: -1 })
      .limit(50);
      
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update current user's level or badges (Internal/Gamification utility)
// This would ideally be triggered via webhooks or chron jobs in a real app
// For now, simple endpoint to test adding badges
router.put('/:id/badges', async (req, res) => {
  try {
    const { badge } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.badges.includes(badge)) {
      user.badges.push(badge);
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
