'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useOrientation } from '@/lib/orientation-context'

export default function Home() {
  const { state, resetOrientation } = useOrientation()

  // If there's an in-progress session, show resume option
  const hasInProgress = state.sessionId && state.currentStep !== 'complete'

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header with Gilson Red Gradient */}
      <header className="text-white py-8 px-4" style={{
        background: 'linear-gradient(135deg, #a12642 0%, #8a1f38 40%, #7a1c32 70%, #5a1424 100%)'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>
            GIL-SON CONSTRUCTION
          </h1>
          <p className="text-white/80 text-lg tracking-wide">
            Safety Orientation
          </p>
        </div>
      </header>

      {/* Diagonal divider */}
      <div className="h-4 -mt-2" style={{
        background: 'linear-gradient(135deg, #5a1424 0%, transparent 50%)',
      }} />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            {/* Gilson Logo */}
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <Image
                src="/gilson-logo.png"
                alt="Gil-Son Construction Limited"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h2 className="text-2xl font-bold mb-4" style={{ color: '#231f20', fontFamily: 'var(--font-oswald), sans-serif' }}>
              Welcome to Your Safety Orientation
            </h2>

            <p className="mb-8" style={{ color: '#6b6b6b' }}>
              Complete this orientation to learn about our safety policies and get cleared to work on Gil-Son job sites.
            </p>

            <div className="space-y-4">
              {hasInProgress ? (
                <>
                  <Link
                    href={`/orientation/${state.currentStep}`}
                    className="block w-full py-4 px-6 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: '#a12642' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7a1c32'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a12642'}
                  >
                    Continue Orientation
                  </Link>
                  <button
                    onClick={resetOrientation}
                    className="block w-full py-4 px-6 border-2 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50"
                    style={{ borderColor: '#0a1a72', color: '#0a1a72' }}
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <Link
                  href="/orientation/info"
                  className="block w-full py-4 px-6 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#a12642' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7a1c32'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a12642'}
                >
                  Start Orientation
                </Link>
              )}
            </div>

            {/* Time estimate */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-sm" style={{ color: '#6b6b6b' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#a12642' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~45 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#0a1a72' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>10 questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin link */}
          <div className="text-center mt-6">
            <Link
              href="/admin"
              className="text-sm underline transition-colors"
              style={{ color: '#0a1a72' }}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm" style={{ color: '#6b6b6b' }}>
        <p>&copy; {new Date().getFullYear()} Gil-Son Construction Limited</p>
      </footer>
    </main>
  )
}
