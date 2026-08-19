const API_BASE_URL = "http://localhost:8080/api";


// =====================================================
// ACTIVITIES
// =====================================================

export async function getActivities() {
  const response = await fetch(
    `${API_BASE_URL}/activities`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  return response.json();
}


export async function createActivity(activity) {
  const response = await fetch(
    `${API_BASE_URL}/activities`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(activity),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create activity");
  }

  return response.json();
}


export async function deleteActivity(id) {
  const response = await fetch(
    `${API_BASE_URL}/activities/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete activity");
  }

  // 204 = No Content
  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  return text
    ? JSON.parse(text)
    : true;
}


// =====================================================
// DASHBOARD
// =====================================================

export async function getDashboardStats() {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/today`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch dashboard stats"
    );
  }

  return response.json();
}


// =====================================================
// ANALYTICS
// =====================================================

export async function getAnalytics() {
  const response = await fetch(
    `${API_BASE_URL}/analytics`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch analytics"
    );
  }

  return response.json();
}


// =====================================================
// GOALS
// =====================================================

export async function getGoals() {
  const response = await fetch(
    `${API_BASE_URL}/goals`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch goals"
    );
  }

  return response.json();
}


export async function createGoal(goal) {
  const response = await fetch(
    `${API_BASE_URL}/goals`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(goal),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create goal"
    );
  }

  return response.json();
}


export async function deleteGoal(id) {
  const response = await fetch(
    `${API_BASE_URL}/goals/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete goal"
    );
  }

  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  return text
    ? JSON.parse(text)
    : true;
}


// =====================================================
// SCHEDULE
// =====================================================

export async function getSchedules() {
  const response = await fetch(
    `${API_BASE_URL}/schedules`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch schedules"
    );
  }

  return response.json();
}


export async function createSchedule(schedule) {
  const response = await fetch(
    `${API_BASE_URL}/schedules`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(schedule),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create schedule"
    );
  }

  return response.json();
}


export async function deleteSchedule(id) {
  const response = await fetch(
    `${API_BASE_URL}/schedules/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete schedule"
    );
  }

  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  return text
    ? JSON.parse(text)
    : true;
}


// =====================================================
// SLEEP
// =====================================================

export async function getSleepRecords() {
  const response = await fetch(
    `${API_BASE_URL}/sleep`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch sleep records"
    );
  }

  return response.json();
}


export async function createSleepRecord(sleep) {
  const response = await fetch(
    `${API_BASE_URL}/sleep`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(sleep),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create sleep record"
    );
  }

  return response.json();
}


export async function deleteSleepRecord(id) {
  const response = await fetch(
    `${API_BASE_URL}/sleep/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete sleep record"
    );
  }

  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  return text
    ? JSON.parse(text)
    : true;
}


// =====================================================
// TIMER SESSIONS
// =====================================================


// -----------------------------------------------------
// START TIMER
// -----------------------------------------------------

export async function startTimerSession(activityId) {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions/start/${activityId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to start timer session"
    );
  }

  return response.json();
}


// -----------------------------------------------------
// PAUSE TIMER
// -----------------------------------------------------

export async function pauseTimerSession(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions/${sessionId}/pause`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to pause timer session"
    );
  }

  return response.json();
}


// -----------------------------------------------------
// RESUME TIMER
// -----------------------------------------------------

export async function resumeTimerSession(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions/${sessionId}/resume`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to resume timer session"
    );
  }

  return response.json();
}


// -----------------------------------------------------
// STOP TIMER
// -----------------------------------------------------

export async function stopTimerSession(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions/${sessionId}/stop`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to stop timer session"
    );
  }

  return response.json();
}


// =====================================================
// TIMER HISTORY
// =====================================================


// -----------------------------------------------------
// GET ALL TIMER SESSIONS
// -----------------------------------------------------

export async function getTimerSessions() {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch timer history"
    );
  }

  return response.json();
}


// -----------------------------------------------------
// DELETE TIMER SESSION
// -----------------------------------------------------

export async function deleteTimerSession(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/timer-sessions/${sessionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete timer session"
    );
  }

  // Backend returns 204 No Content
  if (response.status === 204) {
    return true;
  }

  // If backend returns JSON/text
  const text = await response.text();

  return text
    ? JSON.parse(text)
    : true;
}