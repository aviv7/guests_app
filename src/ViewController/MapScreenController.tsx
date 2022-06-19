// import React, {useRef} from 'react';
// import MapScreenView from '../View/MapScreenView';

// interface RefObject {
// 	open: () => void;
// }
// export default function MapScreenController(): JSX.Element {
// 	const refBottomSheet = useRef<RefObject>();

// 	const openBottomSheet = () => {
// 		refBottomSheet.current?.open();
// 	};

// 	return (
// 		<MapScreenView
// 			refBottomSheet={refBottomSheet}
// 			openBottomSheet={openBottomSheet}
// 		/>
// 	);
// }











import {observer} from 'mobx-react-lite';
import React, {useContext, useRef} from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ConnectionContext, MyLocationContext, OrdersContext } from '../contexts';

import MapScreenView from '../View/MapScreenView';

function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);
	const connectViewModel = useContext(ConnectionContext);
	const locationViewModel = useContext(MyLocationContext);
	const orderViewModel = useContext(OrdersContext);
	
	connectViewModel.setUsername('Aviv')

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};
	
	function onStart(){
		if(!locationViewModel.getHasAskedLocationAtStart())
		{
			if(orderViewModel.hasActiveOrder()){
				locationViewModel.locationNeedsToBeTracked();
				locationViewModel.askLocationApproval()
				.then(() =>{locationViewModel.startWatchingLocation();})
				.catch(() => Alert.alert("You have an active order!\nPlease approve using your location"));
				
				locationViewModel.getLocationPoint();
				if(locationViewModel.getLocation() === null) // if GPS is turned off
				{
					Alert.alert("You have an active order!" ,"Make sure your location is shown correctly on map")
				}
				locationViewModel.AskedLocationAtStart()
			}
			else{
				locationViewModel.stopTrackingLocation();
			}
			if(!locationViewModel.getHasAskedLocationAtStart())
			{	
				console.log("asking location at start -- ")
				locationViewModel.askLocationApproval()
				.then(() => locationViewModel.startWatchingLocation())
				locationViewModel.AskedLocationAtStart();
			}
		}
		// if(orderViewModel.hasActiveOrder()){
		// 	locationViewModel.locationNeedsToBeTracked();
		// 	locationViewModel.askLocationApproval()
		// 	.then(() =>{locationViewModel.startWatchingLocation();})
		// 	.catch(() => Alert.alert("You have an active order, Please approve using your location"))
		// 	locationViewModel.AskedLocationAtStart();
			
		// 	locationViewModel.getLocationPoint();
		// 	if(locationViewModel.getLocation() === null) // if GPS is turned off
		// 	{
		// 		Alert.alert("You have an active order, Please turn on GPS")
		// 	}
		// }
		// else{
		// 	locationViewModel.stopTrackingLocation();
		// }

		// if(!locationViewModel.getHasAskedLocationAtStart())
		// {	
		// 	console.log("asking location at start -- ")
		// 	locationViewModel.askLocationApproval()
		// 	.then(() => locationViewModel.startWatchingLocation())
		// 	locationViewModel.AskedLocationAtStart();
		// }
	}
	onStart();

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
			onOrdersClose={() => console.log("order tab closed")}
			username={connectViewModel.getUsername()}
		/>
	);
}

export default observer(MapScreenController);
