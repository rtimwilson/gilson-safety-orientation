'use client'

import { useOrientation } from '@/lib/orientation-context'

const steps = [
  { id: 'info', label: 'Your Info', number: 1 },
  { id: 'video', label: 'Video', number: 2 },
  { id: 'quiz', label: 'Quiz', number: 3 },
  { id: 'acknowledgment', label: 'Sign Off', number: 4 },
  { id: 'complete', label: 'Complete', number: 5 }
] as const

export function ProgressIndicator() {
  const { state } = useOrientation()
  const currentStepIndex = steps.findIndex(s => s.id === state.currentStep)

  return (
    <div className="w-full py-4 px-2 bg-white border-b" style={{ borderColor: '#e5e5e5' }}>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: isCompleted ? '#a12642' : isCurrent ? '#0a1a72' : '#e5e5e5',
                    color: isCompleted || isCurrent ? '#ffffff' : '#6b6b6b',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(10, 26, 114, 0.2)' : 'none'
                  }}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className="mt-2 text-xs font-medium hidden sm:block"
                  style={{
                    color: isCompleted ? '#a12642' : isCurrent ? '#0a1a72' : '#6b6b6b'
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="h-1 flex-1 mx-2 rounded min-w-[20px] sm:min-w-[40px]"
                  style={{
                    backgroundColor: index < currentStepIndex ? '#a12642' : '#e5e5e5'
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
