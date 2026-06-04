'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserHeaderProps {
  toggleSidebar: () => void // ＝引数なし、戻り値なしの関数
  isCollapsed: boolean
  isTodoPanelOpen: boolean
}

export default function UserHeader({
  toggleSidebar,
  isCollapsed,
  isTodoPanelOpen,
}: UserHeaderProps) {
  const router = useRouter()

  // ４段階のヘッダー幅調整
  const mainWidth = isCollapsed ? 80 : 160
  const subWidth = isTodoPanelOpen ? 300 : 0 // サブサイドバーの幅（300px）
  const totalLeft = mainWidth + subWidth // 80, 160, 380, 460 のいずれかになる

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.replace('/')
  }

  return (
    <header
      className="fixed right-0 top-0 z-30 flex items-center justify-between border-b border-[#EFEDE6] bg-white px-6 py-4 transition-all duration-300"
      style={{ left: `${totalLeft}px` }}
    >
      {/*左：ハンバーガーメニュー＋ロゴ*/}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex size-8 items-center justify-center rounded-lg bg-[#5D866C]/30 text-gray-700 transition-colors hover:bg-[#5D866C]/60"
        >
          ☰
        </button>
        <span className="text-lg font-bold text-gray-800">One Track</span>
      </div>

      {/*右：ユーザアイコン*/}

      <div className="flex items-center gap-4">
        <Link href="/contact" className="text-sm text-gray-600 hover:underline">
          お問い合わせ
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:underline"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
