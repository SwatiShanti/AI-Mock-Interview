/**
 * services/azureOpenAI.js — Azure OpenAI integration service
 * Handles: question generation + answer evaluation
 * Falls back to mock data if Azure credentials are not set
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

// ── Initialize client (lazy) ──────────────────────────────
let client = null;
const getClient = () => {
  if (!client && process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) {
    client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
    );
  }
  return client;
};

const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

// ── Helper: call Azure chat completion ────────────────────
const chatCompletion = async (messages) => {
  const cl = getClient();
  if (!cl) throw new Error('Azure OpenAI not configured');

  const result = await cl.getChatCompletions(DEPLOYMENT, messages, {
    temperature: 0.7,
    maxTokens: 2000,
  });

  return result.choices[0]?.message?.content || '';
};

/**
 * generateQuestions — Generate interview questions via Azure OpenAI
 * @param {string} jobRole
 * @param {string} difficulty
 * @param {string} jobDescription
 * @param {number} count
 * @returns {Array<{question: string, category: string}>}
 */
const generateQuestions = async (jobRole, difficulty, jobDescription = '', count = 5) => {
  const cl = getClient();

  // ── Fallback mock questions if Azure not configured ───
  if (!cl) {
    return getMockQuestions(jobRole, difficulty, count);
  }

  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a ${difficulty} level ${jobRole} position.
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Return ONLY valid JSON array in this format (no markdown, no extra text):
[
  { "question": "question text here", "category": "technical|behavioral|situational" }
]

Mix question types: technical skills, problem-solving, behavioral scenarios.
Difficulty: ${difficulty} (${difficulty === 'beginner' ? 'basic concepts' : difficulty === 'intermediate' ? 'practical experience required' : 'deep expertise expected'}).`;

  try {
    const content = await chatCompletion([
      { role: 'system', content: 'You are a professional technical interviewer. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Azure OpenAI error, falling back to mock questions:', error.message);
    return getMockQuestions(jobRole, difficulty, count);
  }
};

/**
 * evaluateAnswer — Evaluate a single answer and return score + feedback
 * @param {string} question
 * @param {string} answer
 * @param {string} jobRole
 * @param {string} difficulty
 * @returns {{ score: number, feedback: string }}
 */
const evaluateAnswer = async (question, answer, jobRole, difficulty) => {
  const cl = getClient();

  if (!cl || !answer?.trim()) {
    return {
      score: answer?.trim() ? 5 : 0,
      feedback: answer?.trim()
        ? 'Answer recorded. Azure OpenAI evaluation unavailable in demo mode.'
        : 'No answer provided.',
    };
  }

  const prompt = `You are evaluating an interview answer for a ${difficulty} ${jobRole} position.

Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate strictly and return ONLY valid JSON (no markdown):
{
  "score": <integer 0-10>,
  "feedback": "<2-3 sentence constructive feedback explaining the score, what was good, and what could improve>"
}`;

  try {
    const content = await chatCompletion([
      { role: 'system', content: 'You are a strict but fair technical interviewer. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Azure OpenAI eval error, using fallback:', error.message);
    return { score: 5, feedback: 'Answer evaluated in demo mode. Connect Azure OpenAI for detailed AI feedback.' };
  }
};

/**
 * generateOverallFeedback — Generate overall interview summary
 */
const generateOverallFeedback = async (jobRole, difficulty, questions, overallScore) => {
  const cl = getClient();

  if (!cl) {
    return {
      overallFeedback: `Overall performance for ${jobRole} (${difficulty}) interview: ${overallScore >= 70 ? 'Strong candidate' : overallScore >= 50 ? 'Moderate candidate — more preparation needed' : 'Needs significant improvement'}. Connect Azure OpenAI for detailed analysis.`,
      strengths: ['Completed the interview session', 'Attempted all questions'],
      improvements: ['Review core concepts', 'Practice more technical scenarios'],
    };
  }

  const summary = questions.map((q, i) =>
    `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || 'No answer'}\nScore: ${q.score}/10`
  ).join('\n\n');

  const prompt = `Based on this ${difficulty} ${jobRole} interview with overall score ${overallScore}/100:

${summary}

Return ONLY valid JSON:
{
  "overallFeedback": "<3-4 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"]
}`;

  try {
    const content = await chatCompletion([
      { role: 'system', content: 'You are a senior hiring manager providing interview feedback. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return {
      overallFeedback: `Interview completed with a score of ${overallScore}/100. Demo mode active.`,
      strengths: ['Completed the interview', 'Showed willingness to attempt all questions'],
      improvements: ['Connect Azure OpenAI for detailed improvement suggestions'],
    };
  }
};

// ── Mock Questions Fallback ───────────────────────────────
const getMockQuestions = (jobRole, difficulty, count) => {
  const role = jobRole.toLowerCase();
  
  const specializedMock = {
    frontend: [
      { question: "Explain the difference between Virtual DOM and Shadow DOM.", category: "technical" },
      { question: "How do you optimize a React application for better performance?", category: "technical" },
      { question: "Describe your experience with CSS-in-JS vs traditional CSS.", category: "technical" }
    ],
    backend: [
      { question: "Explain the difference between SQL and NoSQL databases.", category: "technical" },
      { question: "How do you handle authentication and authorization in a Node.js app?", category: "technical" },
      { question: "Describe how you would design a rate-limiting system.", category: "technical" }
    ],
    fullstack: [
      { question: "How do you manage state across a complex full-stack application?", category: "technical" },
      { question: "What is your preferred stack and why did you choose it for this project?", category: "technical" },
      { question: "Explain the CI/CD pipeline you would set up for a production app.", category: "technical" }
    ]
  };

  const genericMock = [
    { question: `What are the most important trends in ${jobRole} development today?`, category: 'technical' },
    { question: `Tell me about the most challenging project you've worked on as a ${jobRole}.`, category: 'behavioral' },
    { question: `How do you ensure code quality and testing in your ${jobRole} projects?`, category: 'technical' },
    { question: 'Tell me about a time you had to learn a new technology quickly under pressure.', category: 'behavioral' },
    { question: `If you joined our team as a ${jobRole}, what would be your first 30 days plan?`, category: 'situational' },
    { question: 'Describe a situation where you disagreed with a team decision. How did you handle it?', category: 'behavioral' },
    { question: 'How do you handle tight deadlines and competing priorities?', category: 'behavioral' },
    { question: 'Tell me about a project failure and what you learned from it.', category: 'behavioral' }
  ];

  let pool = [...genericMock];
  if (role.includes('front')) pool = [...specializedMock.frontend, ...pool];
  if (role.includes('back')) pool = [...specializedMock.backend, ...pool];
  if (role.includes('stack') || role.includes('full')) pool = [...specializedMock.fullstack, ...pool];

  // Shuffle and pick
  return pool.sort(() => 0.5 - Math.random()).slice(0, count);
};

module.exports = { generateQuestions, evaluateAnswer, generateOverallFeedback };
