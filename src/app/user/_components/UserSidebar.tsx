'use client'
import {
  BarChart2,
  ClipboardList,
  LucideIcon,
  Settings,
  Timer,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { href: '/user/timeline', icon: Timer, label: 'Timeline' },
  { href: '/user/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/user/settings', icon: Settings, label: 'Settings' },
]

interface SidebarLinkProps {
  isCollapsed: boolean
  href: string
  icon: LucideIcon
  label: string
  isSelected: boolean
}

interface SidebarProps {
  isCollapsed: boolean
  toggleTodoPanel: () => void
  isTodoPanelOpen: boolean
}

// リンク部分を共通化
function SidebarLink({
  href,
  icon,
  label,
  isSelected,
  isCollapsed,
}: SidebarLinkProps) {
  const Icon = icon
  return (
    <Link
      href={href}
      className={`flex h-12 items-center gap-3 rounded-xl transition-all ${isCollapsed ? 'justify-center' : 'px-3'} ${
        isSelected
          ? 'bg-[#5D866C]/50 text-gray-800 shadow-sm'
          : 'text-gray-500 hover:bg-[#5D866C]/30'
      }`}
    >
      <div
        className={`flex size-7 items-center justify-center rounded-xl ${
          isSelected ? 'bg-white/50' : 'bg-transparent'
        }`}
      >
        <Icon size={16} />
      </div>
      {!isCollapsed && <span className="text">{label}</span>}
    </Link>
  )
}

export default function UserSidebar({
  isCollapsed,
  toggleTodoPanel,
  isTodoPanelOpen,
}: SidebarProps) {
  const pathname = usePathname()
  const isSelected = (href: string) => pathname === href

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 overflow-hidden border-r border-[#EFEDE6] bg-[#FCFAF7] px-2 py-3 ${isCollapsed ? 'w-[80px]' : 'w-[160px]'}`}
    >
      <nav className="flex flex-col gap-1">
        {MENU_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            {...item}
            isSelected={isSelected(item.href)}
            isCollapsed={isCollapsed}
          />
        ))}

        <button
          onClick={toggleTodoPanel}
          className={`flex h-12 items-center gap-3 rounded-xl transition-all ${isCollapsed ? 'justify-center' : 'px-3'} ${
            isTodoPanelOpen
              ? 'bg-[#5D866C]/50 text-gray-800 shadow-sm'
              : 'text-gray-500 hover:bg-[#5D866C]/30'
          }`}
        >
          <div
            className={`flex size-7 items-center justify-center rounded-xl ${
              isTodoPanelOpen ? 'bg-white/50' : 'bg-transparent'
            }`}
          >
            <ClipboardList size={16} />
          </div>
          {!isCollapsed && <span className="text">Todos</span>}
        </button>
      </nav>
    </aside>
  )
}
