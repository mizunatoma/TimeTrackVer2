import {
  AlarmClock,
  BarChart2,
  CircleCheckBig,
  Flame,
  MessageCircle,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image' // 自動で最適化・遅延読み込み。 width と height が必須
import Link from 'next/link'
import GuestLogin from './_components/GuestLogin'

export const metadata: Metadata = {
  title: 'OneTrack | 資格学習のためのタイムトラッキング',
  description:
    '開始と終了を押すだけで学習時間を記録。合格までの積み上げを見える形にする、資格学習のためのタイムトラッカー。',
  openGraph: {
    title: 'OneTrack | 資格学習のためのタイムトラッキング',
    description:
      '開始と終了を押すだけで学習時間を記録。合格までの積み上げを見える形にする、資格学習のためのタイムトラッカー。',
    url: 'https://learning-track.com',
    siteName: 'OneTrack',
    images: [
      {
        url: 'https://learning-track.com/images/LP_dashboard.png',
        width: 1918,
        height: 941,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
}

const forPeople = [
  {
    icon: AlarmClock,
    iconColor: 'text-[#5A6745]',
    bgColor: 'bg-[#D7E5BB]',
    title: '仕事と両立で時間がない',
    context:
      '働きながらの資格勉強。限られた時間を、どこに使えているか把握したい。',
  },
  {
    icon: BarChart2,
    iconColor: 'text-[#173324]',
    bgColor: 'bg-[#C9EAD4]',
    title: '勉強量が見えない',
    context: '勉強したつもりでも、実際に何時間積めたのか分からず不安になる。',
  },
  {
    icon: Flame,
    iconColor: 'text-[#442427]',
    bgColor: 'bg-[#FFDADB]',
    title: '独学を続けたい',
    context:
      'ひとりの勉強は孤独。積み上げが見える仕組みを、続ける力に変えたい。',
  },
]

const supportFeatures = [
  {
    icon: Flame,
    iconColor: 'text-[#442427]',
    bgColor: 'bg-[#FFDADB]',
    title: 'ストリーク',
    context: '連続学習日数を表示。記録を絶やさないことがモチベーションに。',
    comingSoon: true,
  },
  {
    icon: MessageCircle,
    iconColor: 'text-[#173324]',
    bgColor: 'bg-[#C9EAD4]',
    title: 'LINE通知',
    context: '毎晩、その日の学習サマリがLINEに届く。振り返りが習慣になる。',
  },
  {
    icon: CircleCheckBig,
    iconColor: 'text-[#5A6745]',
    bgColor: 'bg-[#D7E5BB]',
    title: 'リスト別Todo',
    context: '科目ごとにやることを整理。次に解く問題集が明確に。',
  },
]

// スクショを実際の画面らしく見せる ブラウザ風フレーム
const BrowserFrame = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-xl border-4 border-white bg-white shadow-[0_24px_60px_rgba(23,51,36,0.3)] ring-1 ring-black/10">
    <div className="flex gap-1.5 border-b border-[#E2E6E4] bg-[#F0F3F1] px-4 py-2.5">
      <span className="size-2.5 rounded-full bg-[#CBD3CE]" />
      <span className="size-2.5 rounded-full bg-[#CBD3CE]" />
      <span className="size-2.5 rounded-full bg-[#CBD3CE]" />
    </div>
    <Image className="w-full" src={src} alt={alt} width={1918} height={1068} />
  </div>
)

export default function Home() {
  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-[#E0DCCE] bg-[#F2F0E9]/90 px-5 py-4 backdrop-blur md:px-12">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#3D5E4E]">
            OneTrack
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/signin"
              className="text-[#4B4B4B] transition-colors duration-300 hover:text-[#3D5E4E]"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#3D5E4E] px-7 py-3 text-white transition-all duration-300 hover:bg-[#2E4A3D]"
            >
              新規登録
            </Link>
          </div>
        </nav>
      </header>

      <main className="bg-white">
        {/* Hero */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-12 md:flex-row md:px-16 md:py-24">
          <div className="flex flex-1 flex-col gap-5">
            <h1 className="text-4xl font-bold leading-normal md:text-5xl">
              合格までの距離を、
              <br />
              <span className="text-[#5A8B7D]">時間で測る。</span>
            </h1>
            <p className="text-lg text-[#4B4B4B]">
              開始と終了を押すだけで学習時間を記録。合格までの積み上げを、見える形に。
            </p>
            <div className="mt-4 flex items-center gap-6">
              <Link
                href="/signup"
                className="rounded-full bg-[#3D5E4E] px-10 py-4 text-base text-white transition-all duration-300 hover:bg-[#2E4A3D]"
              >
                無料で始める
              </Link>
              <GuestLogin
                label={'ゲストで試す'}
                className={
                  'text-[#4B4B4B] underline underline-offset-4 transition-colors duration-300 hover:text-[#3D5E4E]'
                }
              />
            </div>
          </div>
          <div className="w-full flex-1 md:w-auto md:flex-[1.2]">
            <BrowserFrame
              src="/images/screenshot-timeline.png"
              alt="OneTrackの学習記録ダッシュボード"
            />
          </div>
        </section>

        {/* こんな方に */}
        <section className="border-y border-[#C6D8C0] bg-[#DCE8D7] px-6 py-16 md:px-16 md:py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">こんな方に</h2>
            <p className="text-[#4B4B4B]">
              OneTrack は「合格したい人」のための学習記録ツールです
            </p>
          </div>
          <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {forPeople.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-3 rounded-xl bg-white p-7 shadow-md"
              >
                <div
                  className={`inline-flex w-fit items-center rounded-xl p-3 ${item.bgColor}`}
                >
                  <item.icon className={item.iconColor} size={22} />
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-[#4B4B4B]">{item.context}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 主な機能 */}
        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:gap-24 md:px-16 md:py-24">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
            <div className="w-full md:flex-[1.2]">
              <BrowserFrame
                src="/images/screenshot-timeline.png"
                alt="学習時間トラッキング画面"
              />
            </div>
            <div className="md:flex-1">
              <p className="mb-3 font-mono text-sm font-bold tracking-[0.2em] text-[#3D5E4E]">
                01 — TRACK
              </p>
              <h2 className="mb-3 text-2xl font-semibold">
                学習時間トラッキング
              </h2>
              <p className="text-[#4B4B4B]">
                科目を選んでスタートを押すだけ。記録の手間を最小限に、学習の実態を残します。
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-16">
            <div className="w-full md:flex-[1.2]">
              <BrowserFrame
                src="/images/screenshot-analytics.png"
                alt="学習アナリティクスのグラフ"
              />
            </div>
            <div className="md:flex-1">
              <p className="mb-3 font-mono text-sm font-bold tracking-[0.2em] text-[#3D5E4E]">
                02 — ANALYZE
              </p>
              <h2 className="mb-3 text-2xl font-semibold">
                学習アナリティクス
              </h2>
              <p className="text-[#4B4B4B]">
                月次グラフで学習時間のクセを可視化。「やったつもり」と実績のギャップをなくします。
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
            <div className="flex w-full justify-center md:flex-[1.2]">
              {/* 試験日カウントダウンのモックUI */}
              <div className="w-full max-w-md rounded-2xl bg-[#3D5E4E] p-10 text-white shadow-[0_24px_60px_rgba(61,94,78,0.25)]">
                <p className="mb-2 font-mono text-xs tracking-[0.25em] text-white/70">
                  GOAL
                </p>
                <p className="mb-4 text-lg font-bold">応用情報技術者試験</p>
                <p className="font-mono text-4xl font-bold text-[#D8E8C2]">
                  あと 84<span className="text-base text-white/80"> 日</span>
                </p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[62%] rounded-full bg-[#D8E8C2]" />
                </div>
                <p className="mt-3 text-sm text-white/80">
                  今月の学習 37 / 60 時間
                </p>
              </div>
            </div>
            <div className="md:flex-1">
              <p className="mb-3 font-mono text-sm font-bold tracking-[0.2em] text-[#3D5E4E]">
                03 — GOAL
              </p>
              <h2 className="mb-3 flex flex-wrap items-center gap-3 text-2xl font-semibold">
                目標と試験日カウントダウン
                <span className="rounded-full bg-[#D8E8C2] px-3 py-1 text-xs font-bold text-[#3D5E4E]">
                  近日追加予定
                </span>
              </h2>
              <p className="text-[#4B4B4B]">
                資格名・試験日・月間目標時間を設定できるようになります。残り日数と進捗が、毎日の一歩を後押しします。
              </p>
            </div>
          </div>
        </section>

        {/* 続ける仕組み */}
        <section className="bg-[#5A8B7D] px-6 py-16 md:px-16 md:py-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            学習を続けるための仕組み
          </h2>
          <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {supportFeatures.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl bg-white p-6 shadow-lg"
              >
                <div
                  className={`inline-flex size-fit items-center rounded-xl p-3 ${item.bgColor}`}
                >
                  <item.icon className={item.iconColor} size={22} />
                </div>
                <div>
                  <h3 className="mb-1 flex items-center gap-2 font-bold">
                    {item.title}
                    {item.comingSoon && (
                      <span className="rounded-full bg-[#D8E8C2] px-2.5 py-0.5 text-[11px] font-bold text-[#3D5E4E]">
                        近日追加予定
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[#4B4B4B]">{item.context}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center bg-[#173324] px-6 py-16 text-center text-white md:py-24">
          <h2 className="mb-3 text-3xl font-bold">まずは、今日の1時間から。</h2>
          <p className="mb-9 text-white/80">
            合格までの積み上げは、最初の記録から始まります。
          </p>
          <GuestLogin
            label={'ゲストで試してみる'}
            className={
              'rounded-full bg-white px-10 py-4 text-base text-[#3D5E4E] transition-all duration-300 hover:bg-[#D8E8C2]'
            }
          />
        </section>
      </main>

      <footer className="flex flex-col gap-2 border-t border-[#E0DCCE] bg-[#F2F0E9] px-6 py-7 text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:px-12">
        <span>© 2026 OneTrack</span>
        <a
          href="https://github.com/mizunatoma/TimeTrackVer2"
          className="text-[#3D5E4E] hover:underline"
        >
          GitHub（ソースコード）
        </a>
      </footer>
    </>
  )
}
