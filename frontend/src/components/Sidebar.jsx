import {
  LayoutDashboard,
  Activity,
  Target,
  CalendarDays,
  BarChart3,
  Moon,
  Menu,
  X,
} from "lucide-react"

import { NavLink } from "react-router-dom"
import { useState } from "react"

function Sidebar() {

  const [isOpen, setIsOpen] = useState(false)

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
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
          ===================================================== */}

      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed
          top-4
          left-4
          z-50
          md:hidden
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-xl
          bg-[#20232d]
          border
          border-gray-700
          text-white
          shadow-lg
        "
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>


      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            md:hidden
          "
        />
      )}


      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`
          fixed
          md:sticky
          top-0
          left-0
          z-50
          md:z-auto

          w-64
          min-h-screen

          bg-[#151820]
          border-r
          border-gray-800

          p-5

          transform
          transition-transform
          duration-300
          ease-in-out

          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* =====================================================
            HEADER
            ===================================================== */}

        <div className="mb-10">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-2xl font-bold text-white">
                LifeTrack
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                Productivity Tracker
              </p>

            </div>


            {/* Mobile Close Button */}

            <button
              onClick={() => setIsOpen(false)}
              className="
                md:hidden
                flex
                items-center
                justify-center
                w-9
                h-9
                rounded-lg
                text-gray-400
                hover:text-white
                hover:bg-[#20232d]
                transition
              "
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

          </div>

        </div>


        {/* =====================================================
            NAVIGATION
            ===================================================== */}

        <nav className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}

                onClick={() => setIsOpen(false)}

                className={({ isActive }) =>
                  `
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition

                  ${
                    isActive
                      ? "bg-[#20232d] text-white"
                      : "text-gray-400 hover:bg-[#20232d] hover:text-white"
                  }
                  `
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
    </>
  )
}

export default Sidebar