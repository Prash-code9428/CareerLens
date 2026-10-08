# CareerLens

AI-powered student placement and internship discovery platform that transforms resume understanding, live market opportunity research, and skill-gap intelligence into confident applications.

---

## What It Does

CareerLens helps students discover relevant jobs and internships by:
1. **Understanding their resume**: Securely extracting structured technical competencies, projects, and education from PDF resumes using Google Cloud Vertex AI.
2. **Researching live opportunities**: Generating targeted search queries to discover active 2026 hiring listings via Context.dev live web search.
3. **Matching skills with clarity**: Evaluating candidate skills against explicitly stated role requirements, computing transparent match scores, pinpointing matching and missing skills, and providing actionable AI recommendations.

---

## Problem Definition

* **Target Users**: University students and early-career candidates preparing for internships, campus placements, and entry-level software engineering roles.
* **Information Overload & Search Fatigue**: Job postings are scattered across dozens of career portals, bloated with repetitive text and ambiguous requirements.
* **Qualification Uncertainty**: Students often hesitate or abandon applications because they cannot tell whether missing one or two listed skills disqualifies them.
* **Fragmented Tooling**: Students currently juggle static resume builders, generic keyword checkers, and fragmented job boards that offer no integrated insight into why a candidate is or isn't a fit.

---

## Evidence of Student Need

Findings from student survey research stored in [`evidence/README.md`](evidence/README.md) (Sample size: 16 tech students and early-career candidates) confirm the friction:

* **Application Fatigue**: **43.8%** of respondents spend 15–30+ minutes manually tailoring their resume for each application; **25.0%** have refrained from applying because the manual tailoring process takes too much time.
* **Hesitation & Uncertainty**: When missing 1 or 2 listed skills, **37.5%** frequently hesitate to apply and **62.5%** sometimes hesitate (**0%** apply without hesitation).
* **Lack of Visibility**: **56.3%** guess and hope for the best regarding how their qualifications align with job descriptions.
* **Key Student Feedback**:
  > *"Job descriptions are often long, repetitive, and filled with 'nice-to-have' skills, making it hard to tell what I truly need to qualify for the role."*
  >
  > *"The most valuable feature would be personalized skill-gap analysis with a clear action plan—showing exactly what skills I'm missing for the jobs I want and what to learn next."*

---

## Existing Tools Gap

| Existing Approach | Limitation | CareerLens Advantage |
| :--- | :--- | :--- |
| **Generic Job Boards** (LinkedIn, Indeed) | Keyword-based, cluttered, and impersonal; ignores candidate resume depth. | Discovers active opportunities targeted to candidate profile facts and preferred work modes. |
| **Resume Scanners / ATS Checkers** | Static keyword score without finding actual opportunities to apply for. | Connects parsed resume competencies directly to live market job discovery. |
| **Manual Platform Searching** | Fragmented, repetitive, and high context-switching friction. | Automated research across live career sites with deduplicated results. |
| **Generic AI Chatbots** | Requires manual prompt pasting, lacks persistent storage, and produces hallucinations. | Grounded structured schema analysis that strictly checks overlap without hallucinating requirements. |

---

## What We Built

* **JWT Authentication**: User registration, password hashing (`bcryptjs`), and secure session management.
* **Candidate Profile**: Configurable educational background, target location, experience level, and preferred roles.
* **Resume Upload & Storage**: PDF upload with 5MB validation, stored securely in Supabase Storage under user-isolated paths.
* **Resume Text Extraction**: In-memory parsing (`pdf-parse`) with `%PDF-` header validation and whitespace cleanup.
* **Vertex AI Resume Intelligence**: Structured extraction of summary, skills, programming languages, frameworks, databases, tools, projects, and verified certifications.
* **Live Opportunity Research**: Dynamic generation of 3–5 search queries via Vertex AI and live web scraping through Context.dev.
* **Vertex AI Opportunity Matching**: Ground-truth matching evaluating candidate skills against opportunity criteria adhering to OpenAPI schemas.
* **Match Score & Recommendations**: Clamped 0–100 match scoring, categorizing roles into *Strong Match*, *Good Match*, *Possible Match*, or *Low Match*.
* **Matching Skills & Skill Gaps**: Highlights candidate matching skills and explicitly identifies missing skills.
* **Client-Side Filtering & Sorting**: Filter by Job Type, Work Mode, Match Score thresholds, and keyword search; sort by Best Match or Recently Found.
* **Opportunity Details & Direct Apply**: Detailed view with reason breakdown and direct external application link (`target="_blank"`).

