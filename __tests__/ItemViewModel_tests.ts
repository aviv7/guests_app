import {makePromise as mockMakePromise} from '../src/PromiseUtils';
import Requests from '../src/Networking/requests';
import { ItemIDO } from '../src/types';
import ItemViewModel from '../src/ViewModel/ItemViewModel';

const items: ItemIDO[] = [
	{id: '1', name: 'Beer', price: 10, preparationTime: 1},
	{id: '2', name: 'Bamba', price: 5, preparationTime: 1},
];

beforeAll(() => {
	jest.spyOn(Requests.prototype, 'getItems').mockImplementation(() =>
		mockMakePromise(items)
	);
});

afterAll(() => {
	jest.restoreAllMocks();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemViewModel(requests);
		expect(itemViewModel).toBeTruthy();
	});

	test('Initializing items', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemViewModel(requests);
		await itemViewModel.syncItems();
		expect(
			itemViewModel.getItems() !== null &&
				itemViewModel.getItems().length === 2
		).toBeTruthy();
	});
});

// const mockGetMyOrders = jest
// 	.fn()
// 	.mockImplementation(() => mockMakePromise(order1));

// const requestsMock = jest.mock('../src/networking/Requests', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 			getMyOrders: () => mockGetMyOrders

// 			// getGuestLocation: () =>
// 			// 	mockMakePromise<Location>(mockGuestLocation),
// 			// orderArrived: () => {},
// 			// login: () => mockMakePromise('id'),
// 		};
// 	});
// });
