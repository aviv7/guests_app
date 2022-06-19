import {makeAutoObservable} from 'mobx';
import {Location, ItemIDO, Order, OrderID, OrderStatus, Waiter} from '../types';

export class OrderModel {
	private _order: Order | null;
	private _waiters: Waiter[];

	// items ids and amounts of the order being created by the guest
	private _itemsToOrder: Record<string, number>; 
	// items ids and amounts of the ordered order (if exists)
	private _orderedItems: Record<string, number>;
	// list of the items selected to order (amount > 0)
	private _itemsSelected: ItemIDO[];
	// preparation time of the entire order
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

	// adds the item to the order when amount > 0, removes the item when amount = 0
	updateItemToOrder(item: ItemIDO,amount:number){

		if(item.id in this._itemsToOrder)
		{
			if(amount == 0)
			{
				delete this._itemsToOrder[item.id]
				this._itemsSelected = this._itemsSelected.filter(selected_item => selected_item.id !== item.id)
				this.updatePreparationTime();
			}
			else
			{
				this._itemsToOrder[item.id] = amount;
			}
		}
		else
		{
			if(amount != 0)
			{
				this._itemsToOrder[item.id] = amount;
				this._itemsSelected.push(item);
				this.updatePreparationTime();
			}
		}	
	}
	private updatePreparationTime() : void{
		if(this._itemsSelected.length > 1)
		{
			this._orderPreparationTime = Math.max(... this._itemsSelected.map((item:ItemIDO)=>item.preparationTime))
		}
		else
		{
			if(this._itemsSelected.length == 1)
				this._orderPreparationTime = this._itemsSelected[0].preparationTime;
			else
				this._orderPreparationTime = 0;
		}
			
	}
	clearItemsToOrder(){
		this._itemsToOrder = {};
		this._itemsSelected = [];
		this._orderPreparationTime = 0;
	}

	removeOrder() {
		this._order = null;
		this._waiters = [];
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
		if (this._order != null) {
			const waiter = this._waiters.find(waiter => waiter.id === waiterId);
			if (waiter) {
				waiter.location = waiterLocation;
			} else {
				this._waiters.push({id: waiterId, location: waiterLocation});
			}
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

	get selectedItems(){
		return this._itemsSelected;
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

	get waiters(){
		return this._waiters;
	}
	get orderPreparationTime(){
		return this._orderPreparationTime;
	}
}
