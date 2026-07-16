//===ContactForm=============================================
export type ContactBody = {
  name: string
  email: string
  message: string
}

//===Profile=============================================
export type ProfileDTO = {
  id: string
  displayName: string | null
  lineUserId: string | null
}

// GET,PUT, POST /api/profile
export type ProfileResponse = { profile: ProfileDTO }

//===Timelog=============================================
export type TimelogDTO = {
  id: string
  title: string
  startAt: string // ISO文字列
  endAt: string | null
  category: {
    colorToken: string | null
  }
}

// GET /api/timeline
export type GetTimelogResponse = { activities: TimelogDTO[] }
// POST /api/timeline/start
export type StartTimelogResponse = { timelog: TimelogDTO }
// POST /api/timeline/end
export type EndTimelogResponse = { timelog: TimelogDTO }
// GET /api/timeline/running
export type GetRunningTimelogResponse =
  | { running: false }
  | {
      running: true
      log: {
        id: string
        activityId: string
        activityName: string
        colorToken: string | null
        startAt: string // ISO文字列
      }
    }
// GET /api/timeline/logs
export type LogItemDTO = {
  id: string
  startAt: string // ISO文字列
  endAt: string
  memo: string | null
  activity: {
    id: string
    name: string
    colorToken: string | null
  }
}
export type GetLogsPaginatedResponse = {
  logs: LogItemDTO[]
  total: number
  page: number
  limit: number
}

//===Category=============================================
export type CategoryDTO = {
  id: string
  name: string
  colorToken: string | null
}

// GET /api/timeline/categories
export type CategoriesResponse = { categories: CategoryDTO[] }
// GET /api/timeline/[id]
export type CategoryResponse = { category: CategoryDTO }
// POST /api/timeline/categories
export type CreateCategoryResponse = { id: string }

//===TodoList=============================================
export type TodoListDTO = {
  id: string
  profileId: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// GET /api/todo-lists
export type GetTodoListsResponse = { todoLists: TodoListDTO[] }
// POST/api/todo-lists
export type CreateTodoListResponse = { todoList: TodoListDTO }
// PUT /api/todo-lists/[listId] （フロント未実装）
export type UpdateTodoListResponse = { todoList: TodoListDTO }

//===TodoItem=============================================
export type TodoItemDTO = {
  id: string
  todoListId: string
  title: string
  isDone: boolean
  doneAt: string | null
  createdAt: string
  updatedAt: string
}

// GET /api/todo-lists/[listId]/todos
export type GetTodoItemsResponse = { todos: TodoItemDTO[] }
// POST /api/todo-lists/[listId]/todos
export type CreateTodoItemResponse = { todo: TodoItemDTO }
// PUT /api/todos/[todoId]
export type UpdateTodoItemResponse = { todo: TodoItemDTO }

//===Analytics=============================================

// GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export type GetAnalyticsResponse = {
  byCategory: {
    id: string
    name: string
    colorToken: string | null
    totalMinutes: number
  }[]
}
//===LINE=============================================
// POST /api/line/line-token
export type LineLinkTokenResponse = { token: string }
