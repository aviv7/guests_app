import React, {useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {observer} from 'mobx-react-lite';


import MapLayoutController from './MapLayoutController';
import { MyLocationContext, OrdersContext } from '../contexts';
import { PointMarker } from '../map';
import WaiterMarker, { ActiveGuestMarker, InActiveGuestMarker } from '../View/markers/WaiterMarker';
import Location from '../types';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(myLocation: Location | null): PointMarker {
	//console.log("guest location marker: ", myLocation)
	if(myLocation != null)
	//	return {point:{name: 'Personal', location: myLocation}, marker: ActiveGuestMarker} 
		return {point:{name: 'Personal', location:myLocation}, marker: ActiveGuestMarker} 

	else
		return {point:{name: 'Personal', location: new Location(0.5,0.5)}, marker: InActiveGuestMarker};
}

function createWaiterMarker(waiterLocation: Location): PointMarker {
	return {point:{name: 'Waiter', location: waiterLocation}, marker: WaiterMarker} 
}



const MapMarkersController = observer(({style}: MapMarkerControllerProps) => {

	//Personal Marker
	const myLocationViewModel = useContext(MyLocationContext);
	const orderViewModel = useContext(OrdersContext);

	const personalMarker = createGuestMarker(myLocationViewModel.getLocation());

	//Waiters Markers
	const waiterMarkers = orderViewModel.getWaitersLocations().map(waiterLocation => 
		createWaiterMarker(waiterLocation));

	const allMarkers = waiterMarkers.concat([personalMarker]);

	return <MapLayoutController markers={allMarkers} style={style} />;
});

export default MapMarkersController;
