export const COLOR_OPTIONS = [
  'bg-rose-400/60',
  'bg-teal-400/60',
  'bg-indigo-400/60',
  'bg-amber-400/60',
  'bg-sky-400/60',
  'bg-green-400/60',
  'bg-purple-400/60',
  'bg-pink-400/60',
] as const

// HEX変換テーブル
export const COLOR_MAP: Record<string, string> = {
  'bg-rose-400/60': '#fb7185',
  'bg-teal-400/60': '#2dd4bf',
  'bg-indigo-400/60': '#818cf8',
  'bg-amber-400/60': '#fbbf24',
  'bg-sky-400/60': '#38bdf8',
  'bg-green-400/60': '#4ade80',
  'bg-purple-400/60': '#c084fc',
  'bg-pink-400/60': '#f472b6',
}
