const express = require('express');
const Task = require('../models/Task');
const protect = require('./middleware/authMiddleware');

const router = express.Router();

// POST /api/ai/summarize
// Returns a simple breakdown of the submitted text (no external LLM needed)
router.post('/summarize', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ message: 'Please provide at least 20 characters of text to summarize.' });
    }

    const words = text.trim().split(/\s+/);
    const sentences = text.trim().split(/[.!?]+/).filter(Boolean);
    const wordCount = words.length;

    // Extract key terms (words > 5 chars, deduplicated, max 6)
    const stopWords = new Set(['about', 'which', 'where', 'their', 'there', 'these', 'those', 'would', 'could', 'should', 'because', 'before', 'after', 'during']);
    const keyTerms = [...new Set(
      words
        .map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
        .filter(w => w.length > 5 && !stopWords.has(w))
    )].slice(0, 6);

    // Return a structured placeholder summary
    res.json({
      summary: `Your text contains ${wordCount} words across ${sentences.length} sentences. Key concepts identified: ${keyTerms.join(', ')}.`,
      keyPoints: sentences.slice(0, 4).map(s => s.trim()).filter(s => s.length > 10),
      relatedTopics: keyTerms.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      realWorldUse: 'Continue studying and adding more context to get richer AI-powered insights.',
      importance: `This topic covers ${wordCount} words — a solid study session!`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/ai/chat
// Returns a helpful template response for the study doubt solver
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // Derive a helpful response based on the user's question
    const keywords = message.trim().split(/\s+/).filter(w => w.length > 3).slice(0, 3).join(', ');

    res.json({
      reply: `Great question about "${message}"!\n\nHere's a structured approach to understanding this:\n\n1. **Break it down**: Identify the core concept — what is the fundamental principle being asked?\n\n2. **Connect to examples**: Think of a real-world scenario where this applies. How does it work in practice?\n\n3. **Key terms**: Focus on these terms: ${keywords || 'the main concepts in your question'}.\n\n4. **Next steps**: Review your notes on this topic, and try solving a related practice problem.\n\n💡 Pro tip: Explaining the concept out loud to yourself (the Feynman Technique) is one of the most effective ways to solidify understanding!`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/ai/resources
// Returns resource suggestions derived from the user's own task tags
router.get('/resources', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).select('tags category').limit(20);

    // Collect unique tags across all tasks
    const allTags = [];
    tasks.forEach(t => { if (t.tags) allTags.push(...t.tags); });
    const uniqueTags = [...new Set(allTags)].slice(0, 5);

    if (uniqueTags.length === 0) {
      return res.json([]);
    }

    // Build a resource suggestion per tag
    const resourceMap = {
      'React': { title: 'React Hooks Deep Dive', source: 'YouTube – Fireship', category: 'lecture', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
      'Python': { title: 'Python for Everybody', source: 'Coursera – University of Michigan', category: 'lecture', url: 'https://www.coursera.org/specializations/python' },
      'ML': { title: 'Machine Learning Specialization', source: 'Coursera – Andrew Ng', category: 'lecture', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      'DSA': { title: 'Data Structures & Algorithms Visualized', source: 'VisuAlgo', category: 'tool', url: 'https://visualgo.net' },
      'Database': { title: 'MongoDB Schema Design Best Practices', source: 'MongoDB Blog', category: 'article', url: 'https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/' },
      'Frontend': { title: 'The Odin Project – Full Stack', source: 'theodinproject.com', category: 'article', url: 'https://www.theodinproject.com' },
      'System Design': { title: 'System Design Primer', source: 'GitHub – donnemartin', category: 'article', url: 'https://github.com/donnemartin/system-design-primer' },
      'LeetCode': { title: 'Grind 75 – Curated LeetCode List', source: 'techinterviewhandbook.org', category: 'tool', url: 'https://www.techinterviewhandbook.org/grind75' },
    };

    const suggestions = uniqueTags.map(tag => {
      // Try exact match first, then partial match, then a generic fallback
      const match = resourceMap[tag] || Object.entries(resourceMap).find(([k]) => tag.toLowerCase().includes(k.toLowerCase()))?.[1];
      if (match) return { ...match, tag };
      return {
        title: `${tag} – Comprehensive Guide`,
        source: 'Search on MDN / Wikipedia',
        category: 'article',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(tag)}`,
        tag,
      };
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/ai/suggestions
// Returns the user's own pending/overdue tasks as "AI suggested" focus items
router.get('/suggestions', protect, async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      user: req.user.id,
      status: { $in: ['todo', 'in-progress'] },
    })
      .sort({ deadline: 1, priority: 1 })
      .limit(5);

    const priorityLabel = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

    const suggestions = tasks.map(task => {
      const daysLeft = task.deadline
        ? Math.ceil((new Date(task.deadline) - now) / (1000 * 60 * 60 * 24))
        : null;
      let reason = 'Pending task in your list';
      if (daysLeft !== null) {
        if (daysLeft < 0) reason = `Overdue by ${Math.abs(daysLeft)} day(s) — needs immediate attention`;
        else if (daysLeft === 0) reason = 'Due today!';
        else if (daysLeft === 1) reason = 'Due tomorrow';
        else reason = `Due in ${daysLeft} days`;
      }

      return {
        title: task.title,
        priority: task.priority || 'medium',
        priorityLabel: priorityLabel[task.priority] || 'Medium',
        reason,
        deadline: task.deadline,
        status: task.status,
      };
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
