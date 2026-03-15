const express = require('express');
const { google } = require('googleapis');
const User = require('../models/User');
const Task = require('../models/Task');
const protect = require('./middleware/authMiddleware');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Get OAuth URL
router.get('/auth', protect, (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: req.user.id // Pass user ID through state
  });

  res.json({ url });
});

// OAuth Callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Ensure we save the refresh token to the specific user passed in state
    if (tokens.refresh_token && state) {
      await User.findByIdAndUpdate(state, {
        googleRefreshToken: tokens.refresh_token
      });
    }

    // Redirect to frontend profile with success flag
    res.redirect('http://localhost:5173/profile?calendar=success');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.redirect('http://localhost:5173/profile?calendar=error');
  }
});

// Get Calendar Link Status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ isLinked: !!user.googleRefreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Sync a specific task to Calendar
router.post('/sync/:taskId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.googleRefreshToken) {
      return res.status(400).json({ message: 'Google Calendar not linked. Please link your account in the Profile page.' });
    }

    const task = await Task.findOne({ _id: req.params.taskId, assignee: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.deadline) {
      return res.status(400).json({ message: 'Task has no deadline to sync' });
    }

    oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Set event to last for 1 hour on the deadline date
    const eventStartDate = new Date(task.deadline);
    const eventEndDate = new Date(eventStartDate.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `[StudySync] ${task.title}`,
      description: task.description || 'Synced from StudySync',
      start: {
        dateTime: eventStartDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventEndDate.toISOString(),
        timeZone: 'UTC',
      },
      colorId: '9' // Blueberry color
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.json({ message: 'Task synced successfully', eventLink: response.data.htmlLink });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ message: 'Failed to sync to calendar', error: error.message });
  }
});

// Unlink Calendar
router.post('/unlink', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.googleRefreshToken = null;
    await user.save();
    res.json({ message: 'Calendar unlinked successfully' });
  } catch(error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
