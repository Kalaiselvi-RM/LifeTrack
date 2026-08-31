import { useEffect, useState } from "react";
import {
  Moon,
  Trash2,
  Plus,
  Clock,
  CalendarDays,
} from "lucide-react";

import {
  getSleepRecords,
  createSleepRecord,
  deleteSleepRecord,
} from "../services/api";


// =====================================================
// GET TODAY'S DATE
// =====================================================

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// =====================================================
// COMPONENT
// =====================================================

function Sleep() {

  // ===================================================
  // SLEEP RECORDS
  // ===================================================

  const [sleepRecords, setSleepRecords] = useState([]);


  // ===================================================
  // FORM
  // ===================================================

  // Automatically select today's date
  const [date, setDate] = useState(getTodayDate());

  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  const [quality, setQuality] = useState("Good");


  // ===================================================
  // STATES
  // ===================================================

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // ===================================================
  // LOAD SLEEP RECORDS
  // ===================================================

  const loadSleepRecords = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getSleepRecords();

      setSleepRecords(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to load sleep records"
      );

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    loadSleepRecords();

  }, []);


  // ===================================================
  // CALCULATE SLEEP DURATION
  // ===================================================

  const calculateDuration = () => {

    if (!sleepTime || !wakeTime) {
      return 0;
    }

    const start = new Date(
      `2000-01-01T${sleepTime}`
    );

    let end = new Date(
      `2000-01-01T${wakeTime}`
    );


    // ================================================
    // IF WAKE TIME IS NEXT DAY
    // ================================================

    if (end <= start) {

      end.setDate(
        end.getDate() + 1
      );

    }


    return Math.round(
      (end - start) / 60000
    );
  };


  const durationMinutes =
    calculateDuration();


  // ===================================================
  // FORMAT DURATION
  // ===================================================

  const formatDuration = (minutes) => {

    if (!minutes) {
      return "0h 0m";
    }

    const hours =
      Math.floor(minutes / 60);

    const mins =
      minutes % 60;

    return `${hours}h ${mins}m`;
  };


  // ===================================================
  // SAVE SLEEP
  // ===================================================

  const handleSaveSleep = async () => {

    if (!date || !sleepTime || !wakeTime) {

      setError(
        "Please enter sleep time and wake time."
      );

      return;
    }


    if (durationMinutes <= 0) {

      setError(
        "Sleep duration must be greater than 0."
      );

      return;
    }


    try {

      setSaving(true);
      setError("");


      // ==============================================
      // SLEEP OBJECT
      // ==============================================

      const sleep = {

        date: date,

        sleepTime: sleepTime,

        wakeTime: wakeTime,

        quality: quality,

        durationMinutes:
          durationMinutes,
      };


      // ==============================================
      // SEND TO BACKEND
      // ==============================================

      await createSleepRecord(sleep);


      // ==============================================
      // RESET FORM
      // ==============================================

      setDate(getTodayDate());

      setSleepTime("");

      setWakeTime("");

      setQuality("Good");


      // ==============================================
      // REFRESH HISTORY
      // ==============================================

      await loadSleepRecords();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to save sleep record"
      );

    } finally {

      setSaving(false);

    }
  };


  // ===================================================
  // DELETE SLEEP
  // ===================================================

  const handleDelete = async (id) => {

    try {

      await deleteSleepRecord(id);

      setSleepRecords(
        (records) =>
          records.filter(
            (record) =>
              record.id !== id
          )
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to delete sleep record"
      );

    }
  };


  // ===================================================
  // GET RECORD DURATION
  // ===================================================

  const getRecordDuration = (record) => {

    if (
      record.durationMinutes !== null &&
      record.durationMinutes !== undefined
    ) {

      return formatDuration(
        record.durationMinutes
      );

    }


    if (record.durationSeconds) {

      return formatDuration(
        Math.floor(
          record.durationSeconds / 60
        )
      );

    }


    return "0h 0m";
  };


  // ===================================================
  // QUALITY STYLE
  // ===================================================

  const qualityStyle = (value) => {

    if (value === "Excellent") {

      return "bg-green-500/10 text-green-400 border-green-500/20";

    }

    if (value === "Good") {

      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    }

    if (value === "Average") {

      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-[#0f1117] text-white p-6 md:p-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center gap-4">

        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">

          <Moon
            size={28}
            className="text-indigo-400"
          />

        </div>


        <div>

          <h1 className="text-3xl font-bold">
            Sleep
          </h1>

          <p className="text-gray-400 mt-1">
            Track your sleep and improve your daily recovery.
          </p>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">

          {error}

        </div>

      )}


      {/* =================================================
          RECORD SLEEP
      ================================================= */}

      <div className="mt-8 bg-[#181b24] border border-gray-800 rounded-2xl p-6">


        {/* HEADER */}

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-xl bg-gray-800">

            <Plus size={20} />

          </div>


          <div>

            <h2 className="text-xl font-semibold">
              Record Sleep
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Enter when you slept and when you woke up.
            </p>

          </div>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">


          {/* =================================================
              DATE
          ================================================= */}

          <div>

            <label className="text-sm text-gray-400">
              Sleep Date
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

            <p className="text-xs text-gray-500 mt-2">
              Automatically set to today
            </p>

          </div>


          {/* =================================================
              SLEEP TIME
          ================================================= */}

          <div>

            <label className="text-sm text-gray-400">
              Sleep Time
            </label>

            <div className="relative mt-2">

              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="time"
                value={sleepTime}
                onChange={(e) =>
                  setSleepTime(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400"
              />

            </div>

          </div>


          {/* =================================================
              WAKE TIME
          ================================================= */}

          <div>

            <label className="text-sm text-gray-400">
              Wake Time
            </label>

            <div className="relative mt-2">

              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="time"
                value={wakeTime}
                onChange={(e) =>
                  setWakeTime(e.target.value)
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gray-400"
              />

            </div>

          </div>


          {/* =================================================
              QUALITY
          ================================================= */}

          <div>

            <label className="text-sm text-gray-400">
              Sleep Quality
            </label>

            <select
              value={quality}
              onChange={(e) =>
                setQuality(e.target.value)
              }
              className="w-full mt-2 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
            >

              <option value="Excellent">
                Excellent
              </option>

              <option value="Good">
                Good
              </option>

              <option value="Average">
                Average
              </option>

              <option value="Poor">
                Poor
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            DURATION PREVIEW
        ================================================= */}

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0f1117] border border-gray-800 rounded-xl p-5">


          <div>

            <p className="text-sm text-gray-400">
              Sleep Duration
            </p>

            <p className="text-3xl font-bold mt-1">
              {formatDuration(durationMinutes)}
            </p>

            {sleepTime && wakeTime && (

              <p className="text-xs text-gray-500 mt-2">
                {sleepTime} → {wakeTime}
              </p>

            )}

          </div>


          {/* SAVE */}

          <button
            onClick={handleSaveSleep}
            disabled={
              saving ||
              !date ||
              !sleepTime ||
              !wakeTime
            }
            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-40"
          >

            <Plus size={18} />

            {saving
              ? "Saving..."
              : "Save Sleep"}

          </button>

        </div>

      </div>


      {/* =================================================
          SLEEP HISTORY
      ================================================= */}

      <div className="mt-8">


        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Sleep History
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Review your previous sleep records.
            </p>

          </div>


          <div className="bg-[#181b24] border border-gray-800 rounded-xl px-4 py-2">

            <span className="text-sm text-gray-400">
              Records:{" "}
            </span>

            <span className="font-semibold">
              {sleepRecords.length}
            </span>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-8 text-center">

            <p className="text-gray-400">
              Loading sleep records...
            </p>

          </div>

        ) : sleepRecords.length === 0 ? (


          /* =================================================
             EMPTY
          ================================================= */

          <div className="mt-5 bg-[#181b24] border border-gray-800 rounded-2xl p-10 text-center">

            <Moon
              size={40}
              className="mx-auto text-gray-600"
            />

            <p className="text-gray-400 mt-4">
              No sleep records found.
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Record your first night's sleep above.
            </p>

          </div>


        ) : (


          /* =================================================
             RECORDS
          ================================================= */

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            {sleepRecords.map((record) => (

              <div
                key={record.id}
                className="bg-[#181b24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition"
              >


                {/* =================================================
                    TOP
                ================================================= */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="p-3 rounded-xl bg-indigo-500/10">

                      <Moon
                        size={20}
                        className="text-indigo-400"
                      />

                    </div>


                    <div>

                      <p className="font-semibold">
                        {record.date}
                      </p>

                      <p className="text-sm text-gray-500">
                        Sleep record
                      </p>

                    </div>

                  </div>


                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(record.id)
                    }
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete sleep record"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>


                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="grid grid-cols-3 gap-3 mt-5">


                  {/* SLEEP */}

                  <div className="bg-[#0f1117] rounded-xl p-3">

                    <p className="text-xs text-gray-500">
                      Sleep
                    </p>

                    <p className="font-medium mt-1">
                      {record.sleepTime || "--:--"}
                    </p>

                  </div>


                  {/* WAKE */}

                  <div className="bg-[#0f1117] rounded-xl p-3">

                    <p className="text-xs text-gray-500">
                      Wake
                    </p>

                    <p className="font-medium mt-1">
                      {record.wakeTime || "--:--"}
                    </p>

                  </div>


                  {/* DURATION */}

                  <div className="bg-[#0f1117] rounded-xl p-3">

                    <p className="text-xs text-gray-500">
                      Duration
                    </p>

                    <p className="font-medium mt-1">
                      {getRecordDuration(record)}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    QUALITY
                ================================================= */}

                <div className="mt-4">

                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs ${qualityStyle(
                      record.quality
                    )}`}
                  >
                    {record.quality || "Good"}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Sleep;