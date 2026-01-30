'use client'

import { useRef, useState, useEffect } from 'react'
import { useOrientation } from '@/lib/orientation-context'

interface VideoPlayerProps {
  videoUrl: string
  onComplete: () => void
}

export function VideoPlayer({ videoUrl, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, updateVideoProgress } = useOrientation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasWatchedOnce, setHasWatchedOnce] = useState(state.videoCompleted)
  const [maxWatched, setMaxWatched] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const time = video.currentTime
      setCurrentTime(time)

      // Track maximum watched position (prevent skipping on first watch)
      if (!hasWatchedOnce && time > maxWatched) {
        setMaxWatched(time)
      }

      // Update progress percentage
      if (duration > 0) {
        const progress = (time / duration) * 100
        updateVideoProgress(progress)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setHasWatchedOnce(true)
      onComplete()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    // Prevent seeking ahead on first watch
    const handleSeeking = () => {
      if (!hasWatchedOnce && video.currentTime > maxWatched + 2) {
        video.currentTime = maxWatched
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('seeking', handleSeeking)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('seeking', handleSeeking)
    }
  }, [duration, hasWatchedOnce, maxWatched, onComplete, updateVideoProgress])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          playsInline
          controlsList={hasWatchedOnce ? '' : 'nodownload nofullscreen'}
        />

        {/* Custom controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-600 rounded-full mb-3 cursor-pointer"
            onClick={(e) => {
              if (!hasWatchedOnce) return // Prevent clicking to skip on first watch
              const video = videoRef.current
              if (!video) return
              const rect = e.currentTarget.getBoundingClientRect()
              const pos = (e.clientX - rect.left) / rect.width
              video.currentTime = pos * duration
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Time display */}
              <span className="text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen button (only after first watch) */}
            {hasWatchedOnce && (
              <button
                onClick={() => videoRef.current?.requestFullscreen()}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress info */}
      <div className="mt-4 text-center">
        {!hasWatchedOnce && (
          <p className="text-sm text-gray-600">
            Please watch the entire video to continue. Skipping is not allowed on your first viewing.
          </p>
        )}
        {hasWatchedOnce && (
          <p className="text-sm text-green-600 font-medium">
            Video completed! You can now proceed to the quiz.
          </p>
        )}
      </div>
    </div>
  )
}
