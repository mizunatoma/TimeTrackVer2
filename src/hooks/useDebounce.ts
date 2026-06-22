import { useEffect, useState } from 'react'

// value が変化しても、delay(ミリ秒)経つまで待ってから反映するフック。
export function useDebounce<T>(value: T, delay: number): T {
  // 実際に外へ返す「遅延後の値」。初期値は受け取った value そのもの。
  const [debounce, setDebounce] = useState(value)

  useEffect(() => {
    // JS関数 setTimeout(実行処理, 待つ時間)
    const timerId = setTimeout(() => {
      setDebounce(value)
    }, delay)

    // クリーンアップ関数 clearTimeout()
    // value が変わって次の useEffect が動く直前に呼ばれ、
    // まだ発火していない前回の予約をキャンセルする。
    // → 入力が続く限り予約が毎回リセットされ、止まった時だけ生き残る。
    return () => clearTimeout(timerId)
  }, [value, delay])

  return debounce
}
