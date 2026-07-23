'use client'
import { Card, CardContent } from '@/components/ui/card'
import { GoalResponse } from '@/types/api'
import { Settings } from 'lucide-react'

type Props = {
  goalData: GoalResponse
}

export default function GoalCard({ goalData }: Props) {
  const examDateDisplay = goalData.goal?.examDate.split('T')[0]

  const getExamDateMessage = () => {
    if (goalData.restDays == undefined) {
      //↑  nullとundefinedの両方に一致する 緩等 (==)
      return null
    } else if (goalData.restDays >= 0) {
      return (
        <div className="text-left">
          <p className="mt-1 text-xs text-gray-400">試験日まで</p>
          <p className="text-4xl font-bold text-[#3D5E4E] sm:text-5xl">
            <span className="ml-1 text-lg font-normal text-[#3D5E4E]/70">
              あと
            </span>
            {' ' + goalData.restDays}
            <span className="ml-1 text-lg font-normal text-[#3D5E4E]/70">
              日
            </span>
          </p>
        </div>
      )
    } else {
      return (
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-500">試験終了</p>
          <p className="mt-1 text-xs text-gray-400">
            試験日から{-goalData.restDays}日経過
          </p>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 px-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        {goalData.goal ? (
          <div>
            <p className="text-xs text-gray-400">現在の学習目標</p>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {goalData.goal.qualificationName}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              試験日 {examDateDisplay}　月間目標 {goalData.goal.targetStudyTime}
              時間
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400">現在の学習目標</p>

            <p className="mt-4 text-lg font-bold text-gray-900">
              学習目標を設定しよう
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
              ← 設定は <Settings size={14} /> アイコンから
            </p>
            <p className="mt-1 text-sm text-gray-500">
              「試験日カウントダウン」「月間達成率」 が確認できるようになります
            </p>
          </div>
        )}

        <div className="flex items-center gap-16 px-8">
          {getExamDateMessage()}

          <div className="rounded-2xl bg-[#F1EAD9] px-5 py-3 text-center">
            <p className="text-xs text-gray-500">継続</p>
            <p className="text-xl font-bold text-[#3D5E4E]">
              {goalData.streak ?? 0}日
            </p>
            {goalData.streak === 0 && (
              <p className="mt-1 text-[11px] text-gray-500">
                ５分から始めてみよう🔥
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
