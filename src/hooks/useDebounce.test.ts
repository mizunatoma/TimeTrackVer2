import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  // 各テストの前後で「時計の付け替え」をする
  beforeEach(() => vi.useFakeTimers()) // 偽物の時計に
  afterEach(() => vi.useRealTimers()) // 本物に戻す（他テストへの影響を防ぐ）

  it('delay経過まで古い値のまま、経過後に新しい値になる', () => {
    // 1. 'a' で試験台に載せる
    const { result, rerender } = renderHook(
      (props) => useDebounce(props.value, 500),
      { initialProps: { value: 'a' } },
    )
    expect(result.current).toBe('a') // 最初は 'a'

    // 2. rerender で入力値を'b'に変える
    rerender({ value: 'b' })
    expect(result.current).toBe('a') // 値変更直後はまだ 'a'

    // 3. 時計を500ms早送り
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('b')

    // renderHook(fn, opts)	fn をReactコンポーネント内で実行する。hookをテストするための入口
    //   hookはコンポーネント内でしか呼べないため、テストではこれ経由で実行する。
    // result.current	hookの最新の戻り値が入るプロパティ
    // rerender(props)	新しいpropsで再実行。引数の変化を再現する
    // act(cb)	state更新を含む処理を囲み、更新と再レンダーの完了を待つ
  })

  it('delay未満で値を変え続けるとタイマーがリセットされ、反映されない', () => {
    // 1. 初期値 'a' を与える
    const { result, rerender } = renderHook(
      (props) => useDebounce(props.value, 500),
      { initialProps: { value: 'a' } },
    )

    // 2. 'b' に変えて 300ms 進める (500ms未満なのでまだ発火しない)
    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('a')

    // 3. 300ms 経過時点で 'c' に変える →  ここで前回のタイマーがリセットされる
    rerender({ value: 'c' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('a')

    // 4. 'c' にしてからさたに 200ｍｓ 経過 (合計500ｍｓ)
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('c')
  })
})
