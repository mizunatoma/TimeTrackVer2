'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import type {
  CreateTodoItemRequest,
  CreateTodoListRequest,
  UpdateTodoItemRequest,
} from '@/schemas/todo'
import type { GetTodoItemsResponse, GetTodoListsResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, SquarePen, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface TodoPanelProps {
  isCollapsed: boolean
  isTodoPanelOpen: boolean
}

export default function TodoPanel({
  isCollapsed,
  isTodoPanelOpen,
}: TodoPanelProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null) // 開いているlist
  const [isOpen, setIsOpen] = useState(false) // List追加ブロックの開閉

  const [editingId, setEditingId] = useState<string | null>(null) // 編集中のtodo id
  const [editingTitle, setEditingTitle] = useState('') // 編集中のtodo title

  const {
    data: list,
    mutate: mutateList,
    isValidating: isValidatingList,
  } = useFetch<GetTodoListsResponse>('/api/todo-lists')
  const {
    data: todos,
    mutate: mutateTodo,
    isValidating: isValidatingTodo,
  } = useFetch<GetTodoItemsResponse>(
    selectedListId ? `/api/todo-lists/${selectedListId}/todos` : null,
  )

  // 1.スキーマ定義（型 + バリデーション一元化）Zod スキーマは「このフォームでユーザーが入力するもの」だけを定義
  // 2.useForm に zodResolver を渡す
  const ListSchema = z.object({
    name: z.string().trim().min(1, 'リスト名を入力してください'),
  })
  type ListInput = z.infer<typeof ListSchema>
  const {
    register: registerList,
    handleSubmit: handleSubmitList,
    formState: { errors: errorsList },
  } = useForm<ListInput>({ resolver: zodResolver(ListSchema) })

  const TodoSchema = z.object({
    title: z.string().trim().min(1, 'todoを入力してください'),
  })
  type TodoInput = z.infer<typeof TodoSchema>
  const {
    register: registerTodo,
    handleSubmit: handleSubmitTodo,
    formState: { errors: errorsTodo },
    reset: resetTodo,
  } = useForm<TodoInput>({ resolver: zodResolver(TodoSchema) })

  // listの追加
  const handleAddList = async (name: string) => {
    try {
      const res = await fetch(`/api/todo-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name } as CreateTodoListRequest),
      })
      if (!res.ok) {
        console.error('リスト追加失敗', await res.json())
        return
      }

      mutateList()
      mutateTodo()
    } catch (e) {
      console.error('リスト作成エラー：', e)
    }
  }

  // listの削除
  const handleDeleteList = async () => {
    try {
      const res = await fetch(`/api/todo-lists/${selectedListId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        console.error('リスト削除失敗', await res.json())
        return
      }
      mutateList()
    } catch (e) {
      console.error('リスト削除エラー：', e)
    }
  }

  // todoの追加
  const handleAddTodo = async (title: string) => {
    try {
      const res = await fetch(`/api/todo-lists/${selectedListId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title } as CreateTodoItemRequest), // ※型アサーションのため、実行時チェックはない
      })
      if (!res.ok) {
        console.error('todo追加失敗', await res.json())
        return
      }
      mutateTodo()
    } catch (e) {
      console.error('todo追加エラー：', e)
    }
  }

  // todoの編集
  const toggleTodoStatus = async (
    id: string,
    title: string,
    isDone: boolean,
  ) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, isDone } as UpdateTodoItemRequest),
      })
      if (!res.ok) {
        console.error('todo編集失敗', await res.json())
        return
      }
      mutateTodo()
    } catch (e) {
      console.error('todo編集エラー：', e)
    }
  }

  // todoの削除
  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        console.error('todo削除失敗', await res.json())
        return
      }
      mutateTodo()
    } catch (e) {
      console.error('todo削除エラー：', e)
    }
  }

  useEffect(() => {
    if (list === undefined) {
      // ロード中、何もしない
      return
    } else if (list.todoLists.length === 0) {
      // Listが１件もない場合、nullをセット
      setSelectedListId(null)
    } else if (selectedListId === null) {
      // Listはあるが未選択の場合、先頭のListを表示する
      setSelectedListId(list.todoLists[0].id)
    } // Listを選択中であれば、そのまま
  }, [list, selectedListId])

  return (
    <aside
      className={`fixed inset-y-0 z-20 space-y-2 overflow-auto bg-[#FCFAF7] transition-all duration-300 ${isCollapsed ? 'left-[80px]' : 'left-[160px]'} ${isTodoPanelOpen ? 'w-[300px] border border-[#e9e3cc] p-4' : 'w-0'}`}
    >
      {/*listチップ一覧*/}
      <div className="flex flex-wrap gap-1">
        {list?.todoLists?.map((list) => (
          <button
            key={list.id}
            className={`inline-flex items-center rounded-xl border px-2 text-sm font-medium ${list.id === selectedListId ? 'bg-[#5A8B7D]/70 text-white' : 'border border-[#5A8B7D]/70 text-[#5A8B7D]/70 hover:bg-[#5A8B7D]/70 hover:text-white'}`}
            onClick={() => setSelectedListId(list.id)}
          >
            {list.name}
          </button>
        ))}

        {/*list追加*/}
        <button
          className="items-center rounded-xl border-[#5A8B7D]/70 px-2 text-[#5A8B7D] hover:bg-[#5A8B7D]/70 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isValidatingList}
        >
          +
        </button>
      </div>

      {isOpen && (
        <form
          className="flex gap-2"
          onSubmit={handleSubmitList((data) => {
            handleAddList(data.name)
            setIsOpen(false)
          })}
        >
          <div>
            <input
              className="flex-1 rounded border-2 border-[#5A8B7D] p-1 focus:outline-none focus:ring-1 focus:ring-[#5A8B7D]"
              placeholder="新しいリスト"
              {...registerList('name')}
            />
            {errorsList.name && (
              <p className="mt-1 text-sm text-red-400">
                {errorsList.name.message}
              </p>
            )}
          </div>
          <button
            className="rounded-lg border-2 border-[#5A8B7D] p-2 text-center text-xs text-[#5A8B7D] hover:bg-[#5A8B7D]/70 hover:text-white"
            type="submit"
            disabled={isValidatingList || isValidatingTodo}
          >
            作成
          </button>
        </form>
      )}

      {/*todo追加*/}
      {selectedListId !== null && (
        <form
          className="flex gap-2"
          onSubmit={handleSubmitTodo((data) => {
            handleAddTodo(data.title)
            resetTodo()
          })}
        >
          <div>
            <input
              className="flex-1 rounded border border-[#5A8B7D] p-1 focus:outline-none focus:ring-1 focus:ring-[#5A8B7D]"
              placeholder="新しいTodo"
              {...registerTodo('title')}
            />
            {errorsTodo.title && (
              <p className="mt-1 text-sm text-red-400">
                {errorsTodo.title.message}
              </p>
            )}
          </div>
          <button
            className="rounded-lg border border-[#5A8B7D] p-2 text-center text-sm text-[#5A8B7D] hover:bg-[#5A8B7D]/70 hover:text-white"
            type="submit"
            disabled={isValidatingTodo}
          >
            +
          </button>
        </form>
      )}

      {/*todo一覧*/}
      <ul className="space-y-2">
        {(todos?.todos || []).map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm"
          >
            {editingId !== todo.id ? (
              /* 通常モードの表示 */
              <>
                <label className="flex flex-1 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={() =>
                      toggleTodoStatus(todo.id, todo.title, !todo.isDone)
                    }
                  />
                  <span
                    className={`${todo.isDone ? 'text-gray-400 line-through' : ''}`}
                  >
                    {todo.title}
                  </span>
                </label>

                <div className="flex justify-end gap-3 p-2 text-right">
                  <button
                    onClick={() => {
                      setEditingId(todo.id) // 編集モードにセット
                      setEditingTitle(todo.title) // 今のタイトル初期値をセット
                    }}
                    disabled={isValidatingTodo}
                  >
                    <SquarePen
                      size={16}
                      className="text-gray-500 hover:text-[#5A8B7D]/70"
                    />
                  </button>
                  <button
                    className="text-red-400"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={isValidatingTodo}
                  >
                    <Trash2
                      size={16}
                      className="text-gray-500 hover:text-red-400"
                    />
                  </button>
                </div>
              </>
            ) : (
              /* 編集モードの表示 */
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 rounded border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#5A8B7D]"
                  autoFocus
                />
                <button
                  onClick={async () => {
                    await toggleTodoStatus(todo.id, editingTitle, todo.isDone)
                    setEditingId(null) // 編集モード終了
                  }}
                >
                  <Check size={16} className="text-[#5A8B7D]/70" />
                </button>
                <button onClick={() => setEditingId(null)}>
                  <X size={16} className="text-red-400" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/*list削除*/}
      {selectedListId !== null && (
        <button
          className="mt-auto flex w-full justify-end gap-1 p-2 text-right"
          onClick={handleDeleteList}
          disabled={isValidatingList}
        >
          <div className="flex items-center text-gray-500 hover:text-red-400">
            <Trash2 size={16} />
            <span>リストを削除</span>
          </div>
        </button>
      )}
    </aside>
  )
}
