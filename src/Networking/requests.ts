// const service = new Gps();
// const corners = {
// 	topRightGPS: new Location(34.802516, 31.26355),
// 	topLeftGPS: new Location(34.800838, 31.26355),
// 	bottomRightGPS: new Location(34.802516, 31.261649),
// 	bottomLeftGPS: new Location(34.800838, 31.261649),
// };

// topLeft: 31.263550, 34.800838
// topRight:  31.263550, 34.802516
// bottomLeft: 31.261649, 34.800838
// bottomRight: 31.261649, 34.802516

// export function updateLocationGuest(orderID: OrderID) {
// 	const url = `${server_adress}/updateLocationGuest`;
// 	service.watchLocation(
// 		location => {
// 			console.log('X cordinate from location service: ' + location.x);
// 			console.log('Y cordinate from location service: ' + location.y);
// 			const mapScaling = new Map('Default Map', corners);
// 			const newLocation: Location = mapScaling.translateGps(location);
// 			console.log('X cordinate from translated: ' + newLocation.x);
// 			console.log('Y cordinate from translated: ' + newLocation.y);
// 			axios({
// 				method: 'POST',
// 				url: url,
// 				data: {
// 					location: {
// 						x: newLocation.x,
// 						y: newLocation.y,
// 					},
// 					orderID: orderID,
// 				},
// 			})
// 				.then(res => console.log(res.status))
// 				.catch(err =>
// 					console.log('update Location guest error - ' + err)
// 				);
// 		},
// 		err => console.log('get location eror - ' + err)
// 	);
// }
import {ItemIDO, OrderID, OrderIDO} from '../types';
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
}

// need to decide how does Map object will be defined
/*	getMaps() : Promise<Map[]>
	{
		return this.handler.get<Map[]>('getMaps',this.token,{})
	} */
