/* eslint-disable */

"use client"

import Link from "next/link"
import SignUp from "./SignUp"
import Login from "./Login"
import { useState } from "react"

export default function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">MathConfidence</div>
          <div className="space-x-4">
            <Link href="#" className="text-gray-600 hover:text-indigo-600">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600">
              Features
            </Link>
            <button onClick={() => setShowLogin(true)} className="text-gray-600 hover:text-indigo-600">
              Login
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Overcome Math Anxiety and Master Pre-Algebra with Our Interactive AI Textbook
            </h1>
            <p className="text-xl mb-8">
              Personalized mini-tutors guide you step by step—no more confusion, no more fear.
            </p>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* Problem Statement + Statistics */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Math Anxiety is Real—But It Doesn't Have to Hold You Back
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
              <p>
                Math anxiety affects millions of people worldwide, limiting their potential and closing doors to
                exciting opportunities. Studies show up to 93% of Americans experience some level of math anxiety, with
                over 50% of adults saying they avoid math whenever possible.
              </p>
              <p>
                Many believe they lack the 'math gene,' but research proves anyone can learn math with the right
                approach. When people give up on math too early, society loses potential innovators, problem-solvers,
                and critical thinkers.
              </p>
              <p>It's time to break this cycle and unlock the mathematical potential in everyone.</p>
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Meet the Interactive AI Textbook</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
              <p>
                We've revolutionized learning by converting 'Pre-Algebra Demystified' into an AI-driven, module-based
                system. Our unique approach features mini AI tutors for each topic, ensuring you master every concept
                before moving forward.
              </p>
              <p>
                This structured method builds genuine confidence and eliminates the typical 'read and forget' problem.
                In collaboration with major publishers and powered by Nokia's advanced 5G/Edge solutions, we're bringing
                personalized math education to learners everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="bg-indigo-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Mastery-Based Progression",
                  description: "No skipping ahead—truly learn each concept.",
                },
                {
                  title: "Multiple Mini AI Tutors",
                  description:
                    "Each AI tutor is specialized in one topic and communicates with the others to track your progress.",
                },
                {
                  title: "Growth Mindset Training",
                  description:
                    "Frequent motivational prompts, proven strategies to reduce math anxiety, and confidence-building exercises.",
                },
                {
                  title: "Problem-Solving Puzzles",
                  description: "Fun challenges to show how math is about thinking, not just memorizing.",
                },
                {
                  title: "Real-Time Feedback",
                  description: "Get instant explanations, correct mistakes quickly, and reinforce your understanding.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Changing Lives, One Math Lesson at a Time</h2>
            <div className="max-w-3xl mx-auto text-gray-700">
              <p className="mb-6">
                Eliminating math anxiety opens doors in STEM fields, research, and personal finance. By building
                confidence in mathematical abilities, we're empowering individuals to pursue their dreams without
                limitations.
              </p>
              <p>
                We believe that with the right support, everyone can learn and enjoy math. Our mission is to bring that
                support to every learner, fostering a world where mathematical thinking is accessible and embraced by
                all.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Defeat Math Anxiety?</h2>
            <p className="mb-8">
              Sign up to stay informed about our beta launch and be the first to try the interactive AI textbook.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-6 rounded-r-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Modal for Sign Up */}
        {showSignUp && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sign Up</h3>
                <div className="mt-2 px-7 py-3">
                  <SignUp setShowSignUp={setShowSignUp} />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowSignUp(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Login */}
        {showLogin && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Login</h3>
                <div className="mt-2 px-7 py-3">
                  <Login setShowLogin={setShowLogin} />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowLogin(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">MathConfidence</h3>
              <p className="text-sm">Empowering learners to overcome math anxiety and succeed.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="text-sm">
                <li>
                  <Link href="#" className="hover:text-indigo-300">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <p className="text-sm">&copy; 2025 MathConfidence - All Rights Reserved</p>
              <p className="text-sm mt-2">Powered by Next.js & Tailwind CSS</p>
              <p className="text-sm">Concept by MathConfidence Team</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

