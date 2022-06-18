import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {MyLocationContext} from '../contexts';
import WarningsView from '../View/WarningsView';

const WarningsController = observer((): JSX.Element => {
	const myLocation = useContext(MyLocationContext);

	let currentLocationError = myLocation.getCurrentLocationError();

	console.log('curent location error - ', currentLocationError);

	let warnings = currentLocationError ? [currentLocationError] : [];
	//warnings.push('junk error');
	return <WarningsView warnings={warnings} />;
});

export default WarningsController;
