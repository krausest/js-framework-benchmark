import { Schema } from 'effect'

export const Filter = Schema.Literal('all', 'active', 'completed')
export type Filter = typeof Filter.Type
