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

		await orderViewModel
			.createOrder()
			.then(createdOrder => 
				{
					console.log('order created with order id: ' + createdOrder.id);
					Alert.alert("Order Created Succesfully!")
					startWaitingForOrder();
				})
			.catch(err =>{
					let msg = 'failed to create order due to:' 
					let description = ''
					if(err.response && err.response.data)
						description = description + err.response.data
					else
						description = description + err
					Alert.alert(
						msg,description
					)
				}
			);
	}
	
	
	function startWaitingForOrder() {
		console.log('start waiting for order - tracking location');
		locationViewModel.locationNeedsToBeTracked();
	}


	function CancelOrder() {
		orderViewModel
			.cancelOrder()
			.then(() =>{Alert.alert('order canceled succesfully');})
			.catch(err => Alert.alert('failed to cancel order due to:\n', err));
	}

	function requestLocationForOrder() {
		return locationViewModel.askLocationApproval()
		.then(()=>  
				{ 
					locationViewModel.startWatchingLocation();
					//  return Promise.resolve("approved using location");
					let location = locationViewModel.getLocation();
					if(location === null)
					{
						locationViewModel.getLocationPoint();
						location = locationViewModel.getLocation();
					}
					
					return location !== null ?
						Promise.resolve("the location: " +  location) : 
						Promise.reject("location not valid")
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
	function removeFinishedOrder(){
		orderViewModel.removeFinishedOrder();
	}
	return (
		<OrderView 
			requestLocation={requestLocationForOrder}
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
			submitReview={(openText: string, rating:number)=> orderViewModel.submitReview(openText,rating)}
			removeFinishedOrder={removeFinishedOrder}
		/>
	);
});
export default OrderController;
