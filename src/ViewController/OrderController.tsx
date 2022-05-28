//import {observer} from '../../node_modules/mobx-react-lite';
import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import { itemsContext, MyLocationContext, OrdersContext } from '../contexts';
import { ItemIDO } from '../types';
import { OrderView } from '../View/OrderView';

type OrderControllerProps = {};

const OrderController = observer((_props: OrderControllerProps) => {
	const orderViewModel = useContext(OrdersContext);
	const itemViewModel = useContext(itemsContext);
	const locationViewModel = useContext(MyLocationContext);

	async function SendOrderToServer() {
		
		// let itemID1 = itemViewModel.getItems()[0].id;
		// let itemID2 = itemViewModel.getItems()[1].id;
		// // let items = {[itemID1]: 2, [itemID2]:1};
		// orderViewModel.updateItemToOrder(itemID1,2);
		// orderViewModel.updateItemToOrder(itemID2,4);

		await orderViewModel
			.createOrder()
			.then(createdOrder => 
				{
				//	console.log('order created with order id: ' + createdOrder.id);
					Alert.alert("Order Created Succesfully!")
					startWaitingForOrder();
				})
			.catch(err =>{
					let msg = 'failed to create order due to ' 
					if(err.response && err.response.data)
						msg = msg + err.response.data
					else
						msg = msg + err
					Alert.alert(
						msg
					)
				}
			);
	}
	
	
	function startWaitingForOrder() {
		console.log('start waiting for order - tracking location');
		locationViewModel.startTrackingLocationWhenApproved();
	}


	function CancelOrder() {
		orderViewModel
			.cancelOrder()
			.then(() =>{Alert.alert('order canceled succesfully'); })
			.catch(err => Alert.alert('failed to cancel order due to: ' + err));
	}

	function requstLocationForOrder() {
		return locationViewModel.askLocationApproval()
		.then(()=>  
				{ 
					 locationViewModel.startTrackingLocationWhenApproved();
					 return Promise.resolve("approved using location");
					//  let location = locationViewModel.getLocation();
					//  console.log("location after watch - " , location)
					//  if(location === null)
					//  	locationViewModel.getLocationPoint();
					//  location = locationViewModel.getLocation();
					//  console.log("location after get point - " , location)
						
					//  return location !== null ?
					// 		Promise.resolve("the location: " +  location) : 
					// 		Promise.reject("location not valid")
				});	
	}
	function addItemToCart (item: ItemIDO, amount: number): void
	{
		orderViewModel.updateItemToOrder(item,amount);
	}
	function getOrderedItems(){
		let ids_amounts = orderViewModel.getOrderedItems();
		let ids = Object.keys(ids_amounts)
		let names_amounts:Record<string, number> = {};
		ids.forEach((id:string) => {
			let item_name = itemViewModel.getItemById(id)?.name;
			if(item_name)
				names_amounts[item_name] = ids_amounts[id]
					
		})
		return names_amounts;
	}
	function getItemsToOrder(){
		let ids_amounts = orderViewModel.getItemsToOrder();
		let ids = Object.keys(ids_amounts)
		let names_amounts:Record<string, number> = {};
		ids.forEach((id:string) => {
			let item_name = itemViewModel.getItemById(id)?.name;
			if(item_name)
				names_amounts[item_name] = ids_amounts[id]
					
		})
		return names_amounts;
	}
	function clearOrder(){
		orderViewModel.clearItemsToOrder();
	}
	
	return (
		<OrderView 
			requestLocation={requstLocationForOrder}
			SendOrderToServer={SendOrderToServer}
			cancelOrder={CancelOrder}
			hasActiveOrder={orderViewModel.hasActiveOrder()} 
			orderID={orderViewModel.getOrderId()} 
			orderStatus={orderViewModel.getOrderStatus()}
			orderedItems={getOrderedItems()}
			itemsToOrder={getItemsToOrder()}	
			itemsMenu={itemViewModel.getItems()}
			onAddToCart = {addItemToCart}
			orderPreparationTime = {orderViewModel.getOrderPreparationTime()}
			clearOrder = {clearOrder}
		/>
	);
});
export default OrderController;
