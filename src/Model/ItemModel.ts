import {makeAutoObservable} from 'mobx';
import {ItemIDO} from '../types';

export class ItemModel {
	private _items: ItemIDO[];

	private constructor() {
		this._items = [];
		makeAutoObservable(this);
	}
	static instance?: ItemModel;
	static getInstance(): ItemModel {
		if (!this.instance) {
			this.instance = new ItemModel();
		}
		return this.instance;
	}

	get items(): ItemIDO[] {
		return this._items;
	}

	set items(items: ItemIDO[]) {
		this._items = items;
	}

	getItemById(item_id: string): ItemIDO | undefined
	{
		let retVal = undefined;
		this._items.forEach(function (item: ItemIDO) {
			if(item.id == item_id)
				retVal = item;
		  });
		return retVal;
	}
}
