"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Circle, BookOpen, LogOut } from "lucide-react"

// Placeholder data for chapters and sections
const chapters = [
  {
    title: "Chapter 1: Whole Numbers",
    sections: [
      { title: "1.1 Naming Whole Numbers", mastered: false },
      { title: "1.2 Rounding Whole Numbers", mastered: false },
    ],
  },
  {
    title: "Chapter 2: Integers",
    sections: [
      { title: "2.1 Positive & Negative Integers", mastered: true },
      { title: "2.2 Adding Integers", mastered: false },
    ],
  },
  {
    title: "Chapter 3: Fractions",
    sections: [
      { title: "3.1 Introduction to Fractions", mastered: false },
      { title: "3.2 Adding Fractions", mastered: false },
    ],
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/")
      }
    }
    fetchUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
            <BookOpen className="mr-2" />
            Table of Contents
          </h2>
          <nav>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="mb-4">
                <h3 className="font-medium text-indigo-700 mb-2">{chapter.title}</h3>
                <ul>
                  {chapter.sections.map((section, sectionIndex) => (
                    <li key={sectionIndex} className="mb-1">
                      <button
                        onClick={() => setSelectedSection(section.title)}
                        className={`flex items-center w-full text-left px-2 py-1 rounded transition-colors duration-200 ${
                          selectedSection === section.title
                            ? "bg-indigo-100 text-indigo-800"
                            : "hover:bg-indigo-50 text-gray-700 hover:text-indigo-700"
                        }`}
                      >
                        <span className="mr-2">
                          {section.mastered ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                        <span className="text-sm">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-800">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center"
          >
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
        {selectedSection ? (
          // Placeholder for Bot Tutor
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Bot Tutor for {selectedSection}</h2>
            <p className="text-indigo-600">The interactive AI tutor for this section will be integrated here.</p>
          </div>
        ) : (
          // Welcome Screen
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
            <h1 className="text-3xl font-bold text-indigo-800 mb-4">
              Welcome to Your Interactive Pre-Algebra AI Textbook
            </h1>
            <p className="text-indigo-600 mb-4">
              This interactive textbook is based on "Pre-Algebra DeMYSTiFieD" by Allan Bluman (McGraw-Hill). We credit
              the author for the original material, which we've used to train an AI that provides a dynamic learning
              experience.
            </p>
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">How It Works</h2>
            <p className="text-indigo-600 mb-4">
              Each topic is split into smaller sections. You'll have a specialized 'mini tutor' for each section. Simply
              click a subsection on the left to start a tutoring session.
            </p>
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">How to Use</h2>
            <ul className="list-disc list-inside text-indigo-600 mb-4">
              <li>Select a section from the left to launch its mini tutor.</li>
              <li>The tutor will teach or review the concept, ask you questions, give examples, and quiz you.</li>
              <li>
                If you get 3 questions correct in a row, the system marks that topic as 'mastered.' You can then move on
                to the next one (or revisit anytime).
              </li>
              <li>You can always come back to a previous section to review or practice more.</li>
            </ul>
            <p className="text-indigo-800 font-medium bg-indigo-100 p-4 rounded-lg">
              Remember, everyone can learn math with the right approach. Let's build your confidence together!
            </p>
          </div>
        )}
        {/* Disclaimer */}
        <div className="mt-8 text-sm text-indigo-500 bg-white p-4 rounded-lg shadow">
          <p>
            Disclaimer: This platform is a prototype that uses content from 'Pre-Algebra DeMYSTiFieD' (McGraw-Hill) to
            train AI tutors. We credit the author, Allan Bluman, for the original material. This project is for
            demonstration purposes only.
          </p>
        </div>
      </main>
    </div>
  )
}

