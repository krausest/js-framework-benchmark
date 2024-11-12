import { makeWorker } from '@livestore/web/worker'

import { schema } from './schema/index.js'

makeWorker({ schema })
