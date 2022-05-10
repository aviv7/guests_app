import React, {useRef} from 'react';
import MapScreenView from '../View/MapScreenView';

interface RefObject {
	open: () => void;
}
export default function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RefObject>();

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
		/>
	);
}
