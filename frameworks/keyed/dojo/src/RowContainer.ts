import { create, w } from '@dojo/framework/core/vdom';
import Row from './Row';

export interface RowContainerProperties {
	ids: string;
	onSelect: any;
}

const factory = create().properties<RowContainerProperties>();

export default factory(function RowContainer({ properties }) {
    const { ids, onSelect } = properties();
    console.count('container');
	return (JSON.parse(ids) as number[]).map((id: number) => {
		return w(Row, {
			id,
			key: id,
			onSelect
		});
	});
});
