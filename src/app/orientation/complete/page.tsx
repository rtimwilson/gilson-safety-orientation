'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOrientation } from '@/lib/orientation-context'
import { ProgressIndicator } from '@/components/ProgressIndicator'

export default function CompletePage() {
  const router = useRouter()
  const { state, resetOrientation } = useOrientation()

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!state.workerInfo) {
      router.push('/orientation/info')
    } else if (!state.videoCompleted) {
      router.push('/orientation/video')
    } else if (!state.quizPassed) {
      router.push('/orientation/quiz')
    } else if (!state.acknowledgmentSigned) {
      router.push('/orientation/acknowledgment')
    }
  }, [state, router])

  const handleSiteDocsRedirect = () => {
    // In production, this would redirect to SiteDocs with worker data
    // For now, we'll open a placeholder URL
    window.open('https://sitedocs.com', '_blank')
  }

  const handleStartOver = () => {
    resetOrientation()
    router.push('/')
  }

  if (!state.workerInfo || !state.acknowledgmentSigned) {
    return null
  }

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Gilson Safety Orientation</h1>
        </div>
      </header>

      <ProgressIndicator />

      {/* Completion Content */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Orientation Complete!
            </h2>

            <p className="text-gray-600 mb-6">
              Congratulations, <strong>{state.workerInfo.fullName}</strong>! You have successfully completed your safety orientation.
            </p>

            {/* Completion Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Completion Summary</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Name:</dt>
                  <dd className="font-medium text-gray-900">{state.workerInfo.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Hire Date:</dt>
                  <dd className="font-medium text-gray-900">{state.workerInfo.hireDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Supervisor:</dt>
                  <dd className="font-medium text-gray-900">{state.workerInfo.supervisorName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Quiz Attempts:</dt>
                  <dd className="font-medium text-gray-900">{state.quizAttempts}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Completed:</dt>
                  <dd className="font-medium text-gray-900">{completionDate}</dd>
                </div>
              </dl>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
              <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                <li>Complete your onboarding paperwork in SiteDocs</li>
                <li>Report to your supervisor for job site assignment</li>
                <li>Collect your required PPE</li>
                <li>Begin work safely!</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSiteDocsRedirect}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
              >
                Continue to SiteDocs
              </button>

              <Link
                href="/"
                className="block w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>

          {/* Signature Display */}
          {state.signatureData && (
            <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">Your Signature</h4>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <img
                  src={state.signatureData}
                  alt="Signature"
                  className="max-h-20 mx-auto"
                />
              </div>
            </div>
          )}

          {/* Safety Reminder */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-800 text-sm">
              <strong>Remember:</strong> Safety is everyone&apos;s responsibility. If you see something unsafe, say something!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Gilson Construction Limited</p>
      </footer>
    </main>
  )
}
