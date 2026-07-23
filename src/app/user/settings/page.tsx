import { GoalNameSetting } from './_components/GoalSetting'
import { LineRegistration } from './_components/LineRegistration'
import { ProfileNameSetting } from './_components/ProfileNameSetting'

export default function Page() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ProfileNameSetting />
      <GoalNameSetting />
      <LineRegistration />
    </div>
  )
}
