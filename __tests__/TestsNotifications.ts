import Notifications from '../src/Communication/Notification';
import OrderViewModel from '../src/ViewModel/OrderViewModel';

const mockUpdateWaiterLocation = jest.fn();
const mockUpdateOrderStatus = jest.fn();
const mockGetOrderStatus = jest.fn(() => 'status')
jest.mock('guests_app/src/ViewModel/OrderViewModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateWaiterLocation: mockUpdateWaiterLocation,
			updateOrderStatus: mockUpdateOrderStatus,
			getOrderStatus:mockGetOrderStatus,
		};
	});
});

beforeEach(() => {
	(OrderViewModel as unknown as jest.Mock).mockClear();
	mockUpdateOrderStatus.mockClear();
	mockUpdateWaiterLocation.mockClear();
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('updateWaiterLocation', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateWaiterLocation({});
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateWaiterLocation({'waiterID':'Hey Ravid'});
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateWaiterLocation({'waiterID':'Hey Ravid', 'location': {x: 15, y: -26, mapID: 'id'}})
		expect(mockUpdateWaiterLocation).toBeCalledTimes(1);
	});
		
	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateWaiterLocation(
			{'waiterID':'Hey Ravid', 'location': {x: 15, y: -26, mapID: 'id'}, 'extra arg': 'extra info'}
		);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(1);
	});

	it('Sending something else then string as waiter id', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateWaiterLocation({'waiterID':123, 'location': {x: 15, y: -26,mapID: 'id'}});
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending something else then location as waiter location', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15, mapID: 'id'}, {mapID: 'id'}, 2, '123'].forEach(location =>
			notifications.eventToCallback.updateWaiterLocation({'waiterID':'123', 'location': location})
		);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});
});

describe('changeOrderStatus', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.changeOrderStatus({});
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.changeOrderStatus({'orderID': '12345'});
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.changeOrderStatus({'orderID': '12345', 'orderStatus': 'ready to deliver'});
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.changeOrderStatus({'orderID': '12345', 'orderStatus': 'ready to deliver', 'extra': 'null'});
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending something else than string as order id', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, []].forEach(id =>
			notifications.eventToCallback.changeOrderStatus({'orderID': id, 'orderStatus': 'ready to deliver'})
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending something else than status as order status', () => {
		const notifications = new Notifications();
		[
			{z: 15, y: -26},
			{x: 15},
			{},
			2,
			[],
			'',
			'hey Ravid<3',
			undefined,
		].forEach(status =>
			notifications.eventToCallback.changeOrderStatus({'orderID': '12345', 'orderStatus': status})
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});
});
