import React, {useContext} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {itemsContext, MyLocationContext, OrdersContext} from '../contexts';
import {MainPage} from '../View/MainPageView';

import {observer} from 'mobx-react-lite';

export const MainPageViewController = observer(() => {
	const orderViewModel = useContext(OrdersContext);
	const itemViewModel = useContext(itemsContext);
	const locationViewModel = useContext(MyLocationContext);
	
	if(orderViewModel.hasActiveOrder())
	{
		Alert.alert("You have an active order!\nplease stay in your place");
		startWaitingForOrder()
	}
	else
	{
		locationViewModel.stopTracking();
	}
	if(!locationViewModel.getIsLocationApproved())
		requestPermissions();

	async function requestPermissions() {
		// if (Platform.OS === 'ios') {
		//   Geolocation.requestAuthorization();
		//   Geolocation.setRNConfiguration({
		//     skipPermissionRequests: false,
		//    authorizationLevel: 'whenInUse',
		//  });
		// }

		if (Platform.OS === 'android') {
			return	await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			)
			// .then((msg) => console.log("then request msg: " + msg))
			// .catch((err) => console.log("request error: " + err));
		}

		// return await PermissionsAndroid.request(
		// 	PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		// );
	}
	//future signature - SendOrderToServer(items: Map<string, Number>)
	async function SendOrderToServer() {
		let itemID1 = itemViewModel.getItems()[0].id;
		let itemID2 = itemViewModel.getItems()[1].id;
		console.log('items available: ', itemViewModel.getItems());
		let items = {[itemID1]: 2, [itemID2]:1};

		requestPermissions()
			.then((response) => 
			{
				if (response === PermissionsAndroid.RESULTS.GRANTED) {
					orderViewModel
						.createOrder(items)
						.then(createdOrder => {
							console.log(
								'order created with order id: ' +
									createdOrder.id
							);
							startWaitingForOrder();
						})
						.catch(err =>
							Alert.alert(
								'failed to create order due to ' +
									err.response.data
							)
						);
			}
		})
			.catch(_ => Alert.alert('Please Approve using location'));
	}

	function startWaitingForOrder() {
		console.log('start waiting for order');
		locationViewModel.startTrackingLocation();
	}
	/*  function waitForOrder(_orderID: String){
        // if(interval.current){
        //   clearInterval(interval.current);
        // }
        //;
        // interval.current = setInterval(() => {hasOrderArrived(_orderID) } , 6000);
        updateLocationGuest(_orderID);
    } */

	const Props = {
		sendOrderToServer: () => SendOrderToServer,
		hasActiveOrder: orderViewModel.hasActiveOrder(),
		orderID: orderViewModel.getOrderId(),
		orderStatus: orderViewModel.getOrderStatus(),
	};
	function CancelOrder() {
		orderViewModel
			.cancelOrder()
			.then(() => Alert.alert('order canceled succesfully'))
			.catch(err => Alert.alert('failed to cancel order due to: ' + err));
	}
	// return <MainPage {...Props} />;
	return (
		<MainPage
			sendOrderToServer={SendOrderToServer}
			cancelOrder={CancelOrder}
			submitReview={(openText: string, rating:number)=> orderViewModel.submitReview(openText,rating)}
			hasActiveOrder={orderViewModel.hasActiveOrder()}
			orderID={orderViewModel.getOrderId()}
			orderStatus={orderViewModel.getOrderStatus()}
			isLocationApproved={locationViewModel.getIsLocationApproved()}
		/>
	);
});
