import {ItemModel} from '../Model/ItemModel';
import Requests from '../Networking/requests';
import { ItemIDO } from '../types';

export default class ItemsViewModel {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.requests = requests;
		this.itemsModel = ItemModel.getInstance();
	}

	syncItems(): Promise<void> {
		return this.requests.getItems().then(items => {
			this.itemsModel.items = items;
		});
	}

	getItems() {
		return this.itemsModel.items;
	}

	getItemById(item_id: string): ItemIDO | undefined
	{
		return this.itemsModel.getItemById(item_id);
	}
}
