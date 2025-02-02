"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Circle, Book, LogOut, ChevronDown, ChevronUp } from "lucide-react"

import Chat1 from "@/components/Chat1"
import Chat2 from "@/components/Chat2"

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
      { title: "Quiz 1", mastered: false },
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
      { title: "Quiz 2", mastered: false },
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
      { title: "Quiz 3", mastered: false },
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
      { title: "Quiz 4", mastered: false },
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
      { title: "Quiz 5", mastered: false },
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
      { title: "Quiz 6", mastered: false },
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
      { title: "Quiz 7", mastered: false },
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
      { title: "Quiz 8", mastered: false },
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
      { title: "Quiz 9", mastered: false },
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
      { title: "Quiz 10", mastered: false },
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
      { title: "Quiz 11", mastered: false },
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
      { title: "Quiz 12", mastered: false },
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

const chatMap = [
    Chat1,  // index 0 => "Naming Numbers"
    Chat2,  // index 1 => "Rounding Numbers"
    // Chat3,  // index 2 => "Addition of Whole Numbers"
    // Chat4,  // index 3 => "Subtraction of Whole Numbers"
    // Chat5,  // index 4 => "Multiplication of Whole Numbers"
    // Chat6,  // index 5 => "Division of Whole Numbers"
    // Chat7,  // index 6 => "Word Problems"
    // Chat8,  // index 7 => "Quiz 1"
    // Chat9,  // index 8 => "Basic Concepts"
    // Chat10, // index 9 => "Addition of Integers"
    // Chat11, // index 10 => "Subtraction of Integers"
    // Chat12, // index 11 => "Multiplication of Integers"
    // Chat13, // index 12 => "Division of Integers"
    // Chat14, // index 13 => "Exponents"
    // Chat15, // index 14 => "Order of Operations"
    // Chat16, // index 15 => "Quiz 2"
    // Chat17, // index 16 => "Basic Concepts"
    // Chat18, // index 17 => "Reducing Fractions to Lowest Terms"
    // Chat19, // index 18 => "Changing Fractions to Higher Terms"
    // Chat20, // index 19 => "Changing Improper Fractions to Mixed Numbers"
    // Chat21, // index 20 => "Changing Mixed Numbers to Improper Fractions"
    // Chat22, // index 21 => "Quiz 3"
    // Chat23, // index 22 => "Multiplying Fractions"
    // Chat24, // index 23 => "Dividing Fractions"
    // Chat25, // index 24 => "Adding and Subtracting Fractions"
    // Chat26, // index 25 => "Complex Fractions"
    // Chat27, // index 26 => "Reciprocals and Rationalizing Denominators"
    // Chat28, // index 27 => "Quiz 4"
    // Chat29, // index 28 => "Introduction to Decimals"
    // Chat30, // index 29 => "Converting Fractions to Decimals"
    // Chat31, // index 30 => "Adding and Subtracting Decimals"
    // Chat32, // index 31 => "Multiplying Decimals"
    // Chat33, // index 32 => "Dividing Decimals"
    // Chat34, // index 33 => "Decimals and Fractions"
    // Chat35, // index 34 => "Rounding Decimals"
    // Chat36, // index 35 => "Quiz 5"
    // Chat37, // index 36 => "Understanding Percent"
    // Chat38, // index 37 => "Calculating Percentages"
    // Chat39, // index 38 => "Increasing and Decreasing Numbers by Percent"
    // Chat40, // index 39 => "Percent Problems"
    // Chat41, // index 40 => "Applications of Percent"
    // Chat42, // index 41 => "Quiz 6"
    // Chat43, // index 42 => "Simplifying Algebraic Expressions"
    // Chat44, // index 43 => "Solving Simple Equations"
    // Chat45, // index 44 => "Solving Multi-step Equations"
    // Chat46, // index 45 => "Using Equations to Solve Problems"
    // Chat47, // index 46 => "Checking Solutions"
    // Chat48, // index 47 => "Quiz 7"
    // Chat49, // index 48 => "Understanding Ratios"
    // Chat50, // index 49 => "Properties of Proportions"
    // Chat51, // index 50 => "Solving Proportions"
    // Chat52, // index 51 => "Applications of Proportions"
    // Chat53, // index 52 => "Similar Figures and Scale Drawings"
    // Chat54, // index 53 => "Quiz 8"
    // Chat55, // index 54 => "Points, Lines, and Planes"
    // Chat56, // index 55 => "Angles and Their Measures"
    // Chat57, // index 56 => "Constructing Angles and Lines"
    // Chat58, // index 57 => "Polygons and Circles"
    // Chat59, // index 58 => "Area and Perimeter"
    // Chat60, // index 59 => "Volume and Surface Area"
    // Chat61, // index 60 => "Quiz 9"
    // Chat62, // index 61 => "Units of Measurement"
    // Chat63, // index 62 => "Measuring Length"
    // Chat64, // index 63 => "Measuring Area and Volume"
    // Chat65, // index 64 => "Temperature and Time"
    // Chat66, // index 65 => "Converting Units"
    // Chat67, // index 66 => "Quiz 10"
    // Chat68, // index 67 => "Introduction to Graphing"
    // Chat69, // index 68 => "Plotting Points"
    // Chat70, // index 69 => "Graphing Linear Equations"
    // Chat71, // index 70 => "Slope and Intercept"
    // Chat72, // index 71 => "Graphing Inequalities"
    // Chat73, // index 72 => "Quiz 11"
    // Chat74, // index 73 => "Understanding Monomials"
    // Chat75, // index 74 => "Adding and Subtracting Polynomials"
    // Chat76, // index 75 => "Multiplying Polynomials"
    // Chat77, // index 76 => "Special Products"
    // Chat78, // index 77 => "Factoring Polynomials"
    // Chat79, // index 78 => "Quiz 12"
    // Chat80, // index 79 => "Final Exam"
    // Chat81  // index 80 => "Overcoming Math Anxiety"
  ];

    const sectionNames = [ "Naming Numbers", "Rounding Numbers", "Addition of Whole Numbers", "Subtraction of Whole Numbers", "Multiplication of Whole Numbers", "Division of Whole Numbers", "Word Problems", "Quiz 1", "Basic Concepts", "Addition of Integers", "Subtraction of Integers", "Multiplication of Integers", "Division of Integers", "Exponents", "Order of Operations", "Quiz 2", "Basic Concepts", "Reducing Fractions to Lowest Terms", "Changing Fractions to Higher Terms", "Changing Improper Fractions to Mixed Numbers", "Changing Mixed Numbers to Improper Fractions", "Quiz 3", "Multiplying Fractions", "Dividing Fractions", "Adding and Subtracting Fractions", "Complex Fractions", "Reciprocals and Rationalizing Denominators", "Quiz 4", "Introduction to Decimals", "Converting Fractions to Decimals", "Adding and Subtracting Decimals", "Multiplying Decimals", "Dividing Decimals", "Decimals and Fractions", "Rounding Decimals", "Quiz 5", "Understanding Percent", "Calculating Percentages", "Increasing and Decreasing Numbers by Percent", "Percent Problems", "Applications of Percent", "Quiz 6", "Simplifying Algebraic Expressions", "Solving Simple Equations", "Solving Multi-step Equations", "Using Equations to Solve Problems", "Checking Solutions", "Quiz 7", "Understanding Ratios", "Properties of Proportions", "Solving Proportions", "Applications of Proportions", "Similar Figures and Scale Drawings", "Quiz 8", "Points, Lines, and Planes", "Angles and Their Measures", "Constructing Angles and Lines", "Polygons and Circles", "Area and Perimeter", "Volume and Surface Area", "Quiz 9", "Units of Measurement", "Measuring Length", "Measuring Area and Volume", "Temperature and Time", "Converting Units", "Quiz 10", "Introduction to Graphing", "Plotting Points", "Graphing Linear Equations", "Slope and Intercept", "Graphing Inequalities", "Quiz 11", "Understanding Monomials", "Adding and Subtracting Polynomials", "Multiplying Polynomials", "Special Products", "Factoring Polynomials", "Quiz 12", "Final Exam", "Overcoming Math Anxiety"]

  
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
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            Interactive AI Tutor for {selectedSection}
            </h2>
            {(() => {
            const idx = sectionNames.indexOf(selectedSection)
            if (idx === -1) {
                // This means selectedSection isn't in sectionNames at all
                return <div>No chat component mapped for this section yet.</div>
            }

            // Attempt to get the correct Chat component from chatMap
            const ChatComponent = chatMap[idx]
            if (!ChatComponent) {
                // If idx is beyond the length of chatMap, or that slot is undefined
                return (
                <p className="text-indigo-600">
                    The interactive AI tutor for this section will be integrated here.
                </p>
                )
            }

            // Otherwise, render the found component
            return <ChatComponent />
            })()}
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

