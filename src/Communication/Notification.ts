import Requests from '../Networking/requests';
import { isLocation, isOrderStatus, isString } from '../typeGuards';
import OrderViewModel from '../ViewModel/OrderViewModel';

export type Params = {[param: string]: unknown};
export default class Notifications {
	
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: Params) => void> = {
		waiterLocationUpdate: params => this.waiterLocationUpdate(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
	};

	constructor() {
		this.orders = new OrderViewModel(new Requests());
	}

	private waiterLocationUpdate(params: Params): void {
		console.log("Waiter location update NOTIFICATION!!!")
		// const waiterID = params.waiterID;
		// const waiterLocation = params.waiterLocation;
		
		// if (isString(waiterID) && isLocation(waiterLocation)) {
		// 	this.orders.updateWaiterLocation(waiterID, waiterLocation);
		// 	return;
		// }
		// else{
		// 	console.warn(
		// 		`In the event, "waiterLocationUpdate", parameters ${params} are not in the right format`
		// 	);
		// }
	}

	private changeOrderStatus(params: Params): void {
		console.log("ORDER STATUS CHANGE NOTIFICATION!!!")
		const orderID =params.orderID;
		const orderStatus = params.orderStatus;

		if (isString(orderID) && isOrderStatus(orderStatus)) {
			this.orders.updateOrderStatus(orderID, orderStatus);
			return;
		}
		else{
			console.warn(
				`In the event, "changeOrderStatus", parameters ${params} are not in the right format`
			);
		}
	}
}
