/**
 * controllers/interview.controller.js — Interview endpoints
 * POST /api/interview/start        - Generate questions
 * POST /api/interview/submit       - Submit answers + get AI evaluation
 * GET  /api/interview/:id          - Get interview by ID
 */

const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateQuestions, evaluateAnswer, generateOverallFeedback } = require('../services/azureOpenAI');

// ── Start Interview — Generate Questions ──────────────────
const startInterview = async (req, res, next) => {
  try {
    const { jobRole, difficulty, jobDescription, questionCount = 5 } = req.body;

    if (!jobRole || !difficulty) {
      return res.status(400).json({ success: false, message: 'Job role and difficulty are required' });
    }

    const count = Math.min(Math.max(parseInt(questionCount), 3), 10);

    // Generate questions via Azure OpenAI
    const generatedQuestions = await generateQuestions(jobRole, difficulty, jobDescription, count);

    // Create interview session in DB
    const interview = await Interview.create({
      user: req.user._id,
      jobRole,
      difficulty,
      jobDescription,
      questionCount: count,
      questions: generatedQuestions.map((q) => ({
        question: q.question,
        category: q.category || 'general',
      })),
      status: 'in_progress',
    });

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      interview: {
        _id: interview._id,
        jobRole: interview.jobRole,
        difficulty: interview.difficulty,
        questions: interview.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          category: q.category,
        })),
        status: interview.status,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Submit Interview — Evaluate Answers ───────────────────
const submitInterview = async (req, res, next) => {
  try {
    const { interviewId, answers, duration } = req.body;

    if (!interviewId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Interview ID and answers array are required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Evaluate each answer via Azure OpenAI
    const evaluatedQuestions = await Promise.all(
      interview.questions.map(async (q, index) => {
        const answer = answers[index]?.answer || '';
        const evaluation = await evaluateAnswer(q.question, answer, interview.jobRole, interview.difficulty);
        return {
          ...q.toObject(),
          answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
        };
      })
    );

    // Calculate overall score
    const totalScore = evaluatedQuestions.reduce((sum, q) => sum + q.score, 0);
    const overallScore = Math.round((totalScore / (evaluatedQuestions.length * 10)) * 100);

    // Generate overall feedback
    const summary = await generateOverallFeedback(
      interview.jobRole,
      interview.difficulty,
      evaluatedQuestions,
      overallScore
    );

    // Update interview document
    interview.questions = evaluatedQuestions;
    interview.overallScore = overallScore;
    interview.overallFeedback = summary.overallFeedback;
    interview.strengths = summary.strengths || [];
    interview.improvements = summary.improvements || [];
    interview.status = 'completed';
    interview.duration = duration || 0;
    await interview.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalInterviews += 1;
    user.averageScore = Math.round(
      (user.averageScore * (user.totalInterviews - 1) + overallScore) / user.totalInterviews
    );
    await user.save();

    res.json({
      success: true,
      message: 'Interview submitted and evaluated successfully',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Interview by ID ───────────────────────────────────
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, submitInterview, getInterview };
