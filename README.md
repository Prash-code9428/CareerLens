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

## Google Cloud Vertex AI Setup

CareerLens uses the official `@google-cloud/vertexai` SDK authenticated via **Application Default Credentials (ADC)**. No API keys or downloaded service-account JSON files are needed.

### Local Development Setup
1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticate your local development environment:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```
3. Set your active Google Cloud project:
   ```bash
   gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
   ```
4. Enable the Vertex AI API:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```
5. Set `GOOGLE_CLOUD_PROJECT_ID=YOUR_GOOGLE_CLOUD_PROJECT_ID` in `server/.env`.

### Production (Google Cloud Run)
In Cloud Run, the backend automatically inherits permissions from its attached **Service Identity / Service Account** (`roles/aiplatform.user`), eliminating the need for credential files.

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
