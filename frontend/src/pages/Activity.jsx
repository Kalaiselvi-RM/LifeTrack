import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Square,
} from "lucide-react";

import { useActivities } from "../context/ActivityContext";
import {
  startTimerSession,
  pauseTimerSession,
  resumeTimerSession,
  stopTimerSession,
} from "../services/api";

function Activity() {
  const {
    activities,
    addActivity,
    deleteActivity,
    loading,
    error,
  } = useActivities();

  const [activityName, setActivityName] = useState("");
  const [category, setCategory] = useState("Study");

  // -----------------------------
  // TIMER STATE
  // -----------------------------

  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerLoading, setTimerLoading] = useState(false);
  const [timerError, setTimerError] = useState("");

  // -----------------------------
  // ADD ACTIVITY
  // -----------------------------

  const handleAddActivity = async () => {
    if (!activityName.trim()) {
      return;
    }

    try {
      await addActivity(activityName.trim(), category);

      setActivityName("");
      setCategory("Study");
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  // -----------------------------
  // FORMAT TIMER
  // -----------------------------

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ].join(":");
  };

  // -----------------------------
  // CALCULATE ELAPSED TIME
  // -----------------------------

  const calculateElapsed = (session) => {
    if (!session) {
      return 0;
    }

    const savedDuration = Number(session.durationSeconds) || 0;

    // PAUSED / COMPLETED
    if (session.status !== "RUNNING") {
      return savedDuration;
    }

    const startPoint =
      session.lastResumedAt || session.startTime;

    if (!startPoint) {
      return savedDuration;
    }

    const startTime = new Date(startPoint).getTime();

    if (Number.isNaN(startTime)) {
      return savedDuration;
    }

    const now = Date.now();

    const currentRunningTime = Math.max(
      0,
      Math.floor((now - startTime) / 1000)
    );

    return savedDuration + currentRunningTime;
  };

  // -----------------------------
  // TIMER CLOCK
  // -----------------------------

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      setElapsedSeconds(calculateElapsed(activeSession));
    };

    updateTimer();

    if (activeSession.status !== "RUNNING") {
      return;
    }

    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeSession]);

  // -----------------------------
  // START TIMER
  // -----------------------------

  const handleStartTimer = async (activity) => {
    if (!activity?.id) {
      setTimerError("Invalid activity.");
      return;
    }

    if (
      activeSession &&
      activeSession.status !== "COMPLETED"
    ) {
      setTimerError(
        "Please complete the current timer before starting another one."
      );
      return;
    }

    try {
      setTimerLoading(true);
      setTimerError("");

      const session = await startTimerSession(activity.id);

      console.log("Timer started:", session);

      setActiveSession(session);
      setElapsedSeconds(calculateElapsed(session));
    } catch (err) {
      console.error("Failed to start timer:", err);

      setTimerError(
        err?.message || "Failed to start timer session."
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // -----------------------------
  // PAUSE TIMER
  // -----------------------------

  const handlePauseTimer = async () => {
    if (!activeSession?.id) {
      return;
    }

    try {
      setTimerLoading(true);
      setTimerError("");

      const session = await pauseTimerSession(
        activeSession.id
      );

      console.log("Timer paused:", session);

      setActiveSession(session);

      setElapsedSeconds(
        Number(session.durationSeconds) || 0
      );
    } catch (err) {
      console.error("Failed to pause timer:", err);

      setTimerError(
        err?.message || "Failed to pause timer."
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // -----------------------------
  // RESUME TIMER
  // -----------------------------

  const handleResumeTimer = async () => {
    if (!activeSession?.id) {
      return;
    }

    try {
      setTimerLoading(true);
      setTimerError("");

      const session = await resumeTimerSession(
        activeSession.id
      );

      console.log("Timer resumed:", session);

      setActiveSession(session);
      setElapsedSeconds(calculateElapsed(session));
    } catch (err) {
      console.error("Failed to resume timer:", err);

      setTimerError(
        err?.message || "Failed to resume timer."
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // -----------------------------
  // STOP TIMER
  // -----------------------------

  const handleStopTimer = async () => {
    if (!activeSession?.id) {
      return;
    }

    try {
      setTimerLoading(true);
      setTimerError("");

      const session = await stopTimerSession(
        activeSession.id
      );

      console.log("Timer stopped:", session);

      setActiveSession(session);

      setElapsedSeconds(
        Number(session.durationSeconds) || 0
      );
    } catch (err) {
      console.error("Failed to stop timer:", err);

      setTimerError(
        err?.message || "Failed to stop timer."
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // -----------------------------
  // RESET TIMER DISPLAY
  // -----------------------------

  const handleResetTimer = () => {
    setActiveSession(null);
    setElapsedSeconds(0);
    setTimerError("");
  };

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Activities
        </h1>

        <p className="text-gray-400 mt-2">
          Manage the activities you want to track.
        </p>
      </div>

      {/* GENERAL ERROR */}

      {error && (
        <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* TIMER ERROR */}

      {timerError && (
        <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
          {timerError}
        </div>
      )}

      {/* ACTIVE TIMER */}

      {activeSession && (
        <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-8">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-400 text-sm">
                Current Activity
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {activeSession.activity?.name ||
                  "Activity"}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Status:{" "}
                <span
                  className={
                    activeSession.status === "RUNNING"
                      ? "text-green-400"
                      : activeSession.status === "PAUSED"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }
                >
                  {activeSession.status}
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-5xl font-mono font-bold">
                {formatTime(elapsedSeconds)}
              </p>
            </div>

          </div>

          {/* TIMER BUTTONS */}

          <div className="flex flex-wrap gap-3 mt-8">

            {/* PAUSE */}

            {activeSession.status === "RUNNING" && (
              <button
                onClick={handlePauseTimer}
                disabled={timerLoading}
                className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-3 rounded-xl font-medium hover:bg-yellow-400 disabled:opacity-50"
              >
                <Pause size={18} />

                {timerLoading
                  ? "Processing..."
                  : "Pause"}
              </button>
            )}

            {/* RESUME */}

            {activeSession.status === "PAUSED" && (
              <button
                onClick={handleResumeTimer}
                disabled={timerLoading}
                className="flex items-center gap-2 bg-green-500 text-black px-5 py-3 rounded-xl font-medium hover:bg-green-400 disabled:opacity-50"
              >
                <RotateCcw size={18} />

                {timerLoading
                  ? "Processing..."
                  : "Resume"}
              </button>
            )}

            {/* STOP */}

            {activeSession.status !== "COMPLETED" && (
              <button
                onClick={handleStopTimer}
                disabled={timerLoading}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-400 disabled:opacity-50"
              >
                <Square size={18} />

                {timerLoading
                  ? "Processing..."
                  : "Stop"}
              </button>
            )}

            {/* NEW TIMER */}

            {activeSession.status === "COMPLETED" && (
              <button
                onClick={handleResetTimer}
                className="flex items-center gap-2 bg-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-600"
              >
                <RotateCcw size={18} />

                New Timer
              </button>
            )}

          </div>

        </div>
      )}

      {/* ADD ACTIVITY */}

      <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-6">

        <h2 className="text-xl font-semibold">
          Add Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

          {/* ACTIVITY NAME */}

          <input
            type="text"
            placeholder="Activity name"
            value={activityName}
            onChange={(e) =>
              setActivityName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddActivity();
              }
            }}
            className="bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
          />

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none"
          >
            <option value="Study">Study</option>
            <option value="Development">
              Development
            </option>
            <option value="Health">Health</option>
            <option value="Personal">Personal</option>
            <option value="Entertainment">
              Entertainment
            </option>
          </select>

          {/* ADD BUTTON */}

          <button
            onClick={handleAddActivity}
            disabled={!activityName.trim()}
            className="flex items-center justify-center gap-2 bg-white text-black rounded-xl px-5 py-3 font-medium hover:bg-gray-200 disabled:opacity-40"
          >
            <Plus size={18} />

            Add Activity
          </button>

        </div>

      </div>

      {/* ACTIVITIES */}

      <div className="mt-8">

        <h2 className="text-xl font-semibold">
          Your Activities
        </h2>

        {loading ? (
          <p className="text-gray-400 mt-5">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-gray-400 mt-5">
            No activities found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            {activities.map((activity) => (

              <div
                key={activity.id}
                className="bg-[#181b24] border border-gray-800 rounded-2xl p-5"
              >

                <div className="flex items-center justify-between">

                  {/* ACTIVITY INFORMATION */}

                  <div>

                    <h3 className="text-lg font-semibold">
                      {activity.name}
                    </h3>

                    <div className="flex gap-2 mt-2">

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                        {activity.category}
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                        {activity.classification}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-2">

                    {/* START */}

                    <button
                      onClick={() =>
                        handleStartTimer(activity)
                      }
                      disabled={
                        timerLoading ||
                        Boolean(
                          activeSession &&
                          activeSession.status !==
                            "COMPLETED"
                        )
                      }
                      className="p-3 rounded-xl hover:bg-gray-800 disabled:opacity-40"
                      title="Start activity"
                    >
                      <Play size={20} />
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        deleteActivity(activity.id)
                      }
                      disabled={timerLoading}
                      className="p-3 rounded-xl hover:bg-gray-800 text-gray-400 disabled:opacity-40"
                      title="Delete activity"
                    >
                      <Trash2 size={20} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Activity;