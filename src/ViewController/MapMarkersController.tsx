import React, {useContext} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

import {observer} from 'mobx-react-lite';


import MapLayoutController from './MapLayoutController';
import { MyLocationContext, OrdersContext } from '../contexts';
import { PointMarker } from '../map';
import WaiterMarker, { ActiveGuestMarker, InActiveGuestMarker } from '../View/markers/Markers';
import {Location} from '../types';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(myLocation: Location | null): PointMarker {
	if(myLocation != null)
		return {point:{name: 'Personal', location:myLocation}, marker: ActiveGuestMarker} 

	else
		return {point:{name: 'Personal', location: {x: 0.5, y: 0.5, mapId: ''},}, marker: InActiveGuestMarker};
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


	const currentMap = myLocationViewModel.currentMap;
	if (!currentMap) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Loading map...</Text>
			</View>
		);
	}
	
	return <MapLayoutController markers={allMarkers} style={style} imageURL={currentMap.imageURL}
	/>;
});

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 20,
	},
});

export default MapMarkersController;
