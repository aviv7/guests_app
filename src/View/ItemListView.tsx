import React from 'react';
import { SafeAreaView, View, Button,FlatList, StyleSheet, Image, Text, StatusBar } from 'react-native';
import { ItemIDO } from '../types';
import RenderItem from './itemView'

// const items = [
//   {
//     id: 1,
//     name: 'Hamurger(300g)',
//     price: 100,
//     preperationTime: 1,
//   },
//   {
//     id: 2,
//     name: 'Pizza Mozzarella',
//     price: 100,
//     preperationTime: 1,
//   },
//   {
//     id: 3,
//     name: 'Vanilla Milkshake',
//     price: 100,
//     preperationTime: 1,
//   },
// ];


const ItemListView = ({onAddToCart , onOrder, items= []}:
                      {onAddToCart: (item: ItemIDO, amount: number)=> void, onOrder:()=>void, items:ItemIDO[]}) => {
   return (
      <View> 
        {items.map((item)=> <RenderItem item={item} onAddToCart={onAddToCart} />)}
        {/* <Button title={'Order'} onPress={onOrder} disabled={items.length === 0}/>  */}
      </View>
  );
};

export default ItemListView; 