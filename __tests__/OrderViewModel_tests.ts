import {flushPromises, makePromise as mockMakePromise} from '../src/PromiseUtils';
import Requests from '../src/Networking/requests';
import OrderViewModel from '../src/ViewModel/OrderViewModel';
import {OrderModel} from '../src/Model/OrderModel';
import { ItemIDO, Order, OrderIDO } from '../src/types';

let item_id1 = 'Item1_ID'
let item_id2 = 'Item2_ID'
const item1: ItemIDO = {id: item_id1, name: 'Beer', price: 10, preparationTime: 1};
const item2: ItemIDO = {id: item_id2, name: 'Bamba', price: 5, preparationTime: 1};

let itemIDS_amounts: Record<string, number> = {item_id1:1,item_id2:2};
let order1: OrderIDO = {
	id: '1',
	guestId: '1',
	items: itemIDS_amounts,
	status: 'received',
	creationTime: new Date(),
	terminationTime: new Date(),
};
let orderAtServer: OrderIDO = order1;
const createdOrderId = '123';
let createdOrder: Order = {
	id: createdOrderId,
	items: itemIDS_amounts,
	status: 'received',
};

const mockGetGuestOrder = jest.fn();
const mockCreateOrder = jest
	.fn()
	.mockImplementation(() => mockMakePromise(createdOrderId));
const mockCancelOrderGuest = jest.fn();
const mockSubmitReview = jest
	.fn()
	.mockImplementation(() => mockMakePromise(null));

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getGuestOrder: mockGetGuestOrder,
			createOrder: mockCreateOrder,
			cancelOrderGuest: mockCancelOrderGuest,
			submitReview: mockSubmitReview,
		};
	});
});

describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
	});

	it('The class can be created successfully', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		expect(orderViewModel).toBeTruthy();
	});

	it('can retrive order from server', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		expect(requests.getGuestOrder).toHaveBeenCalled();
	});
	
	it('Initializing order to the order in the server', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		expect(
			orderViewModel.getOrder() != null &&
				orderViewModel.getOrder()?.id === order1.id
		).toBeTruthy();
	}); 

	it('Order doesnt exist when there is no order at server', async () => {
		mockGetGuestOrder.mockImplementation(() => new Promise((_resolve, reject) => reject({response: {status:404}})));
		
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		expect(
			orderViewModel.hasActiveOrder()
		).toBeFalsy();
	}); 
});


describe('create order tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockCreateOrder.mockClear();
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		let orderModel = OrderModel.getInstance();
		orderModel.removeOrder();
		orderModel.clearItemsToOrder();		
	});

	it('create order succes with items to order', async () => {
		mockGetGuestOrder.mockImplementation(() => new Promise((_resolve, reject) => reject({response: {status:404}})));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();

		orderViewModel.updateItemToOrder(item1,1)
		const resOrder = await orderViewModel.createOrder();
		expect(
			resOrder != null && (await resOrder).id === createdOrder.id
		).toBeTruthy();
	});

	it('create order fails when there is no items to order', async () => {
		mockGetGuestOrder.mockImplementation(() => new Promise((_resolve, reject) => reject({response: {status:404}})));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();

		expect(orderViewModel.hasActiveOrder()).toBeFalsy();
		await orderViewModel.createOrder()
		.then(() => expect(true).toBeFalsy())
		.catch(() => expect(orderViewModel.hasActiveOrder()).toBeFalsy());
	});

	it('create order fail when order exists', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();

		orderViewModel.updateItemToOrder(item1,1)
		await orderViewModel.createOrder()
		.then(()=> expect(true).toBeFalsy())
		.catch(() => expect(orderViewModel.hasActiveOrder()).toBeTruthy())
		
	}); 
});


