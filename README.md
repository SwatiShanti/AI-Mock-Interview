# 🤖 InterviewAI — AI Mock Interview Platform

A **production-ready, full-stack AI Mock Interview Platform** built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB + Azure OpenAI** (backend).

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 JWT Auth | Signup, Login, protected routes |
| 🤖 AI Questions | Azure OpenAI GPT-4o generates role-specific questions |
| 📝 Q&A Session | Live interview with timer and progress tracking |
| 📊 AI Evaluation | Per-question scoring (0–10) and detailed feedback |
| 📈 Dashboard | Score trends, role breakdown, recent interviews |
| 📋 History | Paginated interview history with delete & view |
| 🎨 Dark UI | Glassmorphism design with animations |
| 📱 Responsive | Mobile-first, fully responsive layout |

---

## 🗂 Project Structure

```
AI-Mock-Interview/
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── api/         # Axios + API modules
│       ├── components/  # Navbar, Spinner, ProtectedRoute
│       ├── context/     # AuthContext, InterviewContext
│       ├── hooks/       # useAuth, useInterview, useTimer
│       ├── pages/       # Landing, Login, Signup, Dashboard, Setup, Interview, Report, History
│       └── utils/       # helpers.js
├── server/          # Node.js + Express + MongoDB backend
│   ├── config/      # db.js
│   ├── controllers/ # auth, interview, history
│   ├── middleware/  # authMiddleware, errorHandler
│   ├── models/      # User, Interview
│   ├── routes/      # auth, interview, history routes
│   ├── services/    # azureOpenAI.js
│   └── utils/       # generateToken.js
├── package.json     # Root — runs both with concurrently
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [MongoDB](https://mongodb.com) (local) or [MongoDB Atlas](https://mongodb.com/atlas) URI

### 1️⃣ Install All Dependencies

```powershell
cd C:\Users\swaTI\Desktop\AI-Mock-Interview

# Install root + client + server dependencies
npm run install:all
```

### 2️⃣ Configure Server Environment

```powershell
copy server\.env.example server\.env
```

Open `server\.env` and set at minimum:
```env
MONGO_URI=mongodb://localhost:27017/ai_mock_interview
JWT_SECRET=your_super_secret_key_here

# Optional — for real AI (works in demo mode without these)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### 3️⃣ Start Development Servers

```powershell
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**:  http://localhost:5000
- **Health**:   http://localhost:5000/api/health

---

## 🐳 Docker Support

You can run the entire stack (Frontend, Backend, MongoDB) using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost
- **Backend**:  http://localhost:5000
- **MongoDB**:  localhost:27017

> **Note:** Without Azure OpenAI credentials, the app runs in **demo mode** with intelligent mock questions and fallback feedback. Everything else works fully.

---

## 🔑 Azure OpenAI Setup (Optional)

1. Create an [Azure OpenAI resource](https://portal.azure.com)
2. Deploy a `gpt-4o` model in Azure AI Studio
3. Copy your **endpoint** and **API key** to `server/.env`

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/interview/start` | ✅ | Generate AI questions |
| POST | `/api/interview/submit` | ✅ | Submit answers for evaluation |
| GET | `/api/interview/:id` | ✅ | Get interview by ID |
| GET | `/api/history` | ✅ | Paginated history |
| GET | `/api/history/stats` | ✅ | User statistics |
| DELETE | `/api/history/:id` | ✅ | Delete interview |

---

## ☁️ Azure App Service Deployment

### Backend
```bash
# In server/ directory
az webapp up --name your-api-name --resource-group your-rg --runtime "NODE:18-lts"
```

Set environment variables in **Azure Portal → App Service → Configuration**.

### Frontend
```bash
cd client
npm run build
# Deploy dist/ to Azure Static Web Apps or Azure CDN
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP | Axios |
| Charts | Recharts |
| Icons | React Icons (Heroicons) |
| Toasts | React Hot Toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI | Azure OpenAI SDK (@azure/openai) |
| Security | Helmet, express-rate-limit, CORS |

---

## 📄 License

MIT — Built with ❤️ using Microsoft Azure OpenAI
