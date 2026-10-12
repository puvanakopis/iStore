# Vercel Deployment Guide for iStore (Fullstack)

This project consists of a **Next.js 16 (React 19)** frontend and a **FastAPI (Python 3.13)** backend with MongoDB and AI chatbot integration.

You can deploy to Vercel using either of the two standard methods below.

---

## Option 1: Two Vercel Projects (Recommended)

Deploying frontend and backend as separate Vercel projects gives you independent deployment pipelines, dedicated build logs, and clean isolation.

### Part 1: Deploy Backend (FastAPI)
1. Go to your [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** > **Project** and select your `iStore` repository.
3. In **Configure Project**:
   - **Project Name**: `istore-backend` (or your choice)
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and choose `backend`.
4. In **Environment Variables**, add the backend environment variables:
   - `MONGODB_URL`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`)
   - `DATABASE_NAME`: `istore_db`
   - `SECRET_KEY`: A secure random string (minimum 32 characters)
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
   - `GROQ_API_KEY`: Your Groq API key
   - `MODEL_PROVIDER`: `groq`
   - `MODEL_NAME`: `openai/gpt-oss-120b` (or `llama-3.1-8b-instant`)
   - `USE_MOCK_EMAIL`: `False` (or `True` if testing without SMTP)
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: Your Gmail address
   - `SMTP_PASSWORD`: Your Gmail App Password
   - `EMAILS_FROM_EMAIL`: Your email address
   - `EMAILS_FROM_NAME`: `iStore`
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `FRONTEND_URL`: URL of your frontend once deployed (e.g. `https://istore-frontend.vercel.app`)
5. Click **Deploy**.
6. Once deployed, copy your backend URL: e.g. `https://istore-backend.vercel.app`. Test it by visiting `https://istore-backend.vercel.app/api/health`.

---

### Part 2: Deploy Frontend (Next.js)
1. Go to your [Vercel Dashboard](https://vercel.com/new) and import the same `iStore` repository again.
2. In **Configure Project**:
   - **Project Name**: `istore-frontend` (or your choice)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and choose `frontend`.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL from Part 1 (e.g. `https://istore-backend.vercel.app`)
4. Click **Deploy**.
5. Update `FRONTEND_URL` on your backend project with the generated frontend domain to allow cross-origin requests.

---

## Option 2: Single Monorepo Deployment

Deploy both Frontend and Backend together under a single Vercel project using the root [`vercel.json`](./vercel.json):

1. Go to [Vercel Dashboard](https://vercel.com/new) and import the `iStore` repository.
2. Keep the **Root Directory** as `./` (the root).
3. Add all the backend environment variables (`MONGODB_URL`, `SECRET_KEY`, `GROQ_API_KEY`, Cloudinary variables, etc.) and set:
   - `NEXT_PUBLIC_API_URL`: Leave empty or set to your deployment URL (requests to `/api/*` and `/uploads/*` are automatically routed by Vercel to the FastAPI serverless functions).
4. Click **Deploy**.

---

## Environment Variable Checklist

| Variable | Required In | Description |
| :--- | :--- | :--- |
| `MONGODB_URL` | Backend | Cloud MongoDB Atlas URI with TLS enabled |
| `DATABASE_NAME` | Backend | Database name (e.g. `istore_db`) |
| `SECRET_KEY` | Backend | Secret key used for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary Cloud Name for persistent image uploads |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API Secret |
| `GROQ_API_KEY` | Backend | API Key from console.groq.com |
| `SMTP_USER` & `SMTP_PASSWORD` | Backend | Credentials for email dispatch |
| `NEXT_PUBLIC_API_URL` | Frontend | Base URL of the backend API |
| `FRONTEND_URL` / `CORS_ORIGINS` | Backend | Allowed frontend origin(s) |
