import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import { MyLocationContext } from '../contexts';
import WarningsView from '../View/WarningsView';

const WarningsController = observer((): JSX.Element => {
	const myLocation = useContext(MyLocationContext);

	const outOfBound = myLocation.isCurrentLocationOutOfBound;
	const currentLocationError = myLocation.currentLocationError;

    console.log("curent location error - " + currentLocationError)

	const warnings = [
		...(outOfBound ? ["You're out side of the service area"] : []),
		...(currentLocationError
			? [`Could not get your location - ${currentLocationError}`]
			: []),
	];

	return <WarningsView warnings={warnings} />;
});

export default WarningsController;