import React, {useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {observer} from 'mobx-react-lite';


import MapLayoutController from './MapLayoutController';
import { MyLocationContext } from '../contexts';
import { PointMarker } from '../map';
import WaiterMarker from '../View/markers/WaiterMarker';
import Location from '../types';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(myLocation: Location | null): PointMarker {
	// if(myLocation != null)
	// 	return {point:{name: 'Personal', location: myLocation}, marker: WaiterMarker} 
	// else
		return {point:{name: 'Personal', location: new Location(0.5,0.5)}, marker: WaiterMarker} 
}

const MapMarkersController = observer(({style}: MapMarkerControllerProps) => {

	//Personal Marker
	const myLocationViewModel = useContext(MyLocationContext);
	const personalMarker = createGuestMarker(myLocationViewModel.getLocation());

	const allMarkers = personalMarker;

	return <MapLayoutController marker={allMarkers} style={style} />;
});

export default MapMarkersController;
