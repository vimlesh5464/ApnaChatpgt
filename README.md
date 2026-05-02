ApnaGPT – AI Chat Application (Full Stack SaaS Clone)

ApnaGPT is a full-stack AI-powered conversational platform inspired by ChatGPT.
It demonstrates real-world SaaS architecture, including authentication, persistent chat memory, AI integration, and scalable backend design.

The project is built to showcase production-level full-stack engineering skills using modern technologies.

🚀 Live Overview

ApnaGPT allows users to:

💬 Chat with an AI assistant in real time
🧵 Maintain multiple conversation threads (ChatGPT-like memory system)
⚙️ Manage personal settings (profile, theme, notifications)
🔐 Secure authentication using JWT-based login system
💾 Persist chat history across sessions
🧠 Key Highlights (Recruiter Focus)
🔐 JWT-based secure authentication system
💬 Multi-threaded chat architecture (like ChatGPT)
🧠 OpenAI API integration for intelligent responses
⚙️ User settings system stored in database
🌗 Dark/Light theme using global state management
🗄️ PostgreSQL + SQLAlchemy ORM for persistence
🧩 Clean layered backend architecture (Routes → Services → Models)
⚡ React Context API for global frontend state management
🔄 RESTful API design with proper separation of concerns


🏗️ System Architecture
Frontend (React)
      ↓
FastAPI Backend (REST API Layer)
      ↓
Service Layer (Business Logic / AI / Auth)
      ↓
Database Layer (PostgreSQL via SQLAlchemy)


🛠️ Tech Stack
Frontend
React.js
Context API
React Router DOM
CSS3
Fetch API


Backend
FastAPI
SQLAlchemy ORM
PostgreSQL
JWT Authentication (python-jose)
Passlib (bcrypt password hashing)
OpenAI API integration

📁 Project Structure

Backend
Backend/app
├── core/        → Config + Security (JWT)
├── db/          → Database connection
├── models/      → Database models (User, Chat, Settings)
├── routes/      → API endpoints
├── schemas/     → Request/Response validation
├── services/    → Business logic (Auth, AI, etc.)
└── main.py      → App entry point

Frontend
Frontend/src
├── api/         → API service layer
├── pages/       → Login, Register, Settings, Upgrade
├── components/  → UI components (Sidebar, ProtectedRoute)
├── context/     → Global state (MyContext)
├── ChatWindow   → Main chat UI
└── App.jsx

🚀 Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/vimlesh5464/ApnaChatpgt

cd ApnaGPT-main
2️⃣ Backend Setup
cd Backend

python -m venv env
source env/bin/activate   # Windows: env\Scripts\activate

pip install -r requirements.txt
Run Backend
uvicorn app.main:app --reload

3️⃣ Frontend Setup
cd Frontend
npm install
npm run dev

🔐 Environment Variables

Create .env file inside Backend:

DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_api_key

🧠 System Design Explanation (Interview Ready)

1. Authentication Flow
User logs in → backend generates JWT token
Token stored in localStorage
Sent via Authorization header for protected routes

2. Chat System Design
Each conversation = Thread
Each message stored in database
Messages separated into user and assistant roles
Enables persistent chat memory

3. AI Integration
Backend calls OpenAI API
Response processed in service layer
Stored in database before sending to frontend

4. State Management
React Context API used for:
Theme (dark/light)
Chat state
Thread management
User prompt handling

5. Settings System
User settings stored per account
Synced between frontend and backend
Includes profile, theme, notifications
⚠️ Known Improvements (Shows Engineering Maturity)
Add WebSockets for real-time streaming chat
Add Redis caching for faster responses
Add rate limiting for API protection
Dockerize full system
Deploy on cloud (AWS / Render / Vercel)
👨‍💻 Author

Vimlesh Gupta
Full Stack Developer 

GitHub: https://github.com/vimlesh5464
Project: ApnaGPT