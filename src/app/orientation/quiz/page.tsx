'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrientation } from '@/lib/orientation-context'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { QuizQuestion } from '@/components/QuizQuestion'
import { defaultQuizQuestions, shuffleQuestions } from '@/lib/quiz-questions'

type QuizState = 'intro' | 'questions' | 'results'

export default function QuizPage() {
  const router = useRouter()
  const { state, passQuiz, incrementQuizAttempts, setCurrentStep } = useOrientation()

  const [quizState, setQuizState] = useState<QuizState>('intro')
  const [questions, setQuestions] = useState(defaultQuizQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [score, setScore] = useState(0)

  // Redirect if no worker info or video not completed
  useEffect(() => {
    if (!state.workerInfo) {
      router.push('/orientation/info')
    } else if (!state.videoCompleted) {
      router.push('/orientation/video')
    }
  }, [state.workerInfo, state.videoCompleted, router])

  const startQuiz = () => {
    // Shuffle questions for each attempt
    setQuestions(shuffleQuestions(defaultQuizQuestions))
    setCurrentQuestionIndex(0)
    setAnswers([])
    setScore(0)
    incrementQuizAttempts()
    setQuizState('questions')
  }

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)
      }, 500)
    } else {
      setTimeout(() => {
        setQuizState('results')
      }, 500)
    }
  }

  const handlePass = () => {
    passQuiz()
    setCurrentStep('acknowledgment')
    router.push('/orientation/acknowledgment')
  }

  const isPassed = score === questions.length

  if (!state.workerInfo || !state.videoCompleted) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Gilson Safety Orientation</h1>
          <span className="text-blue-200 text-sm">
            Attempt #{state.quizAttempts + (quizState === 'intro' ? 1 : 0)}
          </span>
        </div>
      </header>

      <ProgressIndicator />

      {/* Quiz Content */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Introduction */}
          {quizState === 'intro' && (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Celebration of Knowledge
              </h2>

              <p className="text-gray-600 mb-6">
                You will now answer {questions.length} True/False questions about the safety orientation.
                You must answer all questions correctly (100%) to pass.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> You can retry the quiz as many times as needed. Questions will be shuffled on each attempt.
                </p>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
              >
                Start Quiz
              </button>
            </div>
          )}

          {/* Questions */}
          {quizState === 'questions' && (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <QuizQuestion
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                questionText={questions[currentQuestionIndex].questionText}
                correctAnswer={questions[currentQuestionIndex].correctAnswer}
                explanation={questions[currentQuestionIndex].explanation}
                onAnswer={handleAnswer}
              />
            </div>
          )}

          {/* Results */}
          {quizState === 'results' && (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center">
              {isPassed ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    Congratulations!
                  </h2>

                  <p className="text-gray-600 mb-2">
                    You scored <span className="font-bold text-green-600">{score}/{questions.length}</span>
                  </p>

                  <p className="text-gray-600 mb-6">
                    You have successfully completed the knowledge quiz.
                  </p>

                  <button
                    onClick={handlePass}
                    className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition"
                  >
                    Continue to Acknowledgment
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-red-800 mb-4">
                    Not Quite There
                  </h2>

                  <p className="text-gray-600 mb-2">
                    You scored <span className="font-bold text-red-600">{score}/{questions.length}</span>
                  </p>

                  <p className="text-gray-600 mb-6">
                    You need to answer all questions correctly to pass.
                    Please review the material and try again.
                  </p>

                  <button
                    onClick={startQuiz}
                    className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
