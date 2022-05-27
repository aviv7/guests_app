import { observer } from "mobx-react";
import React from "react";
import { Text, View } from "react-native";
import { ItemIDO } from "../types";
import { RenderItem } from "./ItemView";

type ItemListViewProps = {
  itemsMenu: ItemIDO[],
  itemsToOrder: Record<string, number>,
  onAddToCart: (item: ItemIDO, amount: number)=> void
  orderPreparationTime: number
}

function create(itemsToOrder: Record<string, number>)
{
    return Object.keys(itemsToOrder)
    .map(name => {
        return (
              <Text key={name}>{name} - {itemsToOrder[name]}{' '}</Text>
        )})
}
 
export const ItemListView = observer((props: ItemListViewProps) => {
  return (
     <View>
        {props.itemsMenu.map((item)=> <RenderItem key={item.id} item={item} onAddToCart={props.onAddToCart} />)}
        <Text>
          {'Your current order - \n'}
        </Text>
        {create(props.itemsToOrder)}
        <Text>{'Preparation time = '} {props.orderPreparationTime}</Text>
     </View>
  );
});