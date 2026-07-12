// SWR共通化hook
import useSWR, { SWRConfiguration } from 'swr'

// nullを渡したときは、fetchをスキップ
export function useFetch<T>(
  endpoint: string | null,
  options?: SWRConfiguration,
) {
  // urlを受け取り、型はジェネリクスで約束する。エラーハンドリングも明示
  const fetcher = async (url: string): Promise<T> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('データ取得に失敗しました')
    return (await res.json()) as T
  }

  // useSWRにendpoint、fetcherを渡す
  return useSWR<T>(endpoint, fetcher, options)
}
