/**
 * pages/LandingPage.jsx — Marketing landing page
 * Premium glassmorphism hero with features grid and CTA
 */
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import {
  HiSparkles, HiLightningBolt, HiChartBar, HiShieldCheck,
  HiArrowRight, HiCheckCircle,
} from 'react-icons/hi'
import { HiBriefcase, HiCpuChip, HiTrophy } from 'react-icons/hi2'

const FEATURES = [
  { icon: HiSparkles,  title: 'AI-Powered Questions',   desc: 'Azure OpenAI GPT-4o generates role-specific interview questions tailored to your experience level.',  color: 'from-primary-500 to-accent-600' },
  { icon: HiChartBar,  title: 'Instant Scoring',        desc: 'Get scored on a 10-point scale for every answer with detailed constructive feedback instantly.', color: 'from-emerald-500 to-teal-600'  },
  { icon: HiCpuChip,   title: 'Smart Evaluation',       desc: 'AI evaluates communication, technical accuracy, depth of knowledge and problem-solving approach.', color: 'from-amber-500 to-orange-600'  },
  { icon: HiBriefcase, title: '50+ Job Roles',          desc: 'Software Engineer, Product Manager, Data Scientist, DevOps, Designer and many more roles supported.', color: 'from-rose-500 to-pink-600'     },
  { icon: HiTrophy,    title: 'Track Progress',         desc: 'Review your full interview history with score trends, strengths analysis and improvement tips.', color: 'from-violet-500 to-purple-600'  },
  { icon: HiShieldCheck, title: 'Secure & Private',     desc: 'JWT authentication, encrypted storage. Your practice sessions stay completely private.', color: 'from-cyan-500 to-blue-600'       },
]

const STEPS = [
  { num: '01', title: 'Create Account',      desc: 'Sign up free and set up your profile in under a minute.' },
  { num: '02', title: 'Choose Role & Level', desc: 'Pick your target job role and difficulty level.' },
  { num: '03', title: 'Answer AI Questions', desc: 'Respond to AI-generated interview questions at your own pace.' },
  { num: '04', title: 'Get Feedback',        desc: 'Receive scores, detailed feedback, and improvement tips instantly.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-32 px-4 text-center">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-accent-600/8 blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full bg-primary-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-fade-in">
            <HiSparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">Powered by Microsoft Azure OpenAI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-up">
            Ace Your Next
            <br />
            <span className="gradient-text">Interview with AI</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance animate-slide-up">
            Practice with AI-generated questions tailored to your role. Get instant feedback, 
            scores, and actionable tips to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/signup" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 group">
              Start Free Practice
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4">
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-500 animate-fade-in">
            {['Free to use', 'No credit card required', 'Azure AI powered', 'Instant results'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <HiCheckCircle className="w-4 h-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50+',  label: 'Job Roles' },
            { value: '10k+', label: 'Questions Generated' },
            { value: '3',    label: 'Difficulty Levels' },
            { value: '100%', label: 'AI Powered' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-400 max-w-xl mx-auto">A complete AI interview coach that prepares you for real-world technical interviews.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card-hover p-6 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-primary-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">From signup to interview-ready in 4 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-black text-white text-sm shadow-glow">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 text-center">
        <div className="glass-card max-w-2xl mx-auto p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10 pointer-events-none" />
          <HiSparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Nail Your Interview?</h2>
          <p className="text-gray-400 mb-8">Join thousands of candidates practicing smarter with AI feedback.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2 group">
            Get Started Free
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-gray-600 text-sm">
        <p>© 2025 InterviewAI — Built with ❤️ using Microsoft Azure OpenAI</p>
      </footer>
    </div>
  )
}
