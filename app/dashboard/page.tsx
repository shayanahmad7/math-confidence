"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Circle, Book, LogOut, ChevronDown, ChevronUp } from "lucide-react"

const chapters = [
  {
    title: "Chapter 1: Whole Numbers",
    sections: [
      { title: "Naming Numbers", mastered: false },
      { title: "Rounding Numbers", mastered: false },
      { title: "Addition of Whole Numbers", mastered: false },
      { title: "Subtraction of Whole Numbers", mastered: false },
      { title: "Multiplication of Whole Numbers", mastered: false },
      { title: "Division of Whole Numbers", mastered: false },
      { title: "Word Problems", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 2: Integers",
    sections: [
      { title: "Basic Concepts", mastered: false },
      { title: "Addition of Integers", mastered: false },
      { title: "Subtraction of Integers", mastered: false },
      { title: "Multiplication of Integers", mastered: false },
      { title: "Division of Integers", mastered: false },
      { title: "Exponents", mastered: false },
      { title: "Order of Operations", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 3: Fractions: Part 1",
    sections: [
      { title: "Basic Concepts", mastered: false },
      { title: "Reducing Fractions to Lowest Terms", mastered: false },
      { title: "Changing Fractions to Higher Terms", mastered: false },
      { title: "Changing Improper Fractions to Mixed Numbers", mastered: false },
      { title: "Changing Mixed Numbers to Improper Fractions", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 4: Fractions: Part 2",
    sections: [
      { title: "Multiplying Fractions", mastered: false },
      { title: "Dividing Fractions", mastered: false },
      { title: "Adding and Subtracting Fractions", mastered: false },
      { title: "Complex Fractions", mastered: false },
      { title: "Reciprocals and Rationalizing Denominators", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 5: Decimals",
    sections: [
      { title: "Introduction to Decimals", mastered: false },
      { title: "Converting Fractions to Decimals", mastered: false },
      { title: "Adding and Subtracting Decimals", mastered: false },
      { title: "Multiplying Decimals", mastered: false },
      { title: "Dividing Decimals", mastered: false },
      { title: "Decimals and Fractions", mastered: false },
      { title: "Rounding Decimals", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 6: Percent",
    sections: [
      { title: "Understanding Percent", mastered: false },
      { title: "Calculating Percentages", mastered: false },
      { title: "Increasing and Decreasing Numbers by Percent", mastered: false },
      { title: "Percent Problems", mastered: false },
      { title: "Applications of Percent", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 7: Expressions and Equations",
    sections: [
      { title: "Simplifying Algebraic Expressions", mastered: false },
      { title: "Solving Simple Equations", mastered: false },
      { title: "Solving Multi-step Equations", mastered: false },
      { title: "Using Equations to Solve Problems", mastered: false },
      { title: "Checking Solutions", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 8: Ratio and Proportion",
    sections: [
      { title: "Understanding Ratios", mastered: false },
      { title: "Properties of Proportions", mastered: false },
      { title: "Solving Proportions", mastered: false },
      { title: "Applications of Proportions", mastered: false },
      { title: "Similar Figures and Scale Drawings", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 9: Informal Geometry",
    sections: [
      { title: "Points, Lines, and Planes", mastered: false },
      { title: "Angles and Their Measures", mastered: false },
      { title: "Constructing Angles and Lines", mastered: false },
      { title: "Polygons and Circles", mastered: false },
      { title: "Area and Perimeter", mastered: false },
      { title: "Volume and Surface Area", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 10: Measurement",
    sections: [
      { title: "Units of Measurement", mastered: false },
      { title: "Measuring Length", mastered: false },
      { title: "Measuring Area and Volume", mastered: false },
      { title: "Temperature and Time", mastered: false },
      { title: "Converting Units", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 11: Graphing",
    sections: [
      { title: "Introduction to Graphing", mastered: false },
      { title: "Plotting Points", mastered: false },
      { title: "Graphing Linear Equations", mastered: false },
      { title: "Slope and Intercept", mastered: false },
      { title: "Graphing Inequalities", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Chapter 12: Operations with Monomials and Polynomials",
    sections: [
      { title: "Understanding Monomials", mastered: false },
      { title: "Adding and Subtracting Polynomials", mastered: false },
      { title: "Multiplying Polynomials", mastered: false },
      { title: "Special Products", mastered: false },
      { title: "Factoring Polynomials", mastered: false },
      { title: "Quiz", mastered: false },
    ],
  },
  {
    title: "Final Exam",
    sections: [{ title: "Final Exam", mastered: false }],
  },
  {
    title: "Supplement: Overcoming Math Anxiety",
    sections: [{ title: "Overcoming Math Anxiety", mastered: false }],
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({})
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

  const toggleChapter = (chapterTitle: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterTitle]: !prev[chapterTitle],
    }))
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
      <aside className="w-64 bg-white shadow-lg overflow-y-auto h-screen">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
            <Book className="mr-2" />
            Table of Contents
          </h2>
          <nav className="space-y-2">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="mb-2">
                <button
                  onClick={() => toggleChapter(chapter.title)}
                  className="flex items-center justify-between w-full text-left font-medium text-indigo-700 hover:bg-indigo-50 rounded p-2 transition-colors duration-200"
                >
                  <span>{chapter.title}</span>
                  {expandedChapters[chapter.title] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedChapters[chapter.title] && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {chapter.sections.map((section, sectionIndex) => (
                      <li key={sectionIndex}>
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
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1
            className="text-3xl font-bold text-indigo-800 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            onClick={() => setSelectedSection(null)}
          >
            Dashboard
          </h1>
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

