import { Alert } from 'react-native';
import Requests from '../Networking/requests';
import { isLocation, isOrderStatus, isString } from '../typeGuards';
import OrderViewModel from '../ViewModel/OrderViewModel';

export type Params = {[param: string]: unknown};
export default class Notifications {
	
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: Params) => void> = {
		updateWaiterLocation: params => this.updateWaiterLocation(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
	};

	constructor() {
		this.orders = new OrderViewModel(new Requests());
	}

	private updateWaiterLocation(params: Params): void {
		const waiterID = params.waiterID;
		const waiterLocation = params.location;
		
		if (isString(waiterID) && isLocation(waiterLocation)) {
			this.orders.updateWaiterLocation(waiterID, waiterLocation);
			return;
		}
		else{
			console.warn(
				`In the event, "waiterLocationUpdate", parameters are not in the right format`
			);
		}
	}

	private changeOrderStatus(params: Params): void {
		const orderID =params.orderID;
		const orderStatus = params.orderStatus;

		if (isString(orderID) && isOrderStatus(orderStatus)) {
			this.orders.updateOrderStatus(orderID, orderStatus);
			//this.orders.getOrderId() == orderID && 
			if(orderStatus == 'canceled')
			{
				Alert.alert("Your order has been canceled by the hotel!")
			}
			if(this.orders.getOrderStatus() == 'delivered'){
				Alert.alert("Your order has arrived!")
			}
			return;
		}
		else{
			console.warn(
				`In the event, "changeOrderStatus", parameters ${params} are not in the right format`
			);
		}
	}
}
