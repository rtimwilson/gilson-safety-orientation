'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrientation } from '@/lib/orientation-context'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { SignaturePad } from '@/components/SignaturePad'

const safetyTopics = [
  'Safety Policy (Management & Employee commitments)',
  'Assignment of Responsibility',
  'Hazard Assessment Policy (Annual/Project/FLHA)',
  'Safe Work Practices and Job Procedures',
  'Safety Rules and Disciplinary Policy',
  'PPE Policy (Mandatory & Situational)',
  'Maintenance and Training Policy',
  'Inspection Policy',
  'Incident Investigation Policy',
  'Emergency Rescue Plan & Numbers',
  'Drug/Alcohol Policy',
  'Harassment Code of Practice',
  'Violence in the Workplace Policy',
  'Lock Out Policy',
  'Fall Protection',
  'Respiratory Protection',
  'Confined Space Entry',
  'Hot Work Procedures',
  'Working Alone Policy',
  'Right to Know about hazards',
  'Right to Refuse unsafe work',
  'Right to Participate in safety decisions',
]

export default function AcknowledgmentPage() {
  const router = useRouter()
  const { state, signAcknowledgment, setCurrentStep } = useOrientation()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isAcknowledged, setIsAcknowledged] = useState(false)

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!state.workerInfo) {
      router.push('/orientation/info')
    } else if (!state.videoCompleted) {
      router.push('/orientation/video')
    } else if (!state.quizPassed) {
      router.push('/orientation/quiz')
    }
  }, [state.workerInfo, state.videoCompleted, state.quizPassed, router])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolled(true)
    }
  }

  const handleSignature = (signatureData: string) => {
    signAcknowledgment(signatureData)
    setCurrentStep('complete')
    router.push('/orientation/complete')
  }

  if (!state.workerInfo || !state.videoCompleted || !state.quizPassed) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Gilson Safety Orientation</h1>
        </div>
      </header>

      <ProgressIndicator />

      {/* Acknowledgment Content */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Safety Acknowledgment
            </h2>
            <p className="text-gray-600 mb-6">
              Please review the safety topics covered and sign to acknowledge your understanding.
            </p>

            {/* Topics List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Topics Covered in This Orientation:
              </h3>
              <div
                onScroll={handleScroll}
                className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <ul className="space-y-2">
                  {safetyTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {!hasScrolled && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Scroll to read all topics
                </p>
              )}
            </div>

            {/* Acknowledgment Statement */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAcknowledged}
                    onChange={(e) => setIsAcknowledged(e.target.checked)}
                    disabled={!hasScrolled}
                    className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className={`text-sm ${hasScrolled ? 'text-gray-800' : 'text-gray-500'}`}>
                    I acknowledge that I have watched the safety orientation video, completed the knowledge quiz,
                    and understand the safety policies and procedures outlined. I agree to follow all safety rules
                    and report any hazards or unsafe conditions to my supervisor.
                  </span>
                </label>
              </div>
            </div>

            {/* Signature Section */}
            {isAcknowledged && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Signature
                </h3>
                <SignaturePad onSave={handleSignature} />
              </div>
            )}

            {!hasScrolled && (
              <p className="text-center text-sm text-gray-500">
                Please scroll through all topics to continue
              </p>
            )}
          </div>

          {/* Employee Rights Reminder */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Remember Your Rights:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Right to Know</strong> - about workplace hazards</li>
              <li>• <strong>Right to Participate</strong> - in safety decisions</li>
              <li>• <strong>Right to Refuse</strong> - unsafe work without retaliation</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
