import {
  LayoutDashboard,
  Activity,
  Target,
  CalendarDays,
  BarChart3,
  Moon,
} from "lucide-react"

import { NavLink } from "react-router-dom"

function Sidebar() {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: Activity,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: CalendarDays,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Sleep",
      path: "/sleep",
      icon: Moon,
    },
  ]

  return (
    <aside className="w-64 min-h-screen bg-[#151820] border-r border-gray-800 p-5">

      <div className="mb-10">

        <h1 className="text-2xl font-bold">
          LifeTrack
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Productivity Tracker
        </p>

      </div>

      <nav className="space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#20232d] text-white"
                    : "text-gray-400 hover:bg-[#20232d] hover:text-white"
                }`
              }
            >

              <Icon size={20} />

              <span>
                {item.name}
              </span>

            </NavLink>
          )
        })}

      </nav>

    </aside>
  )
}

export default Sidebar