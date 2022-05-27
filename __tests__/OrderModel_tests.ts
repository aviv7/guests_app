import { OrderModel } from "../src/Model/OrderModel";

let orderModel = OrderModel.getInstance();
let item_id1 = "item1"
let item_id2 = "item2"


beforeEach(() => {
    orderModel.clearItemsToOrder();    
});

test('items can be added to order', () => {
	orderModel.updateItemToOrder(item_id1, 2);
    orderModel.updateItemToOrder(item_id2,3);
    expect(item_id1 in orderModel.itemsToOrder && 
           orderModel.itemsToOrder[item_id1] == 2 &&
           item_id2 in orderModel.itemsToOrder && 
           orderModel.itemsToOrder[item_id2] == 3).toBeTruthy();
})

test('item amount can be updated', () => {
	orderModel.updateItemToOrder(item_id1, 2);
    orderModel.updateItemToOrder(item_id2,3);
    orderModel.updateItemToOrder(item_id1,4);
    expect(orderModel.itemsToOrder[item_id1] == 4 &&
           orderModel.itemsToOrder[item_id2] == 3).toBeTruthy();
})

test('item amount zero removes item', () => {
	orderModel.updateItemToOrder(item_id1, 2);
    expect(item_id1 in orderModel.itemsToOrder).toBeTruthy();
    orderModel.updateItemToOrder(item_id1,0);
    expect(item_id1 in orderModel.itemsToOrder).toBeFalsy();
})

test('items to order can be cleared', () => {
	orderModel.updateItemToOrder(item_id1, 2);
    orderModel.updateItemToOrder(item_id2, 2);
    expect(Object.keys(orderModel.itemsToOrder).length == 2).toBeTruthy();
    orderModel.clearItemsToOrder();
    expect(Object.keys(orderModel.itemsToOrder).length == 0).toBeTruthy();
})