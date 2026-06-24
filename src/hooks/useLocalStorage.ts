import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    // 既に localStorage に値が入っていたら取り出す
    const saved = localStorage.getItem(key)
    if (saved) JSON.parse(saved) as T
  }, [key])

  const set = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, set] as const
}
