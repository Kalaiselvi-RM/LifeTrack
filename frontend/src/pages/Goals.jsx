import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Target,
  CalendarDays,
  Clock3,
} from "lucide-react";

import {
  getGoals,
  createGoal,
  deleteGoal,
} from "../services/api";

function Goals() {
  const [goals, setGoals] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Study");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD GOALS
  // =====================================================

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGoals();

      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load goals:", err);

      setError(
        err?.message || "Failed to load goals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // =====================================================
  // CREATE GOAL
  // =====================================================

  const handleCreateGoal = async () => {
    if (!title.trim()) {
      setError("Please enter a goal title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!targetHours || Number(targetHours) <= 0) {
      setError("Please enter valid target hours.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const goal = {
        title: title.trim(),
        description: description.trim(),
        targetHours: Number(targetHours),
        deadline,
        category,
      };

      await createGoal(goal);

      // Clear form
      setTitle("");
      setDescription("");
      setTargetHours("");
      setDeadline("");
      setCategory("Study");

      // Reload
      await loadGoals();

    } catch (err) {
      console.error("Failed to create goal:", err);

      setError(
        err?.message || "Failed to create goal"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE GOAL
  // =====================================================

  const handleDeleteGoal = async (id) => {
    try {
      setError("");

      await deleteGoal(id);

      setGoals((currentGoals) =>
        currentGoals.filter(
          (goal) => goal.id !== id
        )
      );

    } catch (err) {
      console.error("Failed to delete goal:", err);

      setError(
        err?.message || "Failed to delete goal"
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) {
      return "No deadline";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          <Target
            size={28}
            className="text-indigo-400"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Goals
          </h1>

          <p className="text-gray-400 mt-1">
            Set and track your personal goals.
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
      {/* CREATE GOAL */}
      {/* ================================================= */}

      <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-6">

        {/* Card Header */}

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-xl bg-gray-800">
            <Plus size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Create Goal
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Define a goal and set a target deadline.
            </p>
          </div>

        </div>

        {/* FORM */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          {/* TITLE */}

          <div>
            <label className="text-sm text-gray-400">
              Goal Title
            </label>

            <input
              type="text"
              placeholder="Example: DSA Preparation"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateGoal();
                }
              }}
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* TARGET HOURS */}

          <div>
            <label className="text-sm text-gray-400">
              Target Hours
            </label>

            <div className="relative mt-2">

              <Clock3
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="number"
                min="1"
                placeholder="20"
                value={targetHours}
                onChange={(e) =>
                  setTargetHours(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400 transition"
              />

            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm text-gray-400">
              Description
            </label>

            <textarea
              rows="3"
              placeholder="Describe what you want to achieve..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400 resize-none focus:border-gray-400 transition"
            />
          </div>

          {/* DEADLINE */}

          <div>
            <label className="text-sm text-gray-400">
              Deadline
            </label>

            <div className="relative mt-2">

              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="date"
                value={deadline}
                onChange={(e) =>
                  setDeadline(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400 transition"
              />

            </div>
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

          {/* CREATE BUTTON */}

          <div className="flex items-end">

            <button
              onClick={handleCreateGoal}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl px-5 py-3 font-medium hover:bg-gray-200 disabled:opacity-40 transition"
            >
              <Plus size={18} />

              {saving
                ? "Creating..."
                : "Create Goal"}
            </button>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* GOALS HEADER */}
      {/* ================================================= */}

      <div className="mt-8 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Your Goals
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Track your progress and stay focused.
          </p>
        </div>

        <div className="bg-[#181b24] border border-gray-800 rounded-xl px-4 py-2">

          <span className="text-sm text-gray-400">
            Goals:{" "}
          </span>

          <span className="font-semibold">
            {goals.length}
          </span>

        </div>

      </div>

      {/* ================================================= */}
      {/* GOALS */}
      {/* ================================================= */}

      {loading ? (

        <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-8 text-center">

          <p className="text-gray-400">
            Loading goals...
          </p>

        </div>

      ) : goals.length === 0 ? (

        <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-10 text-center">

          <Target
            size={42}
            className="mx-auto text-gray-600"
          />

          <p className="text-gray-400 mt-4">
            No goals found.
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Create your first goal above.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {goals.map((goal) => (

            <div
              key={goal.id}
              className="bg-[#181b24] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <Target
                      size={21}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-semibold">
                      {goal.title}
                    </h3>

                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs ${getCategoryStyle(
                        goal.category
                      )}`}
                    >
                      {goal.category || "Study"}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    handleDeleteGoal(goal.id)
                  }
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete goal"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              {/* DESCRIPTION */}

              <p className="text-gray-400 text-sm mt-5 leading-6">
                {goal.description}
              </p>

              {/* DETAILS */}

              <div className="grid grid-cols-2 gap-3 mt-5">

                {/* TARGET */}

                <div className="bg-[#0f1117] rounded-xl p-4">

                  <p className="text-xs text-gray-500">
                    Target
                  </p>

                  <p className="text-lg font-semibold mt-1">
                    {goal.targetHours || 0} hours
                  </p>

                </div>

                {/* DEADLINE */}

                <div className="bg-[#0f1117] rounded-xl p-4">

                  <p className="text-xs text-gray-500">
                    Deadline
                  </p>

                  <p className="text-lg font-semibold mt-1">
                    {formatDate(goal.deadline)}
                  </p>

                </div>

              </div>

              {/* PROGRESS */}

              <div className="mt-5">

                <div className="flex justify-between text-xs mb-2">

                  <span className="text-gray-500">
                    Progress
                  </span>

                  <span className="text-gray-400">
                    0%
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "0%" }}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Goals;