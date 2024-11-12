import { querySQL, sql } from '@livestore/livestore'
import { useQuery, useRow, useStore } from '@livestore/react'
import { Schema } from 'effect'
import React from 'react'

import { mutations, tables } from '../schema/index.js'
import type { Filter } from '../types.js'

const incompleteCount$ = querySQL(sql`select count(*) as c from todos where completed = false and deleted is null`, {
  schema: Schema.Struct({ c: Schema.Number }).pipe(Schema.pluck('c'), Schema.Array, Schema.headOrElse()),
  label: 'incompleteCount',
})

export const Footer: React.FC = () => {
  const { store } = useStore()
  const sessionId = store.sessionId
  const [{ filter }] = useRow(tables.app, sessionId)
  const incompleteCount = useQuery(incompleteCount$)

  const setFilter = (filter: Filter) => store.mutate(mutations.setFilter({ filter, sessionId }))

  return (
    <footer className="footer">
      <span className="todo-count">{incompleteCount} items left</span>
      <ul className="filters">
        <li>
          <a href="#/" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>
            All
          </a>
        </li>
        <li>
          <a href="#/" className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')}>
            Active
          </a>
        </li>
        <li>
          <a href="#/" className={filter === 'completed' ? 'selected' : ''} onClick={() => setFilter('completed')}>
            Completed
          </a>
        </li>
      </ul>
      <button
        className="clear-completed"
        onClick={() => store.mutate(mutations.clearCompleted({ deleted: Date.now() }))}
      >
        Clear completed
      </button>
    </footer>
  )
}
