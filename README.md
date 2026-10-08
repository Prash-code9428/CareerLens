# CareerLens

AI-powered job and internship discovery platform for students preparing for placements.

## Problem Statement
**Problem Statement 4: Open Innovation (Student Pain Points)**
- Placement preparation
- Internships & job discovery
- Eliminating information overload & wasted search time
- Identifying skill gaps and building application confidence

## Core Flow
1. **Student Onboarding**: Account creation and candidate profile setup.
2. **Resume Intelligence**: PDF resume uploaded to Supabase Storage and parsed/analyzed via Google Cloud Vertex AI using Application Default Credentials (ADC).
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

## Environment Variables

### Setup Instructions
1. Copy `.env.example` to `.env` in the root workspace for local development:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required values for your database, storage, and search providers.
3. **Never commit `.env`** — it is strictly ignored by `.gitignore`.
4. **Never expose backend secrets to the frontend** — the frontend only receives safe `VITE_` prefixed variables.
5. **Vertex AI Local Authentication**: Authenticates via Google Cloud Application Default Credentials (`gcloud auth application-default login`). No API keys or JSON key files are used.
6. **Cloud Run Production Deployment**: Configured via Cloud Run environment variables and runtime Service Identity IAM permissions (`roles/aiplatform.user`). The production backend does not depend on local `.env` files.

### Environment Variable Reference

| Variable | Purpose | Frontend/Backend | Secret? |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend HTTP server listening port | Backend | No |
| `NODE_ENV` | Application environment (`development` / `production`) | Backend | No |
| `CLIENT_URL` | Allowed CORS origin for frontend | Backend | No |
| `MONGODB_URI` | MongoDB Atlas database connection string | Backend | **Yes** |
| `JWT_SECRET` | Secret key used to sign and verify JWT auth tokens | Backend | **Yes** |
| `SUPABASE_URL` | Supabase project API URL | Backend | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for storage upload/download | Backend | **Yes** |
| `SUPABASE_BUCKET` | Supabase storage bucket name (`resumes`) | Backend | No |
| `CONTEXT_API_KEY` | Context.dev live web search API key | Backend | **Yes** |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID for Vertex AI | Backend | No |
| `VERTEX_AI_LOCATION` | Vertex AI regional endpoint (e.g. `us-central1`) | Backend | No |
| `VERTEX_AI_MODEL` | Vertex AI Gemini model identifier (e.g. `gemini-1.5-pro`) | Backend | No |
| `VITE_API_BASE_URL` | Base HTTP endpoint for frontend API requests | Frontend | No |

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
5. Set `GOOGLE_CLOUD_PROJECT_ID=YOUR_GOOGLE_CLOUD_PROJECT_ID` in your `.env`.

### Production (Google Cloud Run)
In Cloud Run, the backend automatically inherits permissions from its attached **Runtime Service Account** with IAM role `roles/aiplatform.user`, eliminating the need for credential files.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Cloud CLI (with ADC configured for Vertex AI)
- MongoDB Atlas connection string

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

## Production Deployment (Google Cloud Run)

For complete step-by-step instructions on deploying the CareerLens backend container to Google Cloud Run with Artifact Registry and Vertex AI runtime IAM permissions, refer to the [Deployment Guide](DEPLOYMENT.md).
