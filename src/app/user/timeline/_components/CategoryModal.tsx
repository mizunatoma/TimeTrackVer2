'use client'
import { COLOR_OPTIONS } from '@/constants/colors'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  title: string
  placeholder?: string
  initialName?: string
  onSave: (name: string, color: string) => void
  onCancel: () => void
}

// スキーマ定義（型 + バリデーション一元化）
const CategorySchema = z.object({
  name: z.string().min(1, 'カテゴリー名を入力してください').max(20),
  color: z.string(),
})
// z.inferで型を自動抽出する  z.infer<typeof スキーマ名>
type Category = z.infer<typeof CategorySchema>

export default function CategoryModal({
  title,
  placeholder,
  initialName,
  onSave,
  onCancel,
}: Props) {
  const {
    register, // 4つのプロパティ(ref、name、onChange、onBlur)を持つオブジェクト。value, onCahnge不要に。
    handleSubmit, // バリデーション成功時のみ、送信処理を実行。
    formState: { errors }, // エラーメッセージを管理。エラーメッセージを表示する場所は <input> の直下が一般的。
    setValue, // divにregisterは使用できないため、setValueで値を代入。
    watch, // 入力内容をリアルタイムで監視し、値が変わるたびにコンポーネントを再レンダリングして表示を更新
  } = useForm<Category>({
    resolver: zodResolver(CategorySchema), // useForm に zodResolver を渡す => スキーマと型が同期される
    defaultValues: { name: initialName, color: '' }, // 「defaultValues」＝ 初期値の設定オプション
  })

  // watch対象を定義
  const selectedColor = watch('color')

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form onSubmit={handleSubmit((data) => onSave(data.name, data.color))}>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-6">
          <h2 className="text-lg font-bold text-gray-600">{title}</h2>

          <div>
            <input
              className="w-full rounded border border-gray-400 p-2"
              placeholder={placeholder}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/*色選択*/}
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => {
              return (
                <div
                  key={c}
                  className={`${c} size-6 rounded-full ${c === selectedColor ? 'border-2 border-gray-500' : ''}`}
                  onClick={() => {
                    setValue('color', c)
                  }}
                />
              )
            })}
          </div>

          {/*キャンセル・保存ボタン*/}
          <div className="flex w-full justify-between">
            <button
              className="rounded border border-gray-400 px-3"
              onClick={() => onCancel()}
            >
              キャンセル
            </button>
            <button
              className="rounded border bg-red-400 px-3 text-white"
              type="submit"
            >
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
