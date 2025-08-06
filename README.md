# Interactive Pre-Algebra AI Textbook 📚🤖

Prototype platform that transforms a traditional textbook into an **interactive, AI-driven learning experience**. Learners chat with “mini tutors” dedicated to each section of the book, receiving step-by-step instruction, questions, and mastery feedback.

> 🏆 Originally built as a **finalist project** in the NYU Abu Dhabi **Slush'D 2025 – AI for Good Hackathon** (powered by Nokia) and now extended with additional accessibility and persistence features.

---

## Key Features

| Capability            | Details                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Per-Section Tutors    | Each chapter/section is backed by its own OpenAI Assistant, guaranteeing focused answers and avoiding topic drift.                 |
| Auto-prompting        | The app automatically sends a hidden trigger (section number) or greeting to start the conversation so learners can dive right in. |
| Real-time Streaming   | Messages stream token-by-token for an authentic chat feel using `ai/react` hooks.                                                  |
| Persistent History    | Conversations are saved to MongoDB per user & assistant; return any time and pick up where you left off.                           |
| Speech ▲▼ Text        | Whisper STT for voice input and OpenAI TTS for high-quality read-aloud responses.                                                  |
| Image Recognition     | Learners can upload images (e.g. a handwritten problem); the assistant receives the image URL.                                     |
| Mastery Tracking      | Front-end logic tracks when a learner answers three questions correctly in a row and marks the section as mastered.                |
| Growth-Mindset Design | Encouraging language, confetti on mastery, and emphasis on learning through mistakes.                                              |

---

## Architecture Overview

```
Next.js 15  ─┐                MongoDB (Atlas)
React 19     │  API routes          │
Tailwind     │  OpenAI Assistants   │
Supabase ----┴→ Storage (images)    └─ Threads & message history
```

- **Frontend** – Next 13/React 19, single reusable `Chat` component, Tailwind CSS UI.
- **Backend** – Next.js Route Handlers.
  - `/api/assistant/[id]` – dynamic endpoint that proxies to the correct Assistant id, handles thread creation, streams responses, and saves both user & assistant messages.
  - `/api/speech-to-text` – Whisper STT.
  - `/api/openai-tts` – OpenAI TTS.
  - `/api/upload` – uploads images to Supabase Storage and returns a public URL.

---

## Getting Started

1. **Clone & Install**

   ```bash
   git clone https://github.com/shayanahmad7/math-confidence.git
   cd math-confidence
   npm install
   ```

2. **Environment Variables** (`.env.local` recommended)

   ```env
   # Supabase (public bucket for image uploads)
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

   # OpenAI
   OPENAI_API_KEY=sk-...

   # MongoDB (Atlas URI)
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority

   # Assistant ids – one per chapter (1-14)
   CHAPTER_1_ASSISTANT_ID=asst_...
   CHAPTER_2_ASSISTANT_ID=asst_...
   ...
   CHAPTER_14_ASSISTANT_ID=asst_...
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   # open http://localhost:3000
   ```

---

## Usage Tips

- Select a chapter + section from the left sidebar; a mini tutor launches instantly.
- Use voice input by toggling the microphone (Chrome / Edge have native recognition; other browsers fall back to Whisper).
- Click the paper-clip icon to upload an image.
- When you reach mastery the section gets a ✅ and confetti appears!

---

## Roadmap

- Autorouter for any uploaded textbook (PDF to section mapping).
- Analytics dashboard for educators.
- Offline / low-bandwidth TTS cache.

---

## License

MIT © 2025 – Shayan Ahmad & team

## Authors

- Shayan Ahmad
- Ramsha Bilal
- Izah Sohail
- Aysa Moma
- Samroz Ahmad Shoaib

---

## Acknowledgements

- OpenAI – Assistants, Whisper, TTS.
- MongoDB – flexible document storage.
- Supabase – simple image hosting.
- NYUAD Slush'D 2025 & Nokia for the hackathon platform.
