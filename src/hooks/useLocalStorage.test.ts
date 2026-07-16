import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  // 各テスト後にlocalStorageを空にする（テスト間で値が残らないように）
  afterEach(() => localStorage.clear())

  it('setで保存すると、値とlocalStorageの両方が更新される', () => {
    const { result } = renderHook(() =>
      useLocalStorage('isTodoPanelOpen', false),
    )

    expect(result.current[0]).toBe(false) // 初期値

    act(() => {
      result.current[1](true) // トグルをON
    })

    expect(result.current[0]).toBe(true) // useStateの値を確認
    expect(localStorage.getItem('isTodoPanelOpen')).toBe(JSON.stringify(true)) // localStorageの値も確認
  })

  it('既に保存された値があれば、マウント時にその値で復元される', () => {
    // 1. 前回保存された状態を復元（先にlocalStorageへ書き込む）
    localStorage.setItem('isTodoPanelOpen', JSON.stringify(true))

    // 2. その状態でフックをマウント（＝ページを開きなおす）初期にはfalse
    const { result } = renderHook(() =>
      useLocalStorage('isTodoPanelOpen', false),
    )

    // 3. 初期値 false ではなく、保存済みの true が復元されるべき
    expect(result.current[0]).toBe(true)
  })
})
