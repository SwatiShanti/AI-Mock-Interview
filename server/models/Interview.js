/**
 * models/Interview.js — Interview session schema
 * Stores full interview data: questions, answers, scores, feedback
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  feedback: { type: String, default: '' },
  score: { type: Number, default: 0, min: 0, max: 10 },
  category: { type: String, default: 'general' },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    jobDescription: {
      type: String,
      default: '',
      maxlength: [2000, 'Job description cannot exceed 2000 characters'],
    },
    questions: [questionSchema],
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    questionCount: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

// ── Auto-calculate overallScore from question scores ──────
interviewSchema.methods.calculateScore = function () {
  if (this.questions.length === 0) return 0;
  const total = this.questions.reduce((sum, q) => sum + q.score, 0);
  this.overallScore = Math.round((total / (this.questions.length * 10)) * 100);
  return this.overallScore;
};

module.exports = mongoose.model('Interview', interviewSchema);
