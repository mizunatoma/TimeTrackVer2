'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useUserStore } from '@/store/userStore'
import { useEffect } from 'react'
import TodoPanel from './_components/TodoPanel'
import UserHeader from './_components/UserHeader'
import UserSidebar from './_components/UserSidebar'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useLocalStorage(
    'isSideBarOpen',
    true,
  )
  const toggleSidebar = () => setIsSideBarOpen(!isSideBarOpen)

  const [isTodoPanelOpen, setIsTodoPanelOpen] = useLocalStorage(
    'isTodoPanelOpen',
    false,
  )
  const toggleTodoPanel = () => setIsTodoPanelOpen(!isTodoPanelOpen)

  const setUser = useUserStore((state) => state.setUser)
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/profile')
      const data = await res.json()
      setUser(data.profile)
    }
    fetchUser()
  }, [])

  return (
    <>
      <UserHeader
        toggleSidebar={toggleSidebar}
        isSideBarOpen={isSideBarOpen}
        isTodoPanelOpen={isTodoPanelOpen}
      />
      <UserSidebar
        isSideBarOpen={isSideBarOpen}
        toggleTodoPanel={toggleTodoPanel}
        isTodoPanelOpen={isTodoPanelOpen}
      />
      <TodoPanel
        isTodoPanelOpen={isTodoPanelOpen}
        isSideBarOpen={isSideBarOpen}
      />

      <div
        className={`transition-all duration-300 ${
          isSideBarOpen ? 'ml-[160px]' : 'ml-[80px]'
        } p-4 pt-20`}
      >
        {children}
      </div>
    </>
  )
}
