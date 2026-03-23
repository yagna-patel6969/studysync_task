const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const Task = require('../models/Task');
const protect = require('./middleware/authMiddleware');
const sendEmail = require('../utils/email');

const router = express.Router();
const appUrl = process.env.APP_URL || 'http://localhost:5173';

// Get all groups for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate('members', 'name email initials score level streak')
      .populate('leaderId', 'name email initials');
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new group
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, emails } = req.body;
    
    let members = [req.user.id];
    
    // Find users by email to add them
    if (emails && emails.trim().length > 0) {
      const emailList = emails.split(',').map(e => e.trim());
      const usersToInvite = await User.find({ email: { $in: emailList } });
      const foundEmails = usersToInvite.map(u => u.email.toLowerCase());
      const missingEmails = emailList.filter(e => !foundEmails.includes(e.toLowerCase()));

      if (missingEmails.length > 0) {
        // Fire off email invitations in the background
        missingEmails.forEach((missingEmail) => {
          sendEmail({
            email: missingEmail,
            subject: `You've been invited to a StudySync Group!`,
            message: `Hi there!\n\n${req.user.name || 'A user'} has invited you to join the group "${name}" on StudySync.\n\nPlease register at ${appUrl}/register to collaborate on tasks and study together!\n\nCheers,\nThe StudySync Team`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #6366f1;">Welcome to StudySync! 📚</h2>
                <p>Hi there,</p>
                <p><strong>${req.user.name || 'A user'}</strong> has invited you to join their study group: <strong>${name}</strong>.</p>
                <p>StudySync is an AI-powered gamified platform to help you track tasks, collaborate, and boost your productivity.</p>
                <a href="${appUrl}/register" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">Create an Account</a>
                <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">Cheers,<br/>The StudySync Team</p>
              </div>
            `
          }).catch(err => console.error('Failed to send invite email:', err));
        });
      }

      members = [...members, ...usersToInvite.map(u => u._id.toString())];
      
      // Remove duplicates
      members = [...new Set(members)];
    }

    const group = new Group({
      name,
      description,
      leaderId: req.user.id,
      members,
      xp: 0
    });

    const savedGroup = await group.save();
    
    const populatedGroup = await Group.findById(savedGroup._id)
      .populate('members', 'name email initials score level streak')
      .populate('leaderId', 'name email initials');
      
    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Quit a group
router.post('/:id/quit', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the leader
    if (group.leaderId.toString() === req.user.id) {
      return res.status(400).json({ message: 'Leader cannot quit. Reassign leader or delete group.' });
    }
    
    // Remove user
    group.members = group.members.filter(mId => mId.toString() !== req.user.id);
    await group.save();
    
    res.json({ message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for a specific group
router.get('/:id/tasks', protect, async (req, res) => {
  try {
    const groupTasks = await Task.find({ groupId: req.params.id })
      .populate('assignee', 'name initials id');
    res.json(groupTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
