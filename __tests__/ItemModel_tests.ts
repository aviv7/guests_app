import { ItemModel } from "../src/Model/ItemModel";
import { ItemIDO } from "../src/types";

let itemModel = ItemModel.getInstance();
let item_id1 = "item1"
let item_id2 = "item2"
let item_name1 = "Beer"
let item_name2 = "Bamba"

const items: ItemIDO[] = [
	{id: item_id1, name: item_name1, price: 10, preparationTime: 1},
	{id: item_id2, name: item_name2, price: 5, preparationTime: 1},
];
itemModel.items = items;

test('retrive currect item by id', () => {
	expect(itemModel.getItemById(item_id1)?.name == item_name1 &&
           itemModel.getItemById(item_id2)?.name == item_name2).toBeTruthy()
})

test('retrive undefined for non existing id', () => {
	expect(itemModel.getItemById('123') == undefined).toBeTruthy()
})

