'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type WorkerStatus =
  | 'NEW_TO_POSITION'
  | 'RETURNING_HAZARDS_CHANGED'
  | 'UNDER_25_RETURNING'
  | 'AFFECTED_BY_HAZARD_CHANGES'
  | 'ANNUAL_REVIEW'

export interface WorkerInfo {
  fullName: string
  hireDate: string
  supervisorName: string
  siteId: string
  statusType: WorkerStatus
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
}

export interface OrientationState {
  sessionId: string | null
  workerInfo: WorkerInfo | null
  videoProgress: number
  videoCompleted: boolean
  quizPassed: boolean
  quizAttempts: number
  acknowledgmentSigned: boolean
  signatureData: string | null
  currentStep: 'info' | 'video' | 'quiz' | 'acknowledgment' | 'complete'
}

interface OrientationContextType {
  state: OrientationState
  setWorkerInfo: (info: WorkerInfo) => void
  setSessionId: (id: string) => void
  updateVideoProgress: (progress: number) => void
  completeVideo: () => void
  passQuiz: () => void
  incrementQuizAttempts: () => void
  signAcknowledgment: (signature: string) => void
  setCurrentStep: (step: OrientationState['currentStep']) => void
  resetOrientation: () => void
}

const initialState: OrientationState = {
  sessionId: null,
  workerInfo: null,
  videoProgress: 0,
  videoCompleted: false,
  quizPassed: false,
  quizAttempts: 0,
  acknowledgmentSigned: false,
  signatureData: null,
  currentStep: 'info'
}

const OrientationContext = createContext<OrientationContextType | undefined>(undefined)

const STORAGE_KEY = 'gilson-orientation-state'

export function OrientationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrientationState>(initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(parsed)
      } catch (e) {
        console.error('Failed to parse saved orientation state:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save state to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isHydrated])

  const setWorkerInfo = (info: WorkerInfo) => {
    setState(prev => ({ ...prev, workerInfo: info }))
  }

  const setSessionId = (id: string) => {
    setState(prev => ({ ...prev, sessionId: id }))
  }

  const updateVideoProgress = (progress: number) => {
    setState(prev => ({ ...prev, videoProgress: progress }))
  }

  const completeVideo = () => {
    setState(prev => ({
      ...prev,
      videoCompleted: true,
      videoProgress: 100,
      currentStep: 'quiz'
    }))
  }

  const passQuiz = () => {
    setState(prev => ({
      ...prev,
      quizPassed: true,
      currentStep: 'acknowledgment'
    }))
  }

  const incrementQuizAttempts = () => {
    setState(prev => ({ ...prev, quizAttempts: prev.quizAttempts + 1 }))
  }

  const signAcknowledgment = (signature: string) => {
    setState(prev => ({
      ...prev,
      acknowledgmentSigned: true,
      signatureData: signature,
      currentStep: 'complete'
    }))
  }

  const setCurrentStep = (step: OrientationState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }

  const resetOrientation = () => {
    setState(initialState)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!isHydrated) {
    return null // Prevent hydration mismatch
  }

  return (
    <OrientationContext.Provider value={{
      state,
      setWorkerInfo,
      setSessionId,
      updateVideoProgress,
      completeVideo,
      passQuiz,
      incrementQuizAttempts,
      signAcknowledgment,
      setCurrentStep,
      resetOrientation
    }}>
      {children}
    </OrientationContext.Provider>
  )
}

export function useOrientation() {
  const context = useContext(OrientationContext)
  if (context === undefined) {
    throw new Error('useOrientation must be used within an OrientationProvider')
  }
  return context
}
