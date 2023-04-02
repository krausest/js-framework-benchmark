import { create, w } from '@dojo/framework/core/vdom';
import Row from './Row';

export interface RowContainerProperties {
	ids: string;
	onSelect: any;
}

const factory = create().properties<RowContainerProperties>();

export default factory(function RowContainer({ properties }) {
	const { ids: idsString, onSelect } = properties();
	const ids: number[] = JSON.parse(idsString);
	return ids.map((id: number) => {
		return w(Row, {
			id,
			key: id,
			onSelect
		});
	});
});
