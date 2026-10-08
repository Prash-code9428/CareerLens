# CareerLens Google Cloud Run Deployment Guide

This guide details the complete production deployment process for the CareerLens backend on **Google Cloud Run** using **Google Cloud Vertex AI** for AI capabilities.

---

## 1. Architecture Overview

- **Hosting**: Google Cloud Run (Fully managed serverless container runtime)
- **Container Registry**: Google Cloud Artifact Registry
- **AI Intelligence**: Google Cloud Vertex AI (`gemini-1.5-pro` via Application Default Credentials / Runtime Identity)
- **Database**: MongoDB Atlas
- **Storage**: Supabase Storage (`resumes` bucket)
- **Search**: Context.dev API
- **Auth**: JWT with `bcryptjs` password hashing

---

## 2. Google Cloud Prerequisites & Project Configuration

### 2.1 Install & Initialize Google Cloud CLI
```bash
# Authenticate your Google Cloud CLI session
gcloud auth login

# Set your active Google Cloud project
gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
```

### 2.2 Enable Required Google Cloud APIs
Enable the necessary APIs for Cloud Run, container image storage, and Vertex AI:
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com
```

---

## 3. Dedicated Cloud Run Runtime Service Account

To follow the **Principle of Least Privilege**, create a dedicated runtime service account for the Cloud Run backend service rather than using the default Compute Engine service account.

### 3.1 Create Service Account
```bash
gcloud iam service-accounts create careerlens-backend-sa \
  --description="Dedicated runtime service account for CareerLens Cloud Run backend" \
  --display-name="CareerLens Backend Runtime SA"
```

### 3.2 Grant Minimum Required Permissions for Vertex AI
Grant the `roles/aiplatform.user` role to allow the backend to invoke Vertex AI models without downloading any credential files:
```bash
gcloud projects add-iam-policy-binding YOUR_GOOGLE_CLOUD_PROJECT_ID \
  --member="serviceAccount:careerlens-backend-sa@YOUR_GOOGLE_CLOUD_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

> **Security Rule**: Never download or bundle service-account JSON keys in the container image or repository. Cloud Run automatically mounts short-lived metadata identity tokens for the attached service account at runtime.

---

## 4. Container Build & Artifact Registry

### 4.1 Create an Artifact Registry Docker Repository
```bash
gcloud artifacts repositories create careerlens-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="CareerLens Docker container repository"
```

### 4.2 Build and Push the Container Image via Google Cloud Build
From the `server` directory (or workspace root with `server/Dockerfile`):
```bash
# From workspace root:
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/YOUR_GOOGLE_CLOUD_PROJECT_ID/careerlens-repo/careerlens-server:latest \
  server/
```

---

## 5. Cloud Run Deployment & Runtime Environment Variables

Deploy the container to Cloud Run with the attached runtime service account and all required environment variables.

### 5.1 Deployment Command
```bash
gcloud run deploy careerlens-backend \
  --image=us-central1-docker.pkg.dev/YOUR_GOOGLE_CLOUD_PROJECT_ID/careerlens-repo/careerlens-server:latest \
  --platform=managed \
  --region=us-central1 \
  --service-account=careerlens-backend-sa@YOUR_GOOGLE_CLOUD_PROJECT_ID.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --port=8080 \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="CLIENT_URL=https://your-production-frontend.app" \
  --set-env-vars="GOOGLE_CLOUD_PROJECT_ID=YOUR_GOOGLE_CLOUD_PROJECT_ID" \
  --set-env-vars="VERTEX_AI_LOCATION=us-central1" \
  --set-env-vars="VERTEX_AI_MODEL=gemini-1.5-pro" \
  --set-env-vars="SUPABASE_BUCKET=resumes" \
  --set-env-vars="SUPABASE_URL=https://your-supabase-project.supabase.co" \
  --set-env-vars="MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/careerlens?retryWrites=true&w=majority" \
  --set-env-vars="JWT_SECRET=your_production_jwt_secret_key" \
  --set-env-vars="SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key" \
  --set-env-vars="CONTEXT_API_KEY=your_context_dev_api_key"
```

> **Recommended Secret Management**: For production hardening, store sensitive secrets (`MONGODB_URI`, `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `CONTEXT_API_KEY`) in **Google Cloud Secret Manager** and reference them using `--set-secrets`.

---

## 6. Required Environment Variables Reference

| Variable | Recommended Source | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations and strict CORS enforcement |
| `PORT` | Set dynamically by Cloud Run | Cloud Run injects `PORT=8080` automatically |
| `CLIENT_URL` | Cloud Run Env Var | Production frontend URL (or comma-separated URLs) for CORS |
| `MONGODB_URI` | Cloud Run Secret | Production MongoDB Atlas connection string |
| `JWT_SECRET` | Cloud Run Secret | Cryptographically secure string for signing JWT tokens |
| `SUPABASE_URL` | Cloud Run Env Var | Supabase project endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Cloud Run Secret | Backend-only service role key for resume storage |
| `SUPABASE_BUCKET` | Cloud Run Env Var | Supabase storage bucket (`resumes`) |
| `CONTEXT_API_KEY` | Cloud Run Secret | Context.dev live web search API key |
| `GOOGLE_CLOUD_PROJECT_ID` | Cloud Run Env Var | Google Cloud project ID for Vertex AI |
| `VERTEX_AI_LOCATION` | Cloud Run Env Var | Regional endpoint (e.g. `us-central1`) |
| `VERTEX_AI_MODEL` | Cloud Run Env Var | Foundation model name (default: `gemini-1.5-pro`) |

---

## 7. Post-Deployment Verification

### 7.1 Health Check
Verify that the service is running and healthy:
```bash
curl -i https://<cloud-run-service-url>/api/health
```

**Expected Response**:
```json
HTTP/2 200
content-type: application/json; charset=utf-8

{
  "success": true,
  "message": "CareerLens API is running"
}
```

### 7.2 Frontend Connection
Update the frontend configuration (`VITE_API_BASE_URL`) to point to the Cloud Run service URL:
```env
VITE_API_BASE_URL=https://<cloud-run-service-url>
```

---

## 8. Security & Operational Checklist

- [x] Dedicated runtime Service Account with `roles/aiplatform.user` attached.
- [x] Zero service account keys or JSON credential files stored or bundled.
- [x] Non-root container execution (`USER node`).
- [x] Dynamic `PORT` and host `0.0.0.0` binding.
- [x] Strict CORS restriction to configured `CLIENT_URL`.
- [x] Ephemeral container storage (resumes stored in Supabase, data in MongoDB Atlas).
