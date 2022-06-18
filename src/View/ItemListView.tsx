import { observer } from "mobx-react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
              <Text key={name}>{'\t' + name} - {itemsToOrder[name]}{'\n '}</Text>
        )})
}
 
export const ItemListView = observer((props: ItemListViewProps) => {
  return (
     <View>
        {props.itemsMenu.map((item)=> <RenderItem key={item.id} item={item} onAddToCart={props.onAddToCart} />)}
        {/* <Text style={styles.largeText}>
          {'\tYour current order - \n'}
        </Text>
        <Text style={styles.largeText}> {create(props.itemsToOrder)}  </Text> */}
        
        <Text style={styles.largeText}>{'\tTotal Preparation time: '} {props.orderPreparationTime}</Text>
     </View>
  );
});

const styles = StyleSheet.create({
  largeText: {
   fontSize: 20,
   lineHeight: 30,
 },
})