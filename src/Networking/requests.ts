import {ItemIDO, MapIDO, OrderID, OrderIDO} from '../types';
import {GuestAPI} from './../signatures';
import RequestsHandler from './RequestsHandler';

export default class Requests implements GuestAPI {
	
	private handler: RequestsHandler;

	constructor() {
		this.handler = new RequestsHandler();
	}

	login(username: string, password: string): Promise<string> {
		return this.handler.post<string>('login', {
			username,
			password,
		});
	}
	getItems(): Promise<ItemIDO[]> {
		return this.handler.get<ItemIDO[]>('getItems');
	}

	getGuestOrder(): Promise<OrderIDO> {
		return this.handler.get<OrderIDO>('getGuestOrder');
	}
	createOrder(orderItems: Object): Promise<OrderID> {
		return this.handler.post<OrderID>('createOrder', {orderItems});
	}
	cancelOrderGuest(orderID: OrderID): Promise<void> {
		return this.handler.post<void>('cancelOrderGuest', {orderID});
	}
	submitReview(
		orderId: string,
		details: string,
		rating: Number
	): Promise<void> {
		return this.handler.post<void>('submitReview', {
			orderId,
			details,
			rating,
		});
	}

	getMaps(): Promise<MapIDO[]> {
		return this.handler.get('getMaps');
	}
}

// need to decide how does Map object will be defined
/*	getMaps() : Promise<Map[]>
	{
		return this.handler.get<Map[]>('getMaps',this.token,{})
	} */
