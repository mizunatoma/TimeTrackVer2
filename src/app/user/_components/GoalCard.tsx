'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalResponse } from '@/types/api'

type Props = {
  goalData: GoalResponse
}

export default function GoalCard({ goalData }: Props) {
  const examDateDisplay = goalData?.goal?.examDate.split('T')[0]
  const getExamDateMessage = () => {
    if (goalData?.restDays == undefined) {
      //↑  nullとundefinedの両方に一致する 緩等 (==)
      return `settingsページから試験日を設定できます`
    } else if (goalData?.restDays >= 0) {
      return `試験日まで あと ${goalData?.restDays} 日`
    } else {
      return `試験日から ${goalData?.restDays} 日経過`
    }
  }
  const getStreakMessage = () => {
    if (goalData?.streak === 0) {
      return `今日から始める？`
    } else {
      return `継続 ${goalData?.streak} 日`
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <CardTitle>学習目標</CardTitle>
        </div>
      </CardHeader>

      <Card>
        <CardContent>{goalData?.goal?.qualificationName}</CardContent>
        <CardContent>試験日 {examDateDisplay}</CardContent>
        <CardContent>
          月間目標 {goalData?.goal?.targetStudyTime} 時間
        </CardContent>
        <CardContent>{getExamDateMessage()}</CardContent>
        <Card>
          <CardContent>{getStreakMessage()}</CardContent>
        </Card>
      </Card>
    </div>
  )
}
