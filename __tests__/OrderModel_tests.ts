import { OrderModel } from "../src/Model/OrderModel";
import {Location, ItemIDO } from "../src/types";

let orderModel = OrderModel.getInstance();
let item_id1 = "item1"
let item_id2 = "item2"


let item1:ItemIDO =	{id: item_id1, name: 'Beer', price: 10, preparationTime: 1};
let item2:ItemIDO = {id: item_id2, name: 'Bamba', price: 5, preparationTime: 5};


describe('tests', () => {

    beforeEach(() => {
        orderModel.clearItemsToOrder();   
        orderModel.removeOrder(); 
    });

	it('items can be added to order', () => {
        orderModel.updateItemToOrder(item1, 2);
        orderModel.updateItemToOrder(item2,3);
        expect(item_id1 in orderModel.itemsToOrder && 
               orderModel.itemsToOrder[item_id1] == 2 &&
               item_id2 in orderModel.itemsToOrder && 
               orderModel.itemsToOrder[item_id2] == 3).toBeTruthy();
    })
    
    it('item amount can be updated', () => {
        orderModel.updateItemToOrder(item1, 2);
        orderModel.updateItemToOrder(item2,3);
        orderModel.updateItemToOrder(item1,4);
        expect(orderModel.itemsToOrder[item_id1] == 4 &&
               orderModel.itemsToOrder[item_id2] == 3).toBeTruthy();
    })
    
    it('item amount zero removes only updated item', () => {
        orderModel.updateItemToOrder(item1, 2);
        orderModel.updateItemToOrder(item2, 2);
        expect(item_id1 in orderModel.itemsToOrder).toBeTruthy();
        expect(item_id2 in orderModel.itemsToOrder).toBeTruthy();
        orderModel.updateItemToOrder(item1,0);
        expect(item_id1 in orderModel.itemsToOrder).toBeFalsy();
        expect(item_id2 in orderModel.itemsToOrder).toBeTruthy();

    })
    
    
    it('items to order can be cleared', () => {
        orderModel.updateItemToOrder(item1, 2);
        orderModel.updateItemToOrder(item2, 2);
        expect(Object.keys(orderModel.itemsToOrder).length == 2).toBeTruthy();
        orderModel.clearItemsToOrder();
        expect(Object.keys(orderModel.itemsToOrder).length == 0).toBeTruthy();
    })


    it('order preparation time updates on adding item to order' ,() =>{
        orderModel.updateItemToOrder(item1, 2);
        expect(orderModel.orderPreparationTime == item1.preparationTime).toBeTruthy();
        orderModel.updateItemToOrder(item2, 2);
        expect(orderModel.orderPreparationTime == Math.max(item1.preparationTime,item2.preparationTime)).toBeTruthy();


    })
    it('order preparation time updates on removing item from order' ,() =>{
        orderModel.updateItemToOrder(item1, 2);
        expect(orderModel.orderPreparationTime == item1.preparationTime).toBeTruthy();
        orderModel.updateItemToOrder(item2, 2);
        expect(orderModel.orderPreparationTime == Math.max(item1.preparationTime,item2.preparationTime)).toBeTruthy();
        orderModel.updateItemToOrder(item2, 0);
        expect(orderModel.orderPreparationTime == item1.preparationTime).toBeTruthy();
        orderModel.updateItemToOrder(item1, 0);
        expect(orderModel.orderPreparationTime == 0).toBeTruthy();
        
    })

    it('location of a new waiter can be upadted' ,() =>{
        orderModel.order = {id:'123', items: {[item_id1]: 2, [item_id2]: 1}, status:'received'}
        let waiterId = '123'
        orderModel.updateWaiterLocation(waiterId, {x:0.5,y:0.5, mapID: '1'})
        expect(orderModel.waiters.map(waiter => waiter.id).includes(waiterId)).toBeTruthy()
    })

    it('location of a waiter can be upadted few times' ,() =>{
        orderModel.order = {id:'123', items: {[item_id1]: 2, [item_id2]: 1}, status:'received'}
        let waiterId = '123'
        let waiterLocation = {x:0.5,y:0.5, mapID: '1'}
        orderModel.updateWaiterLocation(waiterId, waiterLocation)
        expect(JSON.stringify(orderModel.waiters.filter(waiter => waiter.id == waiterId)[0].location) === JSON.stringify(waiterLocation)).toBeTruthy()
        let newWaiterLocation = {x:0.6,y:0.5, mapID: '1'}
        orderModel.updateWaiterLocation(waiterId, newWaiterLocation)
        expect(JSON.stringify(orderModel.waiters.filter(waiter => waiter.id == waiterId)[0].location) === JSON.stringify(newWaiterLocation)).toBeTruthy()
    })

    it('location of a new waiter ignored when no order exists' ,() =>{
        let waiterId = '123'
        orderModel.updateWaiterLocation(waiterId, {x:0.5,y:0.5, mapID: '1'})
        expect(orderModel.waiters.map(waiter => waiter.id).includes(waiterId)).toBeFalsy()
    })
   

});