describe('cancel order tests', () => {
	beforeEach(() => {

		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockCreateOrder.mockClear();
		mockCancelOrderGuest.mockClear();

		mockCancelOrderGuest.mockImplementation(
			() => new Promise<void>((resolve, _reject) => resolve())
		);
		let orderModel = OrderModel.getInstance();
		orderModel.removeOrder();
		orderModel.clearItemsToOrder();	
	});

	it('cancel order succes after creating order', async () => {
		mockGetGuestOrder.mockImplementation(() => new Promise((_resolve, reject) => reject({response: {status:404}})));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		orderViewModel.updateItemToOrder(item1,1);

		await orderViewModel.createOrder();
		expect(orderViewModel.hasActiveOrder()).toBeTruthy();
		await orderViewModel.cancelOrder()
		expect(orderViewModel.hasActiveOrder()).toBeFalsy();
	});

	it('cancel order fails when order doesnt exists', async () => {
		mockGetGuestOrder.mockImplementation(() => new Promise((_resolve, reject) => reject({response: {status:404}})));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		await orderViewModel.cancelOrder()
		.then(()=> expect(true).toBeFalsy())
		.catch(() => expect(orderViewModel.hasActiveOrder()).toBeFalsy() )
	});
	it('cancel order fails and order doesnt removed when order status isnt received', async () => {
		mockGetGuestOrder.mockImplementation(() =>mockMakePromise(orderAtServer));
		
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		orderViewModel.updateOrderStatus(orderAtServer.id,'in preparation')
		await orderViewModel.cancelOrder()
		.then(()=> expect(true).toBeFalsy())
		.catch(()=>expect(orderViewModel.hasActiveOrder()).toBeTruthy());
		expect(
			orderViewModel.getOrder() != null &&
				orderViewModel.getOrder()?.id === orderAtServer.id
		).toBeTruthy();
	});

	it('cancel order fails and order doesnt removed when received false response from server', async () => {
		mockGetGuestOrder.mockImplementation(() =>mockMakePromise(orderAtServer));
		mockCancelOrderGuest.mockImplementation(
			() => new Promise<void>((_, _reject) => _reject())
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.getOrderFromServer();
		await orderViewModel.cancelOrder()
		.then(()=> expect(true).toBeFalsy())
		.catch(()=>expect(orderViewModel.hasActiveOrder()).toBeTruthy());
		expect(
			orderViewModel.getOrder() != null &&
				orderViewModel.getOrder()?.id === orderAtServer.id
		).toBeTruthy();
	});
	
});

describe('update order status tests', () => {
	beforeEach(() => {
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockCreateOrder.mockClear();
		
		// mockGetGuestOrder.mockImplementation(() =>
		// 	mockMakePromise(orderAtServer)
		// );
		let orderModel = OrderModel.getInstance();
		orderModel.removeOrder();
		orderModel.clearItemsToOrder();	
	});

	it('update status sucess when order exists', async () => {
		mockGetGuestOrder.mockImplementation(() =>mockMakePromise(orderAtServer));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'in preparation');
		expect(
			orderViewModel.getOrder()?.status === 'in preparation'
		).toBeTruthy();
	});
	it('update status is ignored when order doesnt exists', async () => {
		mockGetGuestOrder.mockImplementation(
		() => new Promise((_resolve, reject) => reject()));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();

		orderViewModel.updateOrderStatus(orderAtServer.id, 'in preparation');
		expect(orderViewModel.getOrder() === null).toBeTruthy();
	});
});

describe('submit review tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockCreateOrder.mockClear();
		
		// mockGetGuestOrder.mockImplementation(() =>
		// 	mockMakePromise(orderAtServer)
		// );
		let orderModel = OrderModel.getInstance();
		orderModel.removeOrder();
		orderModel.clearItemsToOrder();	
	});

	it('submit review sucess and order removed when order status is delivered', async () => {
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'delivered');
		await orderViewModel
			.submitReview('good service', 5)
			.then(() => expect(orderViewModel.hasActiveOrder()).toBeFalsy())
			.catch(() => expect(false).toBeTruthy());
	});
	it('submit review fail when order doesnt exists', async () => {
		mockGetGuestOrder.mockImplementation(
			() => new Promise((_resolve, reject) => reject())
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		await orderViewModel
			.submitReview('good service', 5)
			.then(() => expect(false).toBeTruthy())
			.catch(() => expect(true).toBeTruthy());
	});
	it('submit review fail and ordered isnt removed when order status isnt arrived', async () => {
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'on the way');
		console.log("----- ", orderViewModel.hasActiveOrder())
		await orderViewModel
			.submitReview('good service', 5)
			.then(() => expect(false).toBeTruthy())
			.catch(() => expect(orderViewModel.hasActiveOrder()).toBeTruthy());
	});
});
