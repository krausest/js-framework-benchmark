import { defineMutation, sql } from '@livestore/livestore'
import { Schema } from 'effect'

import { Filter } from '../types.js'

export const addTodo = defineMutation(
  'addTodo',
  Schema.Struct({ id: Schema.String, text: Schema.String }),
  sql`INSERT INTO todos (id, text, completed) VALUES ($id, $text, false)`,
)

export const completeTodo = defineMutation(
  'completeTodo',
  Schema.Struct({ id: Schema.String }),
  sql`UPDATE todos SET completed = true WHERE id = $id`,
)

export const uncompleteTodo = defineMutation(
  'uncompleteTodo',
  Schema.Struct({ id: Schema.String }),
  sql`UPDATE todos SET completed = false WHERE id = $id`,
)

export const deleteTodo = defineMutation(
  'deleteTodo',
  Schema.Struct({ id: Schema.String, deleted: Schema.Number }),
  sql`UPDATE todos SET deleted = $deleted WHERE id = $id`,
)

export const clearCompleted = defineMutation(
  'clearCompleted',
  Schema.Struct({ deleted: Schema.Number }),
  sql`UPDATE todos SET deleted = $deleted WHERE completed = true`,
)

export const updateNewTodoText = defineMutation(
  'updateNewTodoText',
  Schema.Struct({ text: Schema.String, sessionId: Schema.String }),
  sql`UPDATE app SET newTodoText = $text WHERE id = $sessionId`,
  { localOnly: true },
)

export const setFilter = defineMutation(
  'setFilter',
  Schema.Struct({ filter: Filter, sessionId: Schema.String }),
  sql`UPDATE app SET filter = $filter WHERE id = $sessionId`,
  { localOnly: true },
)
