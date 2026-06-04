'use client'

import {
  BarChart2,
  CircleCheckBig,
  Layers,
  Sparkles,
  TimerReset,
} from 'lucide-react'
import Image from 'next/image' // 自動で最適化・遅延読み込み。 width と height が必須
import Link from 'next/link'

const forPeople = [
  {
    icon: TimerReset,
    iconColor: 'text-[#5A6745]',
    bgColor: 'bg-[#D7E5BB]',
    title: 'Time Loss',
    context:
      '複数のタスクを抱え、何にどれだけ時間を使っているか把握できていない',
  },
  {
    icon: Sparkles,
    iconColor: 'text-[#173324]',
    bgColor: 'bg-[#C9EAD4]',
    title: 'Lack of Focus',
    context:
      '資格試験の勉強やスキルアップのために、学習時間をきっちり管理したい',
  },
  {
    icon: Layers,
    iconColor: 'text-[#442427]',
    bgColor: 'bg-[#FFDADB]',
    title: 'Overwhelmed',
    context: '日々の活動を視覚化して、整理したい。',
  },
]

const keyFeatures = [
  {
    num: '01',
    title: 'シンプルなタイムトラッキング',
    context: '直感的な操作で、作業の開始から終了まで迷わず記録。',
  },
  {
    num: '02',
    title: '月次アナリティクス',
    context:
      '時間の使い方のクセを可視化。振り返りを通じて、より良い習慣作りをサポートします。',
  },
  {
    num: '03',
    title: 'リスト別 Todo管理',
    context:
      'プロジェクトごとにタスクを整理。次に何をすべきかを明確にし、脳のメモリを開放します。',
  },
]

export default function Home() {
  return (
    <>
      {/* ヘッダー */}
      <header className="border border-b-4 border-white px-8 py-6">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="text-2xl">OneTrack</div>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-full border border-gray-400 px-4 py-2 transition-all duration-300 hover:border-white hover:bg-[#5A8B7D]/50 hover:text-white md:px-8 md:py-4"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#5A8B7D] px-4 py-2 text-white transition-all duration-300 hover:bg-[#5A8B7D]/50 md:px-8 md:py-4"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* メイン */}
        <section className="py-16">
          <div className="flex flex-col items-center gap-4 px-6 py-8 md:flex-row md:px-16">
            <div className="flex flex-[2] flex-col gap-4 p-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold md:text-5xl">
                  シンプルな
                  <br />
                  タイムトラッキング
                </h1>
                <p>複雑な設定は不要。時間を可視化し、一日を振り返る。</p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/signup"
                  className="rounded-full bg-[#5A8B7D] px-6 py-4 text-white transition-all duration-300 hover:bg-[#5A8B7D]/50"
                >
                  今すぐ使う
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-gray-400 px-8 py-4 transition-all duration-300 hover:border-white hover:bg-[#5A8B7D]/50 hover:text-white"
                >
                  ゲストログイン
                </Link>
              </div>
            </div>
            <div className="flex-[3]">
              <Image
                className="w-[700px] rounded-2xl border-8 border-white"
                src="/images/LP_dashboard.png"
                alt="dashboard"
                width={600} // 実際の表示サイズは classNameで制御される
                height={400}
              />
            </div>
          </div>
        </section>

        {/* こんな方に */}
        <section className="flex w-full flex-col gap-2 border-y-4 border-white bg-[#F4F4EF] py-16">
          <h1 className="flex justify-center text-2xl underline underline-offset-8">
            こんな方に
          </h1>
          <ul className="m-4 flex flex-col gap-4 md:flex-row">
            {forPeople.map((item) => (
              <li
                key={item.title}
                className="flex flex-1 flex-col gap-2 rounded-md bg-white p-6"
              >
                <div
                  className={`inline-flex w-fit items-center rounded-md border p-2 ${item.bgColor}`}
                >
                  <item.icon
                    className={`${item.iconColor} rounded-md`}
                    size={20}
                  />
                </div>
                <h2 className="font-bold">{item.title}</h2>
                <p>{item.context}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 主な機能 */}
        <section className="flex w-full flex-col gap-8 px-6 py-16 md:flex-row md:px-16">
          <div className="m-4 flex items-center gap-4 md:flex-1">
            <div className="flex flex-1 flex-col gap-4">
              <Image
                className="w-full rounded-lg object-cover"
                src="/images/LP_chart.png"
                alt="chart"
                width={600}
                height={400}
              />
              <div className="flex items-center justify-center rounded-lg bg-[#3D5E4E] p-8">
                <BarChart2 size={48} className="text-white" />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-center rounded-2xl bg-[#D8E8C2] p-8">
                <CircleCheckBig size={48} className="text-[#3D5E4E]" />
              </div>
              <Image
                className="w-full rounded-lg"
                src="/images/LP_task_planning.png"
                alt="task_planning"
                width={600}
                height={400}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8 md:flex-1">
            <h1 className="text-4xl font-semibold">主な機能</h1>
            <ul className="flex flex-col gap-4">
              {keyFeatures.map((item) => (
                <li key={item.title} className="m-4 flex gap-4">
                  <h2 className="font-mono text-4xl font-bold text-[#476553]/30">
                    {item.num}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p>{item.context}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container mx-auto mb-16 flex w-full max-w-4xl flex-col items-center justify-center p-8">
          <Link
            href="/login"
            className="rounded-full bg-[#5A8B7D] px-6 py-4 text-white transition-all duration-300 hover:bg-[#5A8B7D]/50"
          >
            ゲストログインで 試してみる
          </Link>
        </section>
      </main>
    </>
  )
}
