import { useEffect, useState } from "react";

import {
  Play,
  Pause,
  Square,
  Clock3,
  Moon,
  Activity as ActivityIcon,
  Trash2,
  Save,
  Pencil,
} from "lucide-react";

import {
  getDashboardStats,
  getTimerSessions,
  deleteTimerSession,
  updateWastedTime,
  pauseTimerSession,
  resumeTimerSession,
  stopTimerSession,
} from "../services/api";


// =====================================================
// DASHBOARD
// =====================================================

function Dashboard() {

  // =====================================================
  // STATE
  // =====================================================

  const [dashboardStats, setDashboardStats] = useState(null);

  const [timerHistory, setTimerHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [historyLoading, setHistoryLoading] = useState(true);

  const [error, setError] = useState("");

  const [historyError, setHistoryError] = useState("");

  // Wasted time editing
  const [editingSessionId, setEditingSessionId] =
    useState(null);

  const [wastedInput, setWastedInput] =
    useState("");

  const [savingWastedId, setSavingWastedId] =
    useState(null);

  // Timer action loading
  const [actionSessionId, setActionSessionId] =
    useState(null);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadDashboard();

    loadTimerHistory();

  }, []);


  // =====================================================
  // LIVE TIMER REFRESH
  // =====================================================

  useEffect(() => {

    const hasRunningSession =
      timerHistory.some(
        (session) =>
          session.status === "RUNNING"
      );

    if (!hasRunningSession) {
      return;
    }

    const interval = setInterval(() => {

      setTimerHistory((previous) => [
        ...previous,
      ]);

    }, 1000);

    return () => clearInterval(interval);

  }, [timerHistory]);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  async function loadDashboard() {

    try {

      setLoading(true);

      setError("");

      const data =
        await getDashboardStats();

      setDashboardStats(data);

    } catch (err) {

      console.error(
        "Failed to load dashboard:",
        err
      );

      setError(
        err.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // LOAD TIMER HISTORY
  // =====================================================

  async function loadTimerHistory() {

    try {

      setHistoryLoading(true);

      setHistoryError("");

      const data =
        await getTimerSessions();

      if (Array.isArray(data)) {

        setTimerHistory(data);

      } else {

        setTimerHistory([]);

      }

    } catch (err) {

      console.error(
        "Failed to load timer history:",
        err
      );

      setHistoryError(
        err.message ||
        "Failed to load timer history"
      );

    } finally {

      setHistoryLoading(false);

    }

  }


  // =====================================================
  // DELETE TIMER SESSION
  // =====================================================

  async function handleDeleteTimerSession(
    sessionId
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this timer session?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteTimerSession(
        sessionId
      );

      setTimerHistory(
        (previous) =>
          previous.filter(
            (session) =>
              session.id !== sessionId
          )
      );

    } catch (err) {

      console.error(
        "Failed to delete timer session:",
        err
      );

      alert(
        err.message ||
        "Failed to delete timer session"
      );

    }

  }


  // =====================================================
  // PAUSE TIMER
  // =====================================================

  async function handlePauseSession(
    sessionId
  ) {

    try {

      setActionSessionId(sessionId);

      const updatedSession =
        await pauseTimerSession(
          sessionId
        );

      setTimerHistory(
        (previous) =>
          previous.map(
            (session) =>
              session.id === sessionId
                ? {
                    ...session,
                    ...updatedSession,
                  }
                : session
          )
      );

    } catch (err) {

      console.error(
        "Failed to pause timer:",
        err
      );

      alert(
        err.message ||
        "Failed to pause timer"
      );

    } finally {

      setActionSessionId(null);

    }

  }


  // =====================================================
  // RESUME TIMER
  // =====================================================

  async function handleResumeSession(
    sessionId
  ) {

    try {

      setActionSessionId(sessionId);

      const updatedSession =
        await resumeTimerSession(
          sessionId
        );

      setTimerHistory(
        (previous) =>
          previous.map(
            (session) =>
              session.id === sessionId
                ? {
                    ...session,
                    ...updatedSession,
                  }
                : session
          )
      );

    } catch (err) {

      console.error(
        "Failed to resume timer:",
        err
      );

      alert(
        err.message ||
        "Failed to resume timer"
      );

    } finally {

      setActionSessionId(null);

    }

  }


  // =====================================================
  // STOP TIMER
  // =====================================================

  async function handleStopSession(
    sessionId
  ) {

    const confirmed =
      window.confirm(
        "Stop this timer session?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setActionSessionId(sessionId);

      const updatedSession =
        await stopTimerSession(
          sessionId
        );

      setTimerHistory(
        (previous) =>
          previous.map(
            (session) =>
              session.id === sessionId
                ? {
                    ...session,
                    ...updatedSession,
                  }
                : session
          )
      );

    } catch (err) {

      console.error(
        "Failed to stop timer:",
        err
      );

      alert(
        err.message ||
        "Failed to stop timer"
      );

    } finally {

      setActionSessionId(null);

    }

  }


  // =====================================================
  // START EDITING WASTED TIME
  // =====================================================

  function startEditingWastedTime(
    session
  ) {

    const currentWasted =
      Number(
        session.wastedSeconds || 0
      );

    setEditingSessionId(
      session.id
    );

    setWastedInput(
      String(currentWasted)
    );

  }


  // =====================================================
  // CANCEL EDITING
  // =====================================================

  function cancelEditingWastedTime() {

    setEditingSessionId(null);

    setWastedInput("");

  }


  // =====================================================
  // SAVE WASTED TIME
  // =====================================================

  async function handleSaveWastedTime(
    session
  ) {

    const totalSeconds =
      getCurrentDuration(session);

    let wastedSeconds =
      Number(wastedInput);

    if (
      !Number.isFinite(
        wastedSeconds
      ) ||
      wastedSeconds < 0
    ) {

      alert(
        "Please enter a valid wasted time in seconds."
      );

      return;

    }


    if (
      wastedSeconds >
      totalSeconds
    ) {

      alert(
        "Wasted time cannot be greater than total time."
      );

      return;

    }


    try {

      setSavingWastedId(
        session.id
      );

      const updatedSession =
        await updateWastedTime(
          session.id,
          Math.floor(
            wastedSeconds
          )
        );

      setTimerHistory(
        (previous) =>
          previous.map(
            (item) =>
              item.id === session.id
                ? {
                    ...item,
                    ...updatedSession,
                  }
                : item
          )
      );

      setEditingSessionId(
        null
      );

      setWastedInput("");

    } catch (err) {

      console.error(
        "Failed to update wasted time:",
        err
      );

      alert(
        err.message ||
        "Failed to update wasted time"
      );

    } finally {

      setSavingWastedId(null);

    }

  }


  // =====================================================
  // GET CURRENT DURATION
  // =====================================================

  function getCurrentDuration(
    session
  ) {

    const savedDuration =
      Number(
        session.durationSeconds || 0
      );


    // If timer is not running,
    // backend duration is already correct.
    if (
      session.status !==
      "RUNNING"
    ) {

      return Math.max(
        0,
        savedDuration
      );

    }


    // Running timer:
    // saved duration + current running segment

    if (!session.lastResumedAt) {

      return savedDuration;

    }


    const resumedAt =
      new Date(
        session.lastResumedAt
      ).getTime();

    const now =
      Date.now();

    const runningSeconds =
      Math.max(
        0,
        Math.floor(
          (now - resumedAt) /
          1000
        )
      );


    return (
      savedDuration +
      runningSeconds
    );

  }


  // =====================================================
  // FORMAT DURATION
  // =====================================================

  function formatDuration(
    seconds
  ) {

    const totalSeconds =
      Math.max(
        0,
        Math.floor(
          Number(seconds || 0)
        )
      );


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
        60
      );


    const remainingSeconds =
      totalSeconds % 60;


    if (hours > 0) {

      return `${hours}h ${minutes}m`;

    }


    if (minutes > 0) {

      return `${minutes}m ${remainingSeconds}s`;

    }


    return `${remainingSeconds}s`;

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(
    dateString
  ) {

    if (!dateString) {
      return "-";
    }


    const date =
      new Date(
        dateString
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "-";

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  }


  // =====================================================
  // FORMAT TIME
  // =====================================================

  function formatTime(
    dateString
  ) {

    if (!dateString) {
      return "-";
    }


    const date =
      new Date(
        dateString
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "-";

    }


    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  }


  // =====================================================
  // DASHBOARD VALUES
  // =====================================================

  const activityTime =
    dashboardStats?.activityTime ??
    dashboardStats?.activityTimeSeconds ??
    dashboardStats?.totalActivityTime ??
    0;


  const sleepTime =
    dashboardStats?.sleep ??
    dashboardStats?.sleepSeconds ??
    dashboardStats?.totalSleepTime ??
    0;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#0f1117]
        text-white
        px-6
        py-8
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
          "
        >

          Good afternoon, Kalai 👋

        </h1>


        <p
          className="
            text-gray-400
            mt-2
            text-lg
          "
        >

          Here's your productivity overview for today.

        </p>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-5
            py-4
            text-red-400
          "
        >

          {error}

        </div>

      )}


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
          mb-8
        "
      >

        {/* ACTIVITY TIME */}

        <div
          className="
            bg-[#181b24]
            border
            border-gray-800
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              "
            >

              <ActivityIcon
                size={21}
                className="text-blue-400"
              />

            </div>


            <p className="text-gray-400">

              Activity Time

            </p>

          </div>


          <h2
            className="
              text-3xl
              font-bold
              mt-5
            "
          >

            {loading
              ? "..."
              : formatDuration(
                  activityTime
                )}

          </h2>

        </div>


        {/* SLEEP */}

        <div
          className="
            bg-[#181b24]
            border
            border-gray-800
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-purple-500/10
                flex
                items-center
                justify-center
              "
            >

              <Moon
                size={21}
                className="text-purple-400"
              />

            </div>


            <p className="text-gray-400">

              Sleep

            </p>

          </div>


          <h2
            className="
              text-3xl
              font-bold
              mt-5
            "
          >

            {loading
              ? "..."
              : formatDuration(
                  sleepTime
                )}

          </h2>

        </div>

      </div>


      {/* =================================================
          CURRENT ACTIVITY
      ================================================= */}

      <div
        className="
          bg-[#181b24]
          border
          border-gray-800
          rounded-2xl
          p-6
          mb-10
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-6
          "
        >

          <div>

            <p
              className="
                text-gray-400
                text-sm
              "
            >

              Current Activity

            </p>


            <h2
              className="
                text-xl
                font-semibold
                mt-2
              "
            >

              No activity selected

            </h2>


            <button
              type="button"
              className="
                mt-5
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-white
                text-black
                font-medium
                hover:bg-gray-200
                transition
              "
              onClick={() => {
                window.location.href =
                  "/activity";
              }}
            >

              <Play size={18} />

              Start Activity

            </button>

          </div>


          <div className="text-right">

            <p
              className="
                text-5xl
                font-mono
                font-bold
              "
            >

              00:00:00

            </p>


            <p
              className="
                text-gray-500
                mt-2
              "
            >

              Timer controlled from Activity page

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          TIMER HISTORY
      ================================================= */}

      <div>

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-4
            mb-5
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-semibold
              "
            >

              Timer History

            </h2>


            <p
              className="
                text-gray-400
                mt-1
              "
            >

              Review your study sessions and focused time.

            </p>

          </div>


          <div
            className="
              px-4
              py-2
              rounded-xl
              bg-[#181b24]
              border
              border-gray-800
              text-gray-300
            "
          >

            Sessions: {timerHistory.length}

          </div>

        </div>


        {/* HISTORY ERROR */}

        {historyError && (

          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              px-5
              py-4
              text-red-400
            "
          >

            {historyError}

          </div>

        )}


        {/* LOADING */}

        {historyLoading ? (

          <div
            className="
              bg-[#181b24]
              border
              border-gray-800
              rounded-2xl
              p-8
              text-center
            "
          >

            <p className="text-gray-400">

              Loading timer history...

            </p>

          </div>

        ) : timerHistory.length === 0 ? (

          /* NO HISTORY */

          <div
            className="
              bg-[#181b24]
              border
              border-gray-800
              rounded-2xl
              p-10
              text-center
            "
          >

            <div
              className="
                w-14
                h-14
                mx-auto
                rounded-2xl
                bg-indigo-500/10
                flex
                items-center
                justify-center
              "
            >

              <Clock3
                size={26}
                className="text-indigo-400"
              />

            </div>


            <h3
              className="
                text-lg
                font-semibold
                mt-5
              "
            >

              No timer sessions yet

            </h3>


            <p
              className="
                text-gray-500
                mt-2
              "
            >

              Start an activity to create your first study session.

            </p>

          </div>

        ) : (

          /* HISTORY LIST */

          <div className="space-y-4">

            {timerHistory.map(
              (session) => {

                const activity =
                  session.activity || {};


                const activityName =
                  activity.name ||
                  "Unknown Activity";


                const category =
                  activity.category ||
                  "General";


                const classification =
                  activity.classification ||
                  "Activity";


                // =================================================
                // DYNAMIC TOTAL TIME
                // =================================================

                const duration =
                  getCurrentDuration(
                    session
                  );


                // =================================================
                // WASTED TIME
                // =================================================

                const wasted =
                  Math.min(
                    Math.max(
                      Number(
                        session.wastedSeconds ||
                        0
                      ),
                      0
                    ),
                    duration
                  );


                // =================================================
                // FOCUSED TIME
                // =================================================

                const focusedTime =
                  Math.max(
                    0,
                    duration - wasted
                  );


                const isRunning =
                  session.status ===
                  "RUNNING";


                const isPaused =
                  session.status ===
                  "PAUSED";


                const isCompleted =
                  session.status ===
                  "COMPLETED";


                const isActionLoading =
                  actionSessionId ===
                  session.id;


                return (

                  <div
                    key={session.id}
                    className="
                      bg-[#181b24]
                      border
                      border-gray-800
                      rounded-2xl
                      p-5
                      hover:border-gray-700
                      transition
                    "
                  >

                    {/* =================================================
                        TOP SECTION
                    ================================================= */}

                    <div
                      className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5
                      "
                    >

                      {/* LEFT */}

                      <div
                        className="
                          flex
                          items-start
                          gap-4
                        "
                      >

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-indigo-500/10
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >

                          <Clock3
                            size={22}
                            className="text-indigo-400"
                          />

                        </div>


                        <div>

                          <h3
                            className="
                              text-lg
                              font-semibold
                              text-white
                            "
                          >

                            {activityName}

                          </h3>


                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                              mt-2
                            "
                          >

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-gray-800
                                text-gray-300
                                text-xs
                              "
                            >

                              {category}

                            </span>


                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-gray-800
                                text-gray-300
                                text-xs
                              "
                            >

                              {classification}

                            </span>

                          </div>


                          <p
                            className="
                              text-gray-500
                              text-sm
                              mt-3
                            "
                          >

                            {formatDate(
                              session.startTime
                            )}

                            {" • "}

                            {formatTime(
                              session.startTime
                            )}

                          </p>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div
                        className="
                          flex
                          flex-col
                          items-start
                          md:items-end
                        "
                      >

                        {/* TIMER */}

                        <p
                          className="
                            text-2xl
                            font-bold
                            text-white
                          "
                        >

                          {formatDuration(
                            duration
                          )}

                        </p>


                        {/* STATUS */}

                        <span
                          className={`
                            inline-block
                            mt-2
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium

                            ${
                              isCompleted
                                ? "bg-green-500/10 text-green-400"
                                : isPaused
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-blue-500/10 text-blue-400"
                            }
                          `}
                        >

                          {session.status}

                        </span>


                        {/* =================================================
                            TIMER CONTROLS
                        ================================================= */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            mt-3
                          "
                        >

                          {/* RESUME */}

                          {isPaused && (

                            <button
                              type="button"
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                handleResumeSession(
                                  session.id
                                )
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                bg-green-500/10
                                border
                                border-green-500/30
                                text-green-400
                                hover:bg-green-500/20
                                disabled:opacity-50
                                transition
                              "
                            >

                              <Play
                                size={16}
                              />

                              {isActionLoading
                                ? "Resuming..."
                                : "Resume"}

                            </button>

                          )}


                          {/* PAUSE */}

                          {isRunning && (

                            <button
                              type="button"
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                handlePauseSession(
                                  session.id
                                )
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                bg-yellow-500/10
                                border
                                border-yellow-500/30
                                text-yellow-400
                                hover:bg-yellow-500/20
                                disabled:opacity-50
                                transition
                              "
                            >

                              <Pause
                                size={16}
                              />

                              {isActionLoading
                                ? "Pausing..."
                                : "Pause"}

                            </button>

                          )}


                          {/* STOP */}

                          {!isCompleted && (

                            <button
                              type="button"
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                handleStopSession(
                                  session.id
                                )
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                bg-orange-500/10
                                border
                                border-orange-500/30
                                text-orange-400
                                hover:bg-orange-500/20
                                disabled:opacity-50
                                transition
                              "
                            >

                              <Square
                                size={15}
                              />

                              {isActionLoading
                                ? "Stopping..."
                                : "Stop"}

                            </button>

                          )}


                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              isActionLoading
                            }
                            onClick={() =>
                              handleDeleteTimerSession(
                                session.id
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-2
                              px-4
                              py-2
                              rounded-lg
                              border
                              border-red-500/30
                              bg-red-500/10
                              text-red-400
                              hover:bg-red-500/20
                              hover:border-red-500/50
                              disabled:opacity-50
                              transition
                            "
                            title="Delete timer session"
                          >

                            <Trash2
                              size={16}
                            />

                            Delete

                          </button>

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        TIME SUMMARY
                    ================================================= */}

                    <div
                      className="
                        border-t
                        border-gray-800
                        mt-5
                        pt-5
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                      "
                    >

                      {/* TOTAL TIME */}

                      <div
                        className="
                          rounded-xl
                          bg-[#10131a]
                          border
                          border-gray-800
                          p-4
                        "
                      >

                        <p
                          className="
                            text-gray-500
                            text-sm
                          "
                        >

                          Total Time

                        </p>


                        <p
                          className="
                            text-white
                            text-xl
                            font-semibold
                            mt-2
                          "
                        >

                          {formatDuration(
                            duration
                          )}

                        </p>

                      </div>


                      {/* WASTED TIME */}

                      <div
                        className="
                          rounded-xl
                          bg-[#10131a]
                          border
                          border-gray-800
                          p-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-2
                          "
                        >

                          <p
                            className="
                              text-gray-500
                              text-sm
                            "
                          >

                            Wasted Time

                          </p>


                          {editingSessionId !==
                            session.id && (

                            <button
                              type="button"
                              onClick={() =>
                                startEditingWastedTime(
                                  session
                                )
                              }
                              className="
                                text-gray-400
                                hover:text-white
                                transition
                              "
                              title="Edit wasted time"
                            >

                              <Pencil
                                size={15}
                              />

                            </button>

                          )}

                        </div>


                        {editingSessionId ===
                        session.id ? (

                          <div
                            className="
                              mt-3
                              flex
                              flex-col
                              gap-2
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <input
                                type="number"
                                min="0"
                                max={duration}
                                value={
                                  wastedInput
                                }
                                onChange={(e) =>
                                  setWastedInput(
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  bg-[#181b24]
                                  border
                                  border-gray-700
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-white
                                  outline-none
                                  focus:border-indigo-500
                                "
                                placeholder="Seconds"
                              />


                              <span
                                className="
                                  text-gray-500
                                  text-sm
                                "
                              >

                                sec

                              </span>

                            </div>


                            <div
                              className="
                                flex
                                gap-2
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveWastedTime(
                                    session
                                  )
                                }
                                disabled={
                                  savingWastedId ===
                                  session.id
                                }
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-3
                                  py-2
                                  rounded-lg
                                  bg-indigo-500
                                  text-white
                                  text-sm
                                  hover:bg-indigo-600
                                  disabled:opacity-50
                                "
                              >

                                <Save
                                  size={14}
                                />

                                {savingWastedId ===
                                session.id
                                  ? "Saving..."
                                  : "Save"}

                              </button>


                              <button
                                type="button"
                                onClick={
                                  cancelEditingWastedTime
                                }
                                className="
                                  px-3
                                  py-2
                                  rounded-lg
                                  bg-gray-800
                                  text-gray-300
                                  text-sm
                                  hover:bg-gray-700
                                "
                              >

                                Cancel

                              </button>

                            </div>

                          </div>

                        ) : (

                          <p
                            className="
                              text-yellow-400
                              text-xl
                              font-semibold
                              mt-2
                            "
                          >

                            {formatDuration(
                              wasted
                            )}

                          </p>

                        )}

                      </div>


                      {/* FOCUSED TIME */}

                      <div
                        className="
                          rounded-xl
                          bg-[#10131a]
                          border
                          border-gray-800
                          p-4
                        "
                      >

                        <p
                          className="
                            text-gray-500
                            text-sm
                          "
                        >

                          Focused Time

                        </p>


                        <p
                          className="
                            text-green-400
                            text-xl
                            font-semibold
                            mt-2
                          "
                        >

                          {formatDuration(
                            focusedTime
                          )}

                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        SESSION DETAILS
                    ================================================= */}

                    <div
                      className="
                        border-t
                        border-gray-800
                        mt-5
                        pt-4
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                        text-sm
                      "
                    >

                      {/* STARTED */}

                      <div>

                        <p className="text-gray-500">

                          Started

                        </p>


                        <p
                          className="
                            text-gray-300
                            mt-1
                          "
                        >

                          {formatTime(
                            session.startTime
                          )}

                        </p>

                      </div>


                      {/* ENDED */}

                      <div>

                        <p className="text-gray-500">

                          Ended

                        </p>


                        <p
                          className="
                            text-gray-300
                            mt-1
                          "
                        >

                          {session.endTime
                            ? formatTime(
                                session.endTime
                              )
                            : "-"}

                        </p>

                      </div>


                      {/* STATUS */}

                      <div>

                        <p className="text-gray-500">

                          Status

                        </p>


                        <p
                          className="
                            text-gray-300
                            mt-1
                          "
                        >

                          {session.status ||
                            "-"}

                        </p>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}


export default Dashboard;