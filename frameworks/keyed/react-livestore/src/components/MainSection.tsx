import { querySQL, rowQuery, SessionIdSymbol, sql } from '@livestore/livestore'
import { useQuery, useStore } from '@livestore/react'
import { Schema } from 'effect'
import React from 'react'

import { mutations, tables, type Todo } from '../schema/index.js'

// Define the reactive queries for this component

// First, we create a reactive query which defines the filter clause for the SQL query.
// It gets all the rows from the app table, and pipes them into a transform function.
// The result is a reactive query whose value is a string containing the filter clause.
const filterClause$ = rowQuery(tables.app, SessionIdSymbol, {
  map: ({ filter }) => `where ${filter === 'all' ? '' : `completed = ${filter === 'completed'} and `}deleted is null`,
  label: 'filterClause',
})

// Next, we create the actual query for the visible todos.
// We create a new reactive SQL query which interpolates the filterClause.
// Notice how we call filterClause() as a function--
// that gets the latest value of that reactive query.
const visibleTodos$ = querySQL((get) => sql`select * from todos ${get(filterClause$)}`, {
  schema: Schema.Array(tables.todos.schema),
  label: 'visibleTodos',
})

export const MainSection: React.FC = () => {
  const { store } = useStore()

  // We record an event that specifies marking complete or incomplete,
  // The reason is that this better captures the user's intention
  // when the event gets synced across multiple devices--
  // If another user toggled concurrently, we shouldn't toggle it back
  const toggleTodo = React.useCallback(
    ({ id, completed }: Todo) =>
      store.mutate(completed ? mutations.uncompleteTodo({ id }) : mutations.completeTodo({ id })),
    [store],
  )

  const visibleTodos = useQuery(visibleTodos$)

  return (
    <section className="main">
      <ul className="todo-list">
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <div className="view">
              <input type="checkbox" className="toggle" checked={todo.completed} onChange={() => toggleTodo(todo)} />
              <label>{todo.text}</label>
              <button
                className="destroy"
                onClick={() => store.mutate(mutations.deleteTodo({ id: todo.id, deleted: Date.now() }))}
              ></button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
