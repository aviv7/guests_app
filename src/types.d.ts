export type OrderID = string;

export type Order = {
	id: OrderID;
	items: Object;
	status: OrderStatus;
};

export type Item = {
	id: string;
	name: string;
	prepare_time: Number;
};

export type Waiter = {
	id: string;
	location: Location;
};

export type OrderStatus =
	| 'received'
	| 'in preparation'
	| 'ready to deliver'
	| 'assigned'
	| 'on the way'
	| 'delivered'
	| 'canceled';

export type OrderIDO = {
	id: OrderID;
	guestId: string;
	items: Record<string, number>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime: Date | undefined;
};
export type ItemIDO = {
	id: string;
	name: string;
	price: number;
	preparationTime: number;
};

export type WaiterID = string;
export type WaiterIDO = {
	id: WaiterID;
	name: string;
	avialabe: boolean;
};

// -------------------- Location ----------------------
export type MapIDO = {
	id: string;
	name: string;
	corners: Corners;
	imageURL: string;
};

export type GPS = {
	longitude: number;
	latitude: number;
};

export type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};

export type Location = {
	x: number;
	y: number;
	mapID: string;
};

export type LocationCoordinates = {
	x: number;
	y: number;
};

export interface LocationService {
	getLocation(
		successCallback: (location: Location | null) => void,
		errorCallback: (error: string) => void
	): void;

	watchLocation(
		successCallback: (location: Location | null) => void,
		errorCallback: (error: string) => void
	): void;

	stopWatching(): void;
}
