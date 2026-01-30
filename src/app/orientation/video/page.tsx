'use client'

import { useRouter } from 'next/navigation'
import { useOrientation } from '@/lib/orientation-context'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { VideoPlayer } from '@/components/VideoPlayer'
import { useEffect } from 'react'

export default function VideoPage() {
  const router = useRouter()
  const { state, completeVideo, setCurrentStep } = useOrientation()

  // Redirect if no worker info
  useEffect(() => {
    if (!state.workerInfo) {
      router.push('/orientation/info')
    }
  }, [state.workerInfo, router])

  const handleVideoComplete = () => {
    completeVideo()
  }

  const handleContinue = () => {
    setCurrentStep('quiz')
    router.push('/orientation/quiz')
  }

  // Placeholder video URL - replace with actual orientation video
  const videoUrl = '/videos/orientation.mp4'

  if (!state.workerInfo) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Gilson Safety Orientation</h1>
          <span className="text-blue-200 text-sm">
            Welcome, {state.workerInfo.fullName}
          </span>
        </div>
      </header>

      <ProgressIndicator />

      {/* Video Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Safety Orientation Video
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Please watch the entire video to learn about our safety policies and procedures.
            </p>

            <VideoPlayer
              videoUrl={videoUrl}
              onComplete={handleVideoComplete}
            />

            {state.videoCompleted && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleContinue}
                  className="py-4 px-8 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
                >
                  Continue to Quiz
                </button>
              </div>
            )}
          </div>

          {/* Video placeholder message */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              <strong>Note:</strong> The orientation video will be added here. For testing, click play and let the video complete to proceed.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
