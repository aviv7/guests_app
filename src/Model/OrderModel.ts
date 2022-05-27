import {makeAutoObservable} from 'mobx';
import Location, {ItemIDO, Order, OrderID, OrderStatus, Waiter} from '../types';

export class OrderModel {
	private _order: Order | null;
	private _waiters: Waiter[];
	// private _itemsToOrder: Map<string, Number>;
	// private _orderedItems: Map<string, Number>;

	private _itemsToOrder: Record<string, number>;
	private _orderedItems: Record<string, number>;
	
	private _itemsSelected: ItemIDO[];
	private _orderPreparationTime: number;

	private constructor() {
		this._order = null;
		this._waiters = [];
		this._itemsToOrder = {};
		this._orderedItems =  {};
		this._orderPreparationTime = 0;
		this._itemsSelected = []
		makeAutoObservable(this);
	}
	static instance?: OrderModel;
	static getInstance(): OrderModel {
		if (!this.instance) {
			this.instance = new OrderModel();
		}
		return this.instance;
	}

	updateItemToOrder(item: ItemIDO,amount:number){
		if(amount == 0)
		{
			if(item.id in this._itemsToOrder)
			{
				delete this._itemsToOrder[item.id]
			}
		}
		else
			this._itemsToOrder[item.id] = amount;

		this.updatePreparationTime();
		
	}
	private updatePreparationTime() : void{
	
	}
	clearItemsToOrder(){
		// this._itemsToOrder.clear();
		this._itemsToOrder = {};
		this._itemsSelected = [];
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

	get orderedItems(): Record<string, number>{
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

	get orderPreparationTime(){
		return this._orderPreparationTime;
	}
}