---

## Architecture

```
React + Vite Frontend (SPA)
        ↓  HTTPS (JWT Auth / REST)
Google Cloud Run (Containerized Backend)
        ↓
Node.js + Express Server
   ├── MongoDB Atlas       → Candidate profiles, credentials, preferences
   ├── Supabase Storage    → Encrypted, user-isolated PDF resume documents
   ├── Context.dev API     → Live web research & hiring portal scraping
   └── Google Cloud Vertex AI → Resume intelligence & structured opportunity matching
```

### Why Each Component Was Chosen:
* **React + Vite**: Fast build times, responsive client-side filtering, and polished dark-mode UI.
* **Node.js + Express**: Lightweight, asynchronous I/O handling file buffers, AI prompts, and database operations.
* **MongoDB Atlas**: Flexible document model for structured candidate profiles and evolving preference schemas.
* **Supabase Storage**: Managed S3-compatible object storage with fine-grained bucket limits for resume files.
* **Context.dev**: Live web search API that discovers real-time internship and job listings.
* **Google Cloud Vertex AI**: Enterprise generative foundation models (`gemini-1.5-pro` / `gemini-2.5-flash`) providing structured JSON output conforming to strict OpenAPI schemas.
* **Google Cloud Run**: Serverless container hosting with automatic scaling and native IAM service identity.

---

## Google Cloud / Vertex AI Integration

* **AI Capabilities**: Powers candidate profile extraction from resume text and compatibility scoring for discovered opportunities.
* **Local Development Authentication**: Uses **Application Default Credentials (ADC)** via the `gcloud` CLI (`gcloud auth application-default login`).
* **Production Authentication (Cloud Run)**: Uses the attached Cloud Run **Runtime Service Account** with the `roles/aiplatform.user` IAM role.
* **Zero Credential Bundling**: No service-account JSON files, private keys, or API keys are committed or bundled into Docker images.

---

## How It Works

```
1. Create Account & Setup Profile
   └── Input education, graduation year, target location, and preferred roles.

2. Upload Resume PDF
   └── File is validated (≤ 5MB, PDF MIME/header) and uploaded to Supabase Storage.

3. AI Resume Analysis (Vertex AI)
   └── Text is parsed and normalized into structured skills, frameworks, and projects.

4. Find Opportunities (Context.dev + Vertex AI)
   └── Vertex AI crafts focused search queries; Context.dev scrapes active postings.

5. AI Compatibility Matching
   └── Vertex AI computes match score, matching competencies, and missing skill gaps.

6. Filter, Review & Apply
   └── Filter by match percentage, view detailed reasoning, and apply directly on the source listing.
```

---

## How To Run Locally

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **Google Cloud CLI** (for local Vertex AI authentication)
* **MongoDB Atlas** cluster URI
* **Supabase** project URL & Service Role Key
* **Context.dev** API Key

### 2. Configure Google Cloud Application Default Credentials (ADC)
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
gcloud services enable aiplatform.googleapis.com
```

### 3. Clone Repository & Setup Environment
```bash
git clone https://github.com/Prash-code9428/CareerLens.git
cd CareerLens

# Create local environment file
cp .env.example .env
```

### 4. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 5. Start Development Servers
```bash
# Option A: Run both services simultaneously in separate terminals
# Terminal 1 (Backend):
npm run server

# Terminal 2 (Frontend):
npm run client
```

* Frontend is accessible at: `http://localhost:5173`
* Backend API is accessible at: `http://localhost:8080` (or `http://localhost:5000`)
* Health Check endpoint: `http://localhost:8080/api/health`

### 6. Run Test Suite
```bash
cd server
npm test
```

---

## Environment Variables

Configure these variables in your root `.env` file (refer to [`.env.example`](.env.example)):

