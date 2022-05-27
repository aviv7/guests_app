import {makeAutoObservable} from 'mobx';
import Location, {Order, OrderID, OrderStatus, Waiter} from '../types';

export class OrderModel {
	private _order: Order | null;
	private _waiters: Waiter[];
	// private _itemsToOrder: Map<string, Number>;
	// private _orderedItems: Map<string, Number>;

	private _itemsToOrder: Record<string, number>;
	private _orderedItems: Record<string, number>;


	private constructor() {
		this._order = null;
		this._waiters = [];
		this._itemsToOrder = {};
		this._orderedItems =  {};
		makeAutoObservable(this);
	}
	static instance?: OrderModel;
	static getInstance(): OrderModel {
		if (!this.instance) {
			this.instance = new OrderModel();
		}
		return this.instance;
	}

	updateItemToOrder(item_id: string,amount:number){
		if(amount == 0)
		{
			if(item_id in this._itemsToOrder)
				delete this._itemsToOrder[item_id]
		}
		else
			this._itemsToOrder[item_id] = amount;
	}
	clearItemsToOrder(){
		// this._itemsToOrder.clear();
		this._itemsToOrder = {};
	}

	removeOrder() {
		this._order = null;
		this._waiters = [];
		// this._orderedItems.clear();
		this._orderedItems = {};
	}

	updateOrderStatus(orderID: OrderID, status: OrderStatus) {
		if (this._order != null && this._order?.id === orderID) {
			if(status !== 'canceled')
				this._order.status = status;
			else
				this.removeOrder();
		}
	}

	updateWaiterLocation(waiterId: string, waiterLocation: Location) {
		const waiter = this._waiters.find(waiter => waiter.id === waiterId);
		if (waiter) {
			waiter.location = waiterLocation;
		} else {
			this._waiters.push({id: waiterId, location: waiterLocation});
		}
	}

	getWaitersLocations() {
		return this._waiters.map(waiter => waiter.location);
	}
	getOrderId() {
		return this.order != null ? this.order.id : '';
	}
	getOrderStatus(): string {
		return this._order != null ? this._order.status : '';
	}
	hasActiveOrder(): boolean {
		return this._order != null;
	}

	get orderedItems(){
		return this._orderedItems;
	}
	set orderedItems(items: Record<string, number>){
		this._orderedItems = items;
	}

	get itemsToOrder(){
		return this._itemsToOrder;
	}

	get order() {
		return this._order;
	}

	set order(order: Order | null) {
		this._order = order;
	}
}
