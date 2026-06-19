'use client'
import { useUserStore } from '@/store/userStore'
import { useEffect, useState } from 'react'
import TodoPanel from './_components/TodoPanel'
import UserHeader from './_components/UserHeader'
import UserSidebar from './_components/UserSidebar'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const [isTodoPanelOpen, setIsTodoPanelOpen] = useState(false)
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
        isCollapsed={isCollapsed}
        isTodoPanelOpen={isTodoPanelOpen}
      />
      <UserSidebar
        isCollapsed={isCollapsed}
        toggleTodoPanel={toggleTodoPanel}
        isTodoPanelOpen={isTodoPanelOpen}
      />
      <TodoPanel isTodoPanelOpen={isTodoPanelOpen} isCollapsed={isCollapsed} />

      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-[80px]' : 'ml-[160px]'
        } p-4 pt-20`}
      >
        {children}
      </div>
    </>
  )
}
