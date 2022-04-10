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
}) {}
