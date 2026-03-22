# MedNote — AI Medicine Companion

An AI-powered medicine companion for elderly users. Built with React + Vite + Tailwind CSS + Express + Google Gemini API.

## Features

- 📷 **Medicine Scanner** — Upload a photo of any medicine strip/bottle and get AI-powered identification
- 🤖 **AI Assistant** — Ask questions about your medicines in English or Bengali (streaming responses)
- 📋 **Prescription OCR** — Upload a prescription image to auto-extract medicines
- ⏰ **Smart Reminders** — Browser push notifications for medicine times
- 💊 **Medicine Workspace** — Notion-style cards with notes, tags, and organizing
- 👨‍👩‍👧 **Family Sharing** — Share a read-only link with family members
- 📦 **Export** — Download your medicines as JSON
- ♿ **Elderly-Friendly** — Large fonts, high contrast mode, keyboard accessible

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:

```
GEMINI_API_KEY=your_actual_key_here
PORT=3001
```

Get a free API key at: https://aistudio.google.com/apikey

### 3. Start the backend

```bash
npm run server
```

### 4. Start the frontend (in another terminal)

```bash
npm run dev
```

### 5. Open in browser

Visit `http://localhost:5173`

## Project Structure

```
mednote/
├── server.js            # Express backend (Gemini API proxy)
├── public/
│   └── sw.js            # Service worker for notifications
├── src/
│   ├── main.jsx         # Entry point
│   ├── App.jsx          # Root component
│   ├── index.css        # Design system
│   ├── components/      # Shared UI components
│   │   ├── Icon.jsx
│   │   ├── Tag.jsx
│   │   ├── Sidebar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── Toast.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Skeleton.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── Onboarding.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Scanner.jsx
│   │   ├── Assistant.jsx
│   │   ├── MedicinesList.jsx
│   │   ├── Reminders.jsx
│   │   ├── PrescriptionUpload.jsx
│   │   ├── FamilyAccess.jsx
│   │   └── SharedView.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── useNotifications.js
│   └── utils/           # Utilities
│       ├── api.js
│       └── constants.js
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/chat` | POST | Streaming AI chat (Gemini) |
| `/api/scan` | POST | Medicine image analysis |
| `/api/prescription` | POST | Prescription OCR |

## Deploy to Vercel

### Frontend (Vite)

1. Push to GitHub
2. Import in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Backend (Express)

Deploy `server.js` as a separate Vercel serverless function or use any Node.js hosting (Render, Railway, etc.).

Set the `GEMINI_API_KEY` environment variable in your deployment platform.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Express.js
- **AI:** Google Gemini API (gemini-2.0-flash)
- **OCR Fallback:** Tesseract.js
- **Storage:** localStorage
- **Notifications:** Web Notifications API + Service Worker
