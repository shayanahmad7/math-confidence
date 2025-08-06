# Interactive Pre-Algebra AI Textbook 📚✨

Transform any textbook into an **interactive, AI-powered learning experience**. Chat with specialized "mini-tutors" for each section, getting personalized instruction and instant Q&A support.

> 🏆 **Finalist project** at NYU Abu Dhabi **Slush'D 2025 – AI for Good Hackathon** (powered by Nokia)  
> 🌐 **Live Demo:** [math-confidence.com](https://math-confidence.com)

---

## 🎯 Problem & Solution

**The Problem:** Traditional textbooks are passive. Students read alone, get stuck, and often lose confidence—especially in math. Many believe they "just don't have the math gene."

**Our Solution:** We've transformed "Pre-Algebra DeMYSTiFieD" by Allan Bluman into an interactive experience where learners chat with AI tutors dedicated to each chapter section. No more silent struggling—get instant help, explanations, and encouragement.

---

## ✨ Key Features

| 🎯 Feature | 📋 Description |
|------------|----------------|
| **🤖 Per-Section Tutors** | Each chapter/section has its own OpenAI Assistant, ensuring focused, relevant responses |
| **⚡ Auto-Start Conversations** | Tutors automatically greet learners or send section-specific prompts to begin |
| **💬 Real-time Streaming** | Messages appear token-by-token for natural chat experience |
| **💾 Persistent History** | All conversations saved to MongoDB—pick up exactly where you left off |
| **🎙️ Voice Integration** | Speak your questions (Whisper STT) and hear responses read aloud (OpenAI TTS) |
| **💪 Growth Mindset** | Encouraging language throughout—mistakes are learning opportunities! |

---

## 🚀 Quick Start (For Learners)

1. **Visit the live demo:** [math-confidence.com](https://math-confidence.com)
2. **Sign up** with your email
3. **Choose a chapter** from the sidebar (e.g., "Chapter 1: Whole Numbers")
4. **Select a section** (e.g., "Naming Numbers")
5. **Start chatting!** The AI tutor will automatically greet you and begin the lesson

### 💡 Pro Tips
- 🎤 Click the microphone to ask questions with your voice
- 🔊 Click the speaker icon on AI responses to hear them read aloud
- 📚 Your progress is automatically saved—come back anytime!

---

## 🛠️ Setup for Developers

Want to adapt this for your own textbook? Here's how:

### Prerequisites
- Node.js 18+
- OpenAI API account
- MongoDB Atlas account
- Supabase account (for auth & file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shayanahmad7/math-confidence.git
   cd math-confidence
   npm install
   ```

2. **Environment Setup**
   
   Create `.env.local` with:
   ```env
   # 🔐 Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   
   # 🤖 OpenAI Configuration
   OPENAI_API_KEY=sk-your_openai_api_key
   
   # 📊 MongoDB Configuration
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
   
   # 🎯 Assistant IDs (one per chapter)
   CHAPTER_1_ASSISTANT_ID=asst_your_chapter_1_assistant_id
   CHAPTER_2_ASSISTANT_ID=asst_your_chapter_2_assistant_id
   # ... up to CHAPTER_14_ASSISTANT_ID
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` 🎉

---

## 📖 Customizing for Your Textbook

### Step 1: Prepare Your Content
1. **Add your textbook PDF** to `/public/` folder
2. **Update the PDF embed** in `app/dashboard/page.tsx` (line ~474)

### Step 2: Create OpenAI Assistants
1. Go to [OpenAI Assistants Playground](https://platform.openai.com/assistants)
2. **Create one assistant per chapter** with instructions like:
   ```
   You are a tutor for Chapter 1: Introduction to Algebra.
   Help students understand basic algebraic concepts.
   Be encouraging and explain step-by-step.
   ```
3. **Note each Assistant ID** (starts with `asst_`)

### Step 3: Update Code Structure
1. **Modify chapters array** in `app/dashboard/page.tsx` with your book's structure
2. **Update environment variables** with your assistant IDs
3. **Customize welcome text** and book title throughout the app

That's it! The dynamic routing handles everything else automatically. 🚀

---

## 🏗️ Architecture

```mermaid
graph TB
    A[Next.js Frontend] --> B[Dynamic API Routes]
    B --> C[OpenAI Assistants]
    B --> D[MongoDB Storage]
    A --> E[Supabase Auth]
    F[User] --> A
    G[Speech APIs] --> A
```

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS
- **Backend:** Next.js API Routes + OpenAI Assistants API
- **Database:** MongoDB Atlas (conversation history)
- **Auth & Storage:** Supabase
- **AI:** OpenAI GPT-4, Whisper (STT), TTS

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 🗺️ Roadmap

- 📚 **Multi-book support** with automatic PDF parsing
- 📊 **Analytics dashboard** for educators
- 🎯 **Progress tracking** and achievement system
- 🌍 **Multi-language support**
- 📱 **Mobile app** for iOS and Android

---

## 👥 Team

- **Shayan Ahmad** - Lead Developer
- **Ramsha Bilal** - AI/ML Engineer  
- **Izah Sohail** - Frontend Developer
- **Aysa Moma** - UX Designer
- **Samroz Ahmad Shoaib** - Backend Developer

---

## 🙏 Acknowledgements

- **OpenAI** - Assistants API, Whisper, and TTS capabilities
- **MongoDB** - Flexible document storage solution
- **Supabase** - Authentication and file storage
- **NYUAD Slush'D 2025 & Nokia** - Hackathon platform and support
- **Allan Bluman** - Original "Pre-Algebra DeMYSTiFieD" textbook author

---

## 📄 License

MIT © 2025 - See [LICENSE](LICENSE) file for details

---

<div align="center">

**Made with ❤️ by the Math Confidence Team**

[🌐 Live Demo](https://math-confidence.com) • [📧 Contact](mailto:sa6097@nyu.edu) 

</div>
