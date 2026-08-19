import { useEffect, useState } from "react";

import {
  Play,
  Clock3,
  Moon,
  Activity as ActivityIcon,
  Trash2,
} from "lucide-react";

import {
  getDashboardStats,
  getTimerSessions,
  deleteTimerSession,
} from "../services/api";


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


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadDashboard();

    loadTimerHistory();

  }, []);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  async function loadDashboard() {

    try {

      setLoading(true);

      setError("");

      const data = await getDashboardStats();

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

      const data = await getTimerSessions();

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

  async function handleDeleteTimerSession(sessionId) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this timer session?"
    );

    if (!confirmed) {

      return;

    }

    try {

      await deleteTimerSession(sessionId);

      // Remove deleted session from UI
      setTimerHistory((previous) =>
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
  // FORMAT DURATION
  // =====================================================

  function formatDuration(seconds) {

    const totalSeconds =
      Number(seconds || 0);

    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
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

  function formatDate(dateString) {

    if (!dateString) {

      return "-";

    }

    const date =
      new Date(dateString);

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

  function formatTime(dateString) {

    if (!dateString) {

      return "-";

    }

    const date =
      new Date(dateString);

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
  // GET DASHBOARD VALUES SAFELY
  // =====================================================

  const focusTime =
    dashboardStats?.focusTime ??
    dashboardStats?.focusTimeSeconds ??
    dashboardStats?.totalFocusTime ??
    0;


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

    <div className="min-h-screen bg-[#0f1117] text-white px-6 py-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold tracking-tight">

          Good afternoon, Kalai 👋

        </h1>

        <p className="text-gray-400 mt-2 text-lg">

          Here's your productivity overview for today.

        </p>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="
          mb-6
          rounded-xl
          border
          border-red-500/30
          bg-red-500/10
          px-5
          py-4
          text-red-400
        ">

          {error}

        </div>

      )}


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
        mb-8
      ">


        {/* FOCUS TIME */}

        <div className="
          bg-[#181b24]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-indigo-500/10
              flex
              items-center
              justify-center
            ">

              <Clock3
                size={21}
                className="text-indigo-400"
              />

            </div>

            <p className="text-gray-400">

              Focus Time

            </p>

          </div>

          <h2 className="
            text-3xl
            font-bold
            mt-5
          ">

            {loading
              ? "..."
              : formatDuration(focusTime)
            }

          </h2>

        </div>


        {/* ACTIVITY TIME */}

        <div className="
          bg-[#181b24]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-blue-500/10
              flex
              items-center
              justify-center
            ">

              <ActivityIcon
                size={21}
                className="text-blue-400"
              />

            </div>

            <p className="text-gray-400">

              Activity Time

            </p>

          </div>

          <h2 className="
            text-3xl
            font-bold
            mt-5
          ">

            {loading
              ? "..."
              : formatDuration(activityTime)
            }

          </h2>

        </div>


        {/* SLEEP */}

        <div className="
          bg-[#181b24]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-purple-500/10
              flex
              items-center
              justify-center
            ">

              <Moon
                size={21}
                className="text-purple-400"
              />

            </div>

            <p className="text-gray-400">

              Sleep

            </p>

          </div>

          <h2 className="
            text-3xl
            font-bold
            mt-5
          ">

            {loading
              ? "..."
              : formatDuration(sleepTime)
            }

          </h2>

        </div>

      </div>


      {/* =================================================
          CURRENT ACTIVITY
      ================================================= */}

      <div className="
        bg-[#181b24]
        border
        border-gray-800
        rounded-2xl
        p-6
        mb-10
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          items-start
          md:items-center
          justify-between
          gap-6
        ">


          <div>

            <p className="text-gray-400 text-sm">

              Current Activity

            </p>

            <h2 className="
              text-xl
              font-semibold
              mt-2
            ">

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

            <p className="
              text-5xl
              font-mono
              font-bold
            ">

              00:00:00

            </p>

            <p className="
              text-gray-500
              mt-2
            ">

              Timer not started

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          TIMER HISTORY
      ================================================= */}

      <div>


        {/* HISTORY HEADER */}

        <div className="
          flex
          flex-col
          sm:flex-row
          items-start
          sm:items-center
          justify-between
          gap-4
          mb-5
        ">

          <div>

            <h2 className="
              text-2xl
              font-semibold
            ">

              Timer History

            </h2>

            <p className="
              text-gray-400
              mt-1
            ">

              Review your previous focus sessions.

            </p>

          </div>


          <div className="
            px-4
            py-2
            rounded-xl
            bg-[#181b24]
            border
            border-gray-800
            text-gray-300
          ">

            Sessions: {timerHistory.length}

          </div>

        </div>


        {/* HISTORY ERROR */}

        {historyError && (

          <div className="
            mb-5
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-5
            py-4
            text-red-400
          ">

            {historyError}

          </div>

        )}


        {/* LOADING */}

        {historyLoading ? (

          <div className="
            bg-[#181b24]
            border
            border-gray-800
            rounded-2xl
            p-8
            text-center
          ">

            <p className="text-gray-400">

              Loading timer history...

            </p>

          </div>

        ) : timerHistory.length === 0 ? (

          /* NO HISTORY */

          <div className="
            bg-[#181b24]
            border
            border-gray-800
            rounded-2xl
            p-10
            text-center
          ">

            <div className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-indigo-500/10
              flex
              items-center
              justify-center
            ">

              <Clock3
                size={26}
                className="text-indigo-400"
              />

            </div>

            <h3 className="
              text-lg
              font-semibold
              mt-5
            ">

              No timer sessions yet

            </h3>

            <p className="
              text-gray-500
              mt-2
            ">

              Start an activity to create your
              first focus session.

            </p>

          </div>

        ) : (

          /* HISTORY LIST */

          <div className="space-y-4">

            {timerHistory.map((session) => {

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


              const duration =
                Number(
                  session.durationSeconds || 0
                );


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

                  <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-5
                  ">


                    {/* LEFT */}

                    <div className="
                      flex
                      items-start
                      gap-4
                    ">

                      <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-indigo-500/10
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">

                        <Clock3
                          size={22}
                          className="text-indigo-400"
                        />

                      </div>


                      <div>

                        <h3 className="
                          text-lg
                          font-semibold
                          text-white
                        ">

                          {activityName}

                        </h3>


                        <div className="
                          flex
                          flex-wrap
                          gap-2
                          mt-2
                        ">

                          <span className="
                            px-3
                            py-1
                            rounded-full
                            bg-gray-800
                            text-gray-300
                            text-xs
                          ">

                            {category}

                          </span>


                          <span className="
                            px-3
                            py-1
                            rounded-full
                            bg-gray-800
                            text-gray-300
                            text-xs
                          ">

                            {classification}

                          </span>

                        </div>


                        <p className="
                          text-gray-500
                          text-sm
                          mt-3
                        ">

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

                    <div className="
                      flex
                      flex-col
                      items-start
                      md:items-end
                    ">

                      <p className="
                        text-2xl
                        font-bold
                        text-white
                      ">

                        {formatDuration(duration)}

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
                            session.status ===
                            "COMPLETED"

                              ? "bg-green-500/10 text-green-400"

                              : session.status ===
                                "PAUSED"

                              ? "bg-yellow-500/10 text-yellow-400"

                              : "bg-blue-500/10 text-blue-400"
                          }
                        `}
                      >

                        {session.status ||
                          "UNKNOWN"}

                      </span>


                      {/* =================================================
                          DELETE BUTTON
                      ================================================= */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTimerSession(
                            session.id
                          )
                        }
                        className="
                          mt-3
                          flex
                          items-center
                          justify-center
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
                          transition
                        "
                        title="Delete timer session"
                      >

                        <Trash2 size={16} />

                        Delete

                      </button>

                    </div>

                  </div>


                  {/* =================================================
                      SESSION DETAILS
                  ================================================= */}

                  <div className="
                    border-t
                    border-gray-800
                    mt-5
                    pt-4
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    text-sm
                  ">


                    {/* STARTED */}

                    <div>

                      <p className="text-gray-500">

                        Started

                      </p>

                      <p className="
                        text-gray-300
                        mt-1
                      ">

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

                      <p className="
                        text-gray-300
                        mt-1
                      ">

                        {session.endTime
                          ? formatTime(
                              session.endTime
                            )
                          : "-"
                        }

                      </p>

                    </div>


                    {/* DURATION */}

                    <div>

                      <p className="text-gray-500">

                        Duration

                      </p>

                      <p className="
                        text-gray-300
                        mt-1
                      ">

                        {formatDuration(
                          duration
                        )}

                      </p>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );

}


export default Dashboard;