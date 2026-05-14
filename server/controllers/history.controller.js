/**
 * controllers/history.controller.js — Interview history endpoints
 * GET /api/history        - Get paginated interview history
 * GET /api/history/stats  - Get user statistics
 * DELETE /api/history/:id - Delete an interview
 */

const Interview = require('../models/Interview');

// ── Get Interview History ─────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Interview.countDocuments({ user: req.user._id, status: 'completed' });
    const interviews = await Interview.find({ user: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('jobRole difficulty overallScore duration questionCount createdAt strengths improvements');

    res.json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get User Stats ────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const total = await Interview.countDocuments({ user: userId, status: 'completed' });

    const scoreAgg = await Interview.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$overallScore' },
          maxScore: { $max: '$overallScore' },
          totalDuration: { $sum: '$duration' },
        },
      },
    ]);

    // Last 7 interviews for trend chart
    const recent = await Interview.find({ user: userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('jobRole overallScore createdAt difficulty');

    // Role distribution
    const byRole = await Interview.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: '$jobRole', count: { $sum: 1 }, avgScore: { $avg: '$overallScore' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const stats = scoreAgg[0] || { avgScore: 0, maxScore: 0, totalDuration: 0 };

    res.json({
      success: true,
      stats: {
        totalInterviews: total,
        averageScore: Math.round(stats.avgScore || 0),
        bestScore: Math.round(stats.maxScore || 0),
        totalTime: Math.round((stats.totalDuration || 0) / 60), // minutes
        recentInterviews: recent.reverse(),
        byRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Interview ──────────────────────────────────────
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await interview.deleteOne();
    res.json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getStats, deleteInterview };
