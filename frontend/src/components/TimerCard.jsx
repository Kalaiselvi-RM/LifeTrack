import { useEffect, useState } from "react"
import {
  Play,
  Pause,
  Square,
} from "lucide-react"

import { useActivities } from "../context/ActivityContext"

import {
  startTimerSession,
  pauseTimerSession,
  resumeTimerSession,
  stopTimerSession,
} from "../services/api"


function TimerCard() {

  const {
    activeActivity,
  } = useActivities()


  const [seconds, setSeconds] =
    useState(0)

  const [sessionId, setSessionId] =
    useState(null)

  const [status, setStatus] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState(null)


  // =================================
  // TIMER
  // =================================

  useEffect(() => {

    if (status !== "RUNNING") {
      return
    }

    const interval = setInterval(() => {

      setSeconds((prev) => prev + 1)

    }, 1000)

    return () => {
      clearInterval(interval)
    }

  }, [status])


  // =================================
  // FORMAT TIME
  // =================================

  const formatTime = (totalSeconds) => {

    const hours =
      Math.floor(totalSeconds / 3600)

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      )

    const remainingSeconds =
      totalSeconds % 60


    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`
  }


  // =================================
  // START
  // =================================

  const handleStart = async () => {

    if (!activeActivity) {
      return
    }

    try {

      setLoading(true)
      setError(null)

      const session =
        await startTimerSession(
          activeActivity.id
        )

      setSessionId(session.id)

      setSeconds(
        session.durationSeconds || 0
      )

      setStatus("RUNNING")

    } catch (error) {

      console.error(error)

      setError(
        "Unable to start timer"
      )

    } finally {

      setLoading(false)

    }
  }


  // =================================
  // PAUSE
  // =================================

  const handlePause = async () => {

    if (!sessionId) {
      return
    }

    try {

      setLoading(true)
      setError(null)

      const session =
        await pauseTimerSession(
          sessionId
        )

      setSeconds(
        session.durationSeconds || 0
      )

      setStatus("PAUSED")

    } catch (error) {

      console.error(error)

      setError(
        "Unable to pause timer"
      )

    } finally {

      setLoading(false)

    }
  }


  // =================================
  // RESUME
  // =================================

  const handleResume = async () => {

    if (!sessionId) {
      return
    }

    try {

      setLoading(true)
      setError(null)

      const session =
        await resumeTimerSession(
          sessionId
        )

      setStatus("RUNNING")

    } catch (error) {

      console.error(error)

      setError(
        "Unable to resume timer"
      )

    } finally {

      setLoading(false)

    }
  }


  // =================================
  // STOP
  // =================================

  const handleStop = async () => {

    if (!sessionId) {
      return
    }

    try {

      setLoading(true)
      setError(null)

      const session =
        await stopTimerSession(
          sessionId
        )

      setSeconds(
        session.durationSeconds || 0
      )

      setStatus("COMPLETED")

      setSessionId(null)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to stop timer"
      )

    } finally {

      setLoading(false)

    }
  }


  // =================================
  // STATUS TEXT
  // =================================

  const getStatusText = () => {

    if (status === "RUNNING") {
      return "Timer running"
    }

    if (status === "PAUSED") {
      return "Timer paused"
    }

    if (status === "COMPLETED") {
      return "Session completed"
    }

    return "Timer not started"
  }


  return (
    <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            Current Activity
          </p>

          <h2 className="text-xl font-semibold mt-1">

            {activeActivity
              ? activeActivity.name
              : "No activity selected"}

          </h2>


          {activeActivity && (

            <p className="text-sm text-gray-500 mt-1">

              {activeActivity.category}

            </p>

          )}

        </div>


        {/* TIMER */}

        <div className="text-right">

          <p className="text-4xl font-mono font-bold">

            {formatTime(seconds)}

          </p>

          <p className="text-sm text-gray-500 mt-1">

            {getStatusText()}

          </p>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mt-4 text-sm text-red-400">

          {error}

        </div>

      )}


      {/* BUTTONS */}

      <div className="flex gap-3 mt-6">

        {/* START */}

        {status === null ||
        status === "COMPLETED" ? (

          <button
            onClick={handleStart}
            disabled={
              !activeActivity ||
              loading
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-40"
          >

            <Play size={18} />

            {loading
              ? "Starting..."
              : "Start"}

          </button>

        ) : null}


        {/* PAUSE */}

        {status === "RUNNING" && (

          <button
            onClick={handlePause}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-black font-medium hover:bg-yellow-400 disabled:opacity-40"
          >

            <Pause size={18} />

            {loading
              ? "Pausing..."
              : "Pause"}

          </button>

        )}


        {/* RESUME */}

        {status === "PAUSED" && (

          <button
            onClick={handleResume}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-40"
          >

            <Play size={18} />

            {loading
              ? "Resuming..."
              : "Resume"}

          </button>

        )}


        {/* STOP */}

        {(status === "RUNNING" ||
          status === "PAUSED") && (

          <button
            onClick={handleStop}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40"
          >

            <Square size={18} />

            {loading
              ? "Saving..."
              : "Stop"}

          </button>

        )}

      </div>

    </div>
  )
}


export default TimerCard