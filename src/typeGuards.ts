import Location, { OrderStatus } from "./types";

export function isLocation(location: any): location is Location {
	return (
		(location as Location).x !== undefined &&
		(location as Location).y !== undefined
	);
}

export function isString(someString: any): someString is string {
	return typeof someString === 'string';
}

// @TODO: UPDATE FUNCTION
export function isOrderStatus(status: any): status is OrderStatus {
	const result = ['unassigned', 'inprogress', 'completed'].find(
		availableStatus => availableStatus === status
	);
	return result !== undefined;
}

