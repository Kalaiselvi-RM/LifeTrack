import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  getActivities,
  createActivity,
  deleteActivity as deleteActivityApi,
} from "../services/api"

const ActivityContext = createContext()

export function ActivityProvider({ children }) {

  const [activities, setActivities] = useState([])

  const [activeActivity, setActiveActivity] =
    useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)


  // Load activities from backend
  useEffect(() => {

    async function loadActivities() {

      try {

        setLoading(true)

        const data = await getActivities()

        setActivities(data)

      } catch (error) {

        console.error(error)

        setError("Unable to load activities")

      } finally {

        setLoading(false)

      }

    }

    loadActivities()

  }, [])


  // Create activity
  const addActivity = async (
    name,
    category
  ) => {

    const newActivity = {

      name: name,

      category: category,

      classification: "Focus",

    }

    try {

      const savedActivity =
        await createActivity(newActivity)

      setActivities((prev) => [
        ...prev,
        savedActivity,
      ])

      return savedActivity

    } catch (error) {

      console.error(error)

      setError("Unable to create activity")

      throw error

    }
  }


  // Delete activity
  const deleteActivity = async (id) => {

    try {

      await deleteActivityApi(id)

      setActivities((prev) =>
        prev.filter(
          (activity) =>
            activity.id !== id
        )
      )

      if (
        activeActivity?.id === id
      ) {

        setActiveActivity(null)

      }

    } catch (error) {

      console.error(error)

      setError(
        "Unable to delete activity"
      )

    }
  }


  return (
    <ActivityContext.Provider
      value={{
        activities,

        loading,

        error,

        addActivity,

        deleteActivity,

        activeActivity,

        setActiveActivity,
      }}
    >

      {children}

    </ActivityContext.Provider>
  )
}


export function useActivities() {

  return useContext(
    ActivityContext
  )

}