```env
# Server Configuration
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=

# Supabase Storage Configuration
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=resumes

# Context.dev Live Search API
CONTEXT_API_KEY=
CONTEXT_API_ENDPOINT=https://api.context.dev/v1/web/search

# Google Cloud / Vertex AI
GOOGLE_CLOUD_PROJECT_ID=
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-pro

# Frontend Configuration (Vite)
VITE_API_BASE_URL=http://localhost:8080
```

---

## Tools and AI Used

* **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, Axios
* **Backend**: Node.js, Express, Mongoose (MongoDB ODM), Multer, `pdf-parse`, `bcryptjs`, `jsonwebtoken`
* **Cloud & Storage**: Google Cloud Run, Google Cloud Artifact Registry, Supabase Storage, MongoDB Atlas
* **Web Search**: Context.dev Search API (`/v1/web/search`)
* **AI & Machine Learning**: Google Cloud Vertex AI (`@google-cloud/vertexai` with Gemini models)
* **Development & IDE**: Antigravity IDE (DeepMind Agentic AI pair programming)

---

## Who It Is For

* **Students preparing for campus placements**: Understand resume match readiness and identify missing technical skills.
* **Internship seekers**: Discover active 2026 internships matching current skills without manual job board fatigue.
* **Early-career engineers**: Bridge skill gaps with structured feedback on explicitly required technologies.

---

## Signs Students Would Use It

* **Survey Validation**: **100%** of surveyed students reported hesitation when applying if missing 1–2 skills, showing strong demand for objective skill-gap feedback.
* **Time Savings**: Eliminates the 15–30+ minutes spent manually comparing resumes against bloated job posts.
* **Transparency**: Clear separation between proven skills and skill gaps provides clarity over vague keyword checkers.

---

## Done / Left / Plan

### ✅ Completed (Done)
- [x] Full JWT authentication and user profile management
- [x] PDF resume upload to Supabase Storage with format & size validation
- [x] Server-side PDF text extraction and normalization
- [x] Vertex AI structured resume parsing into candidate competencies
- [x] Context.dev live web opportunity discovery with rate-limit pacing
- [x] Vertex AI opportunity compatibility scoring, matching skills, and gap identification
- [x] Client-side filtering by Job Type, Work Mode, Match Score, and Search
- [x] Opportunity details view with direct external application links
- [x] Reusable loading skeletons, inline error alerts, and retry states
- [x] Production Dockerfile and Google Cloud Run deployment configuration
- [x] 78/78 automated test suite passing cleanly

### 📋 Planned Enhancements (Plan)
- [ ] Direct skill-gap learning resource recommendations (courses, documentation).
- [ ] Application history tracker to log applied roles and status.
- [ ] Multi-resume version management (tailored resumes per target domain).

---

## Demo

* **Local Demo**: Run `npm run server` and `npm run client` to interact with CareerLens locally at `http://localhost:5173`.
* **Health Endpoint**: `GET /api/health` returns `{ "success": true, "message": "CareerLens API is running" }`.

---

## Repository Structure

```
CareerLens/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets & SPA redirects (_redirects)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Skeletons, Alerts, Uploaders)
│   │   ├── context/            # AuthContext state management
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Opportunities
│   │   └── services/           # Centralized Axios API client (api.js)
│   └── package.json
├── server/                     # Express Backend
│   ├── config/                 # DB, Supabase, Google Cloud, Env Validators
│   ├── controllers/            # Auth, Profile, Resume, Opportunity controllers
│   ├── middleware/             # Auth, Upload (Multer), Error Sanitization
│   ├── models/                 # Mongoose User model
│   ├── routes/                 # Express API routes
│   ├── services/               # Vertex AI, Context.dev, PDF Parser, Opportunity Matcher
│   ├── Dockerfile              # Production Node 20 Alpine container image
│   ├── testAuth.js             # Automated 78-test E2E & unit test runner
│   └── package.json
├── evidence/                   # User research & survey responses
│   ├── README.md               # Survey data breakdown & qualitative findings
│   └── Survey Responses.xlsx   # Survey response data
├── DEPLOYMENT.md               # Google Cloud Run deployment guide
├── .env.example                # Sample environment configuration
├── .dockerignore               # Container build exclusions
├── .gitignore                  # Git exclusions (credentials, node_modules)
└── README.md                   # Hackathon documentation
```
