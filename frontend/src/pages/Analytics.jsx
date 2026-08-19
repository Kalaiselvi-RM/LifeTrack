import { useEffect, useState } from "react";
import { getAnalytics } from "../services/api";

function formatDuration(seconds) {
  if (!seconds) return "0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-red-400">
        Unable to load analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Analytics
        </h1>

        <p className="text-gray-400 mt-1">
          View your productivity analytics and insights.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Focus */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Focus Time
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {formatDuration(analytics.totalFocusTimeSeconds)}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Total focused work
          </p>
        </div>

        {/* Activity */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Activity Time
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {formatDuration(analytics.totalActivityTimeSeconds)}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Total activity
          </p>
        </div>

        {/* Sessions */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Completed Sessions
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {analytics.completedSessions}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Finished sessions
          </p>
        </div>

        {/* Goals */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Completed Goals
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {analytics.completedGoals}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Achieved goals
          </p>
        </div>

      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Schedule */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-white">
            Schedule Overview
          </h2>

          <div className="mt-5 flex items-center justify-between">

            <div>
              <p className="text-gray-400">
                Planned Schedules
              </p>

              <p className="text-3xl font-bold text-white mt-1">
                {analytics.plannedSchedules}
              </p>
            </div>

            <div className="text-4xl">
              📅
            </div>

          </div>

        </div>

        {/* Sleep */}
        <div className="bg-[#191c24] border border-gray-800 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-white">
            Sleep Overview
          </h2>

          <div className="grid grid-cols-2 gap-6 mt-5">

            <div>
              <p className="text-gray-400 text-sm">
                Total Sleep
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                {formatDuration(
                  analytics.totalSleepMinutes * 60
                )}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Average Sleep
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                {formatDuration(
                  analytics.averageSleepMinutes * 60
                )}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Productivity Summary */}
      <div className="bg-[#191c24] border border-gray-800 rounded-xl p-6">

        <h2 className="text-xl font-semibold text-white">
          Productivity Summary
        </h2>

        <div className="mt-5 space-y-4">

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                Focus
              </span>

              <span className="text-gray-300">
                {formatDuration(
                  analytics.totalFocusTimeSeconds
                )}
              </span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min(
                    analytics.totalFocusTimeSeconds / 3600 * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                Activity
              </span>

              <span className="text-gray-300">
                {formatDuration(
                  analytics.totalActivityTimeSeconds
                )}
              </span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{
                  width: `${Math.min(
                    analytics.totalActivityTimeSeconds / 3600 * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;