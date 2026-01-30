'use client'

import { useState, useEffect } from 'react'

interface QuizQuestionProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  correctAnswer: boolean
  explanation: string
  onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  correctAnswer,
  explanation,
  onAnswer
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Reset state when question changes to enable buttons for new question
  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
  }, [questionNumber])

  const handleAnswer = (answer: boolean) => {
    if (showResult) return // Prevent changing answer after submission

    setSelectedAnswer(answer)
    setShowResult(true)

    // Delay before moving to next question
    setTimeout(() => {
      onAnswer(answer === correctAnswer)
    }, 2000)
  }

  const isCorrect = selectedAnswer === correctAnswer

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question number */}
      <div className="mb-6">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {questionText}
        </h2>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleAnswer(true)}
          disabled={showResult}
          className={`
            py-6 px-8 text-xl font-bold rounded-xl transition-all duration-200
            ${showResult && selectedAnswer === true
              ? isCorrect
                ? 'bg-green-500 text-white ring-4 ring-green-200'
                : 'bg-red-500 text-white ring-4 ring-red-200'
              : showResult && correctAnswer === true
                ? 'bg-green-100 text-green-800 border-2 border-green-500'
                : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-300 hover:border-green-400'
            }
            ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          TRUE
        </button>

        <button
          onClick={() => handleAnswer(false)}
          disabled={showResult}
          className={`
            py-6 px-8 text-xl font-bold rounded-xl transition-all duration-200
            ${showResult && selectedAnswer === false
              ? isCorrect
                ? 'bg-green-500 text-white ring-4 ring-green-200'
                : 'bg-red-500 text-white ring-4 ring-red-200'
              : showResult && correctAnswer === false
                ? 'bg-green-100 text-green-800 border-2 border-green-500'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-300 hover:border-red-400'
            }
            ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          FALSE
        </button>
      </div>

      {/* Result feedback */}
      {showResult && (
        <div
          className={`
            p-4 rounded-lg animate-fade-in
            ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
          `}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
