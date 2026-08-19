import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Activity from "./pages/Activity"
import Goals from "./pages/Goals"
import Schedule from "./pages/Schedule"
import Sleep from "./pages/Sleep"
import Analytics from "./pages/Analytics";


import { ActivityProvider } from "./context/ActivityContext"

function App() {
  return (
    <ActivityProvider>

      <BrowserRouter>

        <div className="flex min-h-screen bg-[#0f1117]">

          <Sidebar />

          <main className="flex-1">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/activity"
                element={<Activity />}
              />
              <Route path="/goals" element={<Goals />} />
              <Route
  path="/schedule"
  element={<Schedule />}
/>
              <Route
                path="/sleep"
                element={<Sleep />}
              />
              <Route
  path="/analytics"
  element={<Analytics />}
/>

            </Routes>

          </main>

        </div>

      </BrowserRouter>

    </ActivityProvider>
  )
}

export default App