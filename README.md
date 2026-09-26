# Prepwise — AI Voice Agent Interview Platform

An AI-powered mock interview platform where you *talk* to an AI interviewer in real time, get role-specific questions generated on the fly, and receive automated performance feedback after every session.

**🔗 Live Demo:** [ai-mock-interviews-alpha.vercel.app](https://ai-mock-interviews-alpha.vercel.app)

---

## What It Does

1. **Sign up / sign in** securely with Firebase Authentication.
2. **Generate a custom interview** by having a short voice conversation with an AI assistant — tell it your target role, experience level, tech stack, interview type, and number of questions.
3. **Take a real-time voice interview** — a Vapi-powered voice agent asks you the generated questions, listens to your spoken answers, and responds naturally, just like a real interviewer on a call.
4. **Get instant feedback** — once the interview ends, Google Gemini analyzes the full transcript and scores you across five categories, with strengths, areas to improve, and a final assessment.
5. **Track your history** — revisit past interviews and feedback anytime from your dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + shadcn/ui |
| Voice AI | [Vapi](https://vapi.ai/) — real-time speech-to-text, LLM turn-taking, and text-to-speech |
| AI Model | [Google Gemini](https://ai.google.dev/) — question generation & interview feedback scoring |
| Auth & Database | [Firebase Authentication](https://firebase.google.com/products/auth) + [Firestore](https://firebase.google.com/products/firestore) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Architecture Overview

```
Browser (Next.js UI)
   │
   ├──► Next.js API Routes ──► Firebase (Auth + Firestore)
   │                      └──► Google Gemini (question generation & feedback)
   │
   └──► Vapi (live voice call) ──► webhook ──► Next.js API Route ──► Gemini + Firestore
```

- **Live voice audio** flows directly between the browser and Vapi's servers — never through the app's backend — keeping latency low for a natural conversation.
- **Structured AI output** (via schema-constrained prompts) is used for both question generation and feedback scoring, ensuring reliable, parseable results instead of free-form text.
- **Session-based auth** uses Firebase Admin to issue a secure, httpOnly session cookie after login, protecting all authenticated routes server-side.

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- npm
- A Firebase project (Authentication + Firestore enabled)
- A Vapi account
- A Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/Nahidkhanam/ai-mock-interviews.git
cd ai-mock-interviews
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root:

```env
# Vapi
NEXT_PUBLIC_VAPI_WEB_TOKEN=

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (server-side/admin)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

> Get Firebase client config from **Project Settings → General → Your apps**, and admin credentials from **Project Settings → Service Accounts → Generate new private key**.

### 4. Run the dev server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

> **Note:** Testing the voice-agent generation flow locally requires a tunnel (e.g. [ngrok](https://ngrok.com/)) since Vapi's servers need a public URL to reach your local machine's webhook endpoint. Set `NEXT_PUBLIC_BASE_URL` to your tunnel URL while testing locally.

---

## 📁 Project Structure 

```
app/
 ├─ (auth)/sign-in, sign-up        → Auth pages
 ├─ (root)/                        → Dashboard, interview pages
 └─ api/vapi/generate/route.ts     → Webhook: generates interview questions via Gemini
components/
 └─ Agent.tsx                      → Core voice-call UI & Vapi event handling
constants/
 └─ index.ts                       → Vapi assistant configs (interviewer, generator)
lib/
 ├─ actions/auth.action.ts         → Sign-up, sign-in, session management
 ├─ actions/general.action.ts      → Interview & feedback CRUD (Firestore)
 └─ vapi.sdk.ts                    → Vapi client initialization
firebase/
 └─ admin.ts                       → Firebase Admin SDK setup
```

---

## Features

- Real-time, natural voice conversation with an AI interviewer
- Role-specific question generation tailored to job title, experience level, and tech stack
- Structured, category-based feedback (Communication, Technical Knowledge, Problem-Solving, Cultural Fit, Confidence & Clarity)
- Secure authentication with protected routes
- Fully responsive UI
- Interview history dashboard

---

## Future Improvements

- Resume-based question generation
- Video mode with posture/eye-contact feedback
- Multi-language interview support
- Live coding round for technical interviews
- Progress tracking across multiple sessions

---

