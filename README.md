# CareerLens

AI-powered job and internship discovery platform for students preparing for placements.

## Problem Statement
**Problem Statement 4: Open Innovation (Student Pain Points)**
- Placement preparation
- Internships & job discovery
- Eliminating information overload & wasted search time
- Identifying skill gaps and building application confidence

## Core Flow
1. **Student Onboarding**: Account creation and profile setup.
2. **Resume Intelligence**: Resume uploaded to Supabase Storage and parsed/analyzed via Google Cloud Vertex AI using Application Default Credentials (ADC).
3. **Smart Opportunity Research**: Context.dev researches live opportunities matching student profile.
4. **AI Fit Analysis**: Vertex AI evaluates match scores, highlighting matching skills, missing skills, and actionable insights.
5. **Direct Application**: Student reviews match insights and navigates to the original listing to apply.

## Project Structure
```
CareerLens/
├── client/          # Frontend (React, Vite, Tailwind CSS, React Router, Lucide)
├── server/          # Backend (Node.js, Express, Mongoose, Vertex AI, Context.dev)
├── evidence/        # User research, student survey and interview evidence
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Cloud CLI (with ADC configured for Vertex AI)
- MongoDB Atlas connection string

### Environment Setup
Copy `.env.example` to `server/.env` and configure your credentials:
```bash
cp .env.example server/.env
```

### Running Locally
1. **Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
