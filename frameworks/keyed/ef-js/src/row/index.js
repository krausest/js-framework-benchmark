import Tpl from './template.eft'
import {mapAttrs} from 'ef-core'

export default class Row extends mapAttrs(Tpl, {
	id: '',
	label: '',
	selected: {
		key: 'danger',
		checkTrue(val) {
			return val
		},
		trueVal: 'danger',
		falseVal: ''
	}
}) {
	static init(state, $data) {
		const select = () => {
			const { app } = state
			app.$call('select', {id: $data.id})
		}

		const remove = () => {
			const { app } = state
			app.$call('deselect', {id: $data.id})
			state.$umount()
		}

		return {
			methods: {
				select,
				remove
			}
		}
	}
}
