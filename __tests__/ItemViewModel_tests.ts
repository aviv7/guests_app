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
			itemViewModel.getItems().length === 2 &&
			itemViewModel.getItems().at(0)?.id === items[0].id).toBeTruthy();
	});
	it('can retrive item by id', async () => {
		const itemViewModel = new ItemViewModel(new Requests());
        itemViewModel.syncItems();
        expect(JSON.stringify(itemViewModel.getItemById('1')) === JSON.stringify (items[0])).toBeTruthy();
	});
});
