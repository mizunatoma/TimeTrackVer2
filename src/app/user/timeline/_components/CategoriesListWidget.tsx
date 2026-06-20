'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CreateCategoryRequest } from '@/schemas/category'
import type { CategoriesResponse, CategoryDTO } from '@/types/api'
import { SquarePen, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import CategoryModal from './CategoryModal'

type Props = {
  onSelectCategory: Dispatch<SetStateAction<{ id: string; count: number }>>
}

export default function CategoriesListWidget({ onSelectCategory }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(
    null,
  )

  const { data, isLoading, mutate, isValidating } =
    useFetch<CategoriesResponse>('/api/timeline/categories')

  // categoryの追加
  const handleAddSave = async (name: string, color: string) => {
    try {
      const res = await fetch('/api/timeline/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          colorToken: color,
        } as CreateCategoryRequest),
      })
      if (!res.ok) {
        console.error('category追加失敗', await res.json())
        return
      }
      mutate()
      setIsOpen(false)
    } catch (e) {
      console.error('category追加エラー：', e)
    }
  }

  // categoryの編集
  const handleEditSave = async (name: string, color: string) => {
    try {
      const res = await fetch(
        `/api/timeline/categories/${editingCategory!.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            colorToken: color,
          }),
        },
      )
      if (!res.ok) {
        console.error('category編集失敗', await res.json())
        return
      }
      mutate()
      setEditingCategory(null)
    } catch (e) {
      console.error('category編集エラー：', e)
    }
  }

  // categoryの削除
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/timeline/categories/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        console.error('category削除失敗', await res.json())
        return
      }

      mutate()
    } catch (e) {
      console.error('category削除エラー：', e)
    }
  }

  return (
    <Card>
      {/* ヘッダー部分 */}
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardAction>
          <Button
            size="sm"
            className="rounded-full bg-red-100 text-red-800 hover:bg-red-200"
            onClick={() => setIsOpen(true)}
          >
            追加
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {!isLoading ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-2">
            {data?.categories?.map((category) => (
              <div
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                key={category.id}
                onClick={() =>
                  onSelectCategory((s) => ({
                    id: category.id,
                    count: s.count + 1,
                  }))
                }
              >
                {' '}
                {/* 兄弟のCurrentCategoryWidgetへ渡す */}
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-3 shrink-0 rounded-full ${category.colorToken}`}
                    ></div>
                    <span className="text-sm font-bold text-gray-600">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation() // 親のonClickを止める
                        setEditingCategory(category)
                      }}
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      className="text-red-400"
                      onClick={(e) => {
                        e.stopPropagation() // 親のonClickを止める
                        handleDelete(category.id)
                      }}
                      disabled={isValidating}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>読み込み中...</p>
        )}

        {/* category追加モーダル*/}
        {isOpen && (
          <CategoryModal
            title="New Category"
            placeholder="Category's name"
            onSave={handleAddSave}
            onCancel={() => {
              setIsOpen(false)
            }}
          />
        )}

        {/* category編集モーダル*/}
        {editingCategory && (
          <CategoryModal
            title="Category"
            initialName={editingCategory.name}
            onSave={handleEditSave}
            onCancel={() => {
              setEditingCategory(null)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
