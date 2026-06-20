'use client'
import { useState } from 'react'
import CurrentCategoryWidget from './_components/CurrentCategoryWidget'
import CategoriesListWidget from './_components/CategoriesListWidget'
import TimelineWidget from './_components/TimelineWidget'

export default function Page() {
  // 同じカテゴリーを連続でSTARTできるよう count を持たせる（値が変わると useEffect が再発火する）
  const [selected, setSelected] = useState({ id: '', count: 0 })
  const [timelineKey, setTimelineKey] = useState({ count: 0 })

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <TimelineWidget timelineKey={timelineKey} />
        <div className="flex flex-col gap-6">
          <CurrentCategoryWidget
            currentCategoryID={selected}
            onPressStopButton={setTimelineKey}
          />
          <CategoriesListWidget onSelectCategory={setSelected} />
        </div>
      </div>
    </div>
  )
}
