/*
Copied into project the relevant signatures and types from the shared api.ts file
*/

import {
	Location,
	ItemIDO,
	OrderID,
	OrderIDO,
	OrderStatus,
	WaiterID,
	MapIDO,
} from './types';

export interface GuestAPI {
	// Guest
	login(username: string, password: string): Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	getMaps: () => Promise<MapIDO[]>; 
	getGuestOrder: () => Promise<OrderIDO>;
	createOrder(orderItems: Map<string, number>): Promise<OrderID>;
	submitReview(
		orderId: string,
		details: string,
		rating: number
	): Promise<void>;
	cancelOrderGuest: (orderId: OrderID) => Promise<void>;
}

export interface guestCommunication {
	updateGuestLocation: (guestLocation: Location) => void;
	locationErrorGuest: (errorMsg: string) => void;
}

// guests Notifications from server:
export interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterID: WaiterID,
		waiterLocation: Location
	) => void;
	changeOrderStatus: (orderID: string, status: OrderStatus) => void;
}
