import { useRow, useStore } from '@livestore/react'
import React from 'react'
import { v4 as uuid } from 'uuid'

import { mutations, tables } from '../schema/index.js'

export const Header: React.FC = () => {
  const { store } = useStore()
  const sessionId = store.sessionId
  const [{ newTodoText }] = useRow(tables.app, sessionId)

  const updateNewTodoText = (text: string) => store.mutate(mutations.updateNewTodoText({ text, sessionId }))
  const addTodo = () =>
    store.mutate(
      mutations.addTodo({ id: uuid(), text: newTodoText }),
      mutations.updateNewTodoText({ text: '', sessionId }),
    )

  return (
    <header className="header">
      <h1>TodoMVC</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={newTodoText}
        onChange={(e) => updateNewTodoText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTodo()
          }
        }}
      ></input>
    </header>
  )
}
