import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock3,
  CalendarCheck,
} from "lucide-react";

import {
  getSchedules,
  createSchedule,
  deleteSchedule,
} from "../services/api";

function Schedule() {
  const [schedules, setSchedules] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("Study");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD SCHEDULES
  // =====================================================

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSchedules();

      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load schedules:", err);

      setError(
        err?.message || "Failed to load schedules"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // =====================================================
  // CREATE SCHEDULE
  // =====================================================

  const handleCreateSchedule = async () => {
    if (!title.trim()) {
      setError("Please enter a schedule title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!startTime) {
      setError("Please select a start time.");
      return;
    }

    if (!endTime) {
      setError("Please select an end time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const schedule = {
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime,
        category,
      };

      await createSchedule(schedule);

      // Clear form
      setTitle("");
      setDescription("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setCategory("Study");

      await loadSchedules();

    } catch (err) {
      console.error("Failed to create schedule:", err);

      setError(
        err?.message || "Failed to create schedule"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE SCHEDULE
  // =====================================================

  const handleDeleteSchedule = async (id) => {
    try {
      setError("");

      await deleteSchedule(id);

      setSchedules((currentSchedules) =>
        currentSchedules.filter(
          (schedule) => schedule.id !== id
        )
      );

    } catch (err) {
      console.error("Failed to delete schedule:", err);

      setError(
        err?.message || "Failed to delete schedule"
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) {
      return "No date";
    }

    const dateObject = new Date(value);

    if (Number.isNaN(dateObject.getTime())) {
      return value;
    }

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (value) => {
    if (!value) {
      return "--:--";
    }

    // Backend may return "18:00:00"
    const parts = String(value).split(":");

    if (parts.length < 2) {
      return value;
    }

    const hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours)) {
      return value;
    }

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour =
      hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${minutes} ${suffix}`;
  };

  // =====================================================
  // CATEGORY STYLE
  // =====================================================

  const getCategoryStyle = (value) => {
    switch (value) {
      case "Study":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "Development":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "Health":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "Personal":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "Entertainment":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6 md:p-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center gap-4">

        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <CalendarCheck
            size={28}
            className="text-indigo-400"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Schedule
          </h1>

          <p className="text-gray-400 mt-1">
            Plan your activities and manage your time.
          </p>
        </div>

      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* CREATE SCHEDULE */}
      {/* ================================================= */}

      <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-6">

        {/* CARD HEADER */}

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-xl bg-gray-800">
            <Plus size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Add Schedule
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Plan your activities for a specific time.
            </p>
          </div>

        </div>

        {/* FORM */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          {/* TITLE */}

          <div>
            <label className="text-sm text-gray-400">
              Schedule Title
            </label>

            <input
              type="text"
              placeholder="Example: DSA Practice"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="text-sm text-gray-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
            >
              <option value="Study">
                Study
              </option>

              <option value="Development">
                Development
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Personal">
                Personal
              </option>

              <option value="Entertainment">
                Entertainment
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div className="md:col-span-2">

            <label className="text-sm text-gray-400">
              Description
            </label>

            <textarea
              rows="3"
              placeholder="Describe what you plan to do..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none resize-none focus:border-gray-400 transition"
            />

          </div>

          {/* DATE */}

          <div>

            <label className="text-sm text-gray-400">
              Date
            </label>

            <div className="relative mt-2">

              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400"
              />

            </div>

          </div>

          {/* START TIME */}

          <div>

            <label className="text-sm text-gray-400">
              Start Time
            </label>

            <div className="relative mt-2">

              <Clock3
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400"
              />

            </div>

          </div>

          {/* END TIME */}

          <div>

            <label className="text-sm text-gray-400">
              End Time
            </label>

            <div className="relative mt-2">

              <Clock3
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400"
              />

            </div>

          </div>

          {/* CREATE */}

          <div className="flex items-end">

            <button
              onClick={handleCreateSchedule}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl px-5 py-3 font-medium hover:bg-gray-200 disabled:opacity-40 transition"
            >

              <Plus size={18} />

              {saving
                ? "Adding..."
                : "Add Schedule"}

            </button>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SCHEDULE HEADER */}
      {/* ================================================= */}

      <div className="mt-8 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Your Schedule
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Upcoming activities and planned sessions.
          </p>

        </div>

        <div className="bg-[#181b24] border border-gray-800 rounded-xl px-4 py-2">

          <span className="text-sm text-gray-400">
            Schedules:{" "}
          </span>

          <span className="font-semibold">
            {schedules.length}
          </span>

        </div>

      </div>

      {/* ================================================= */}
      {/* SCHEDULE LIST */}
      {/* ================================================= */}

      {loading ? (

        <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-8 text-center">

          <p className="text-gray-400">
            Loading schedules...
          </p>

        </div>

      ) : schedules.length === 0 ? (

        <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-10 text-center">

          <CalendarCheck
            size={42}
            className="mx-auto text-gray-600"
          />

          <p className="text-gray-400 mt-4">
            No schedules found.
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Add your first schedule above.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {schedules.map((schedule) => (

            <div
              key={schedule.id}
              className="bg-[#181b24] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <CalendarCheck
                      size={21}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-semibold">
                      {schedule.title}
                    </h3>

                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs ${getCategoryStyle(
                        schedule.category
                      )}`}
                    >
                      {schedule.category || "Study"}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    handleDeleteSchedule(
                      schedule.id
                    )
                  }
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete schedule"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              {/* DESCRIPTION */}

              <p className="text-gray-400 text-sm mt-5 leading-6">
                {schedule.description}
              </p>

              {/* DATE */}

              <div className="mt-5 bg-[#0f1117] rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    size={19}
                    className="text-indigo-400"
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="font-medium mt-1">
                      {formatDate(schedule.date)}
                    </p>

                  </div>

                </div>

              </div>

              {/* TIME */}

              <div className="mt-3 bg-[#0f1117] rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <Clock3
                    size={19}
                    className="text-indigo-400"
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      Time
                    </p>

                    <p className="font-medium mt-1">

                      {formatTime(
                        schedule.startTime
                      )}

                      <span className="text-gray-600 mx-2">
                        →
                      </span>

                      {formatTime(
                        schedule.endTime
                      )}

                    </p>

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs text-gray-500">
                  Status
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                  {schedule.status || "PLANNED"}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Schedule;