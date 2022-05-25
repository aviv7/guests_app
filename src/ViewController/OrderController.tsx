//import {observer} from '../../node_modules/mobx-react-lite';
import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import { itemsContext, MyLocationContext, OrdersContext } from '../contexts';
import { OrderView } from '../View/OrderView';

type OrderControllerProps = {};

const OrderController = observer((_props: OrderControllerProps) => {
	const orderViewModel = useContext(OrdersContext);
	const itemViewModel = useContext(itemsContext);
	const locationViewModel = useContext(MyLocationContext);
	
	const [orderStatus, setorderStatus] = useState('');
	const [orderId, setorderId] = useState('');
	const [hasActiveOrder, setHasActiveOrder] = useState(false);

	//future signature - SendOrderToServer(items: Map<string, Number>)
	async function SendOrderToServer() {
		
		let itemID1 = itemViewModel.getItems()[0].id;
		let itemID2 = itemViewModel.getItems()[1].id;
		let items = {[itemID1]: 2, [itemID2]:1};
		await orderViewModel
			.createOrder(items)
			.then(createdOrder => 
				{
				//	console.log('order created with order id: ' + createdOrder.id);
					Alert.alert("Order Created Succesfully!")
					startWaitingForOrder();
				})
			.catch(err =>
				Alert.alert(
					'failed to create order due to ' +
						err.response.data
				)
			);
	}
	
	
	function startWaitingForOrder() {
		console.log('start waiting for order - tracking location');
		locationViewModel.startTrackingLocationWhenApproved();
	}


	function CancelOrder() {
		orderViewModel
			.cancelOrder()
			.then(() =>{Alert.alert('order canceled succesfully'); locationViewModel.stopTracking(); })
			.catch(err => Alert.alert('failed to cancel order due to: ' + err));
	}

	function requstLocationForOrder() {
		return locationViewModel.askLocationApproval()
		.then(()=>  
				{ 
					locationViewModel.startTrackingLocationWhenApproved();
					//  return Promise.resolve("approved using location");
					let location = locationViewModel.getLocation();
					console.log("location after watch - " , location)
					if(location === null)
					{
						locationViewModel.getLocationPoint();
						location = locationViewModel.getLocation();
						console.log("location after get point - " , location)
					}
					
					return location !== null ?
						Promise.resolve("the location: " +  location) : 
						Promise.reject("location not valid")
				});	
	}

	return (
		<OrderView 
		requestLocation={requstLocationForOrder}
		SendOrderToServer={SendOrderToServer}
		cancelOrder={CancelOrder}
		hasActiveOrder={orderViewModel.hasActiveOrder()} 
		orderID={orderViewModel.getOrderId()} 
		orderStatus={orderViewModel.getOrderStatus()}
		orderItems={orderViewModel.getOrderItems()}			
		/>
	);
});
export default OrderController;
