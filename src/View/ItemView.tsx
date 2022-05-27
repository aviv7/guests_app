import React, { useState } from 'react';
import { SafeAreaView, View, Button,FlatList, StyleSheet, Image, Text, StatusBar } from 'react-native';
import { ItemIDO } from '../types';


const Separator = () => (
  <View style={styles.separator} />
);


export const RenderItem = ({item, onAddToCart}:{item:ItemIDO, onAddToCart: (item: ItemIDO, amount: number)=> void}) => {
      const [amount, setAmount] = useState(0);
        return (
        <View
          style={{
            flexDirection: 'row',
            height: 100,
            padding: 10,
          }}>
          
          <View style={{ flex: 0.6 }}> 
              <Text style={styles.itemsText}> 
                {item.name}
                {`price - ${item.price}`}
                {`Preparation Time - ${item.preparationTime}`}
              </Text>
          </View>
          
          <View style={{ flex: 0.4 }}>
            <View style={styles.buttons}>
                <Button
                  title=" - "
                  color='red'
                  onPress={() => {
                        if(amount > 0) setAmount(amount - 1)
                    }}
                  disabled={amount <= 0 }
                />
                <Text style={styles.amountText}>{amount}</Text>
                <Button
                  color='red'
                  title=" + "
                  onPress={() => setAmount(amount + 1)}
               />

            </View>
            <View style={{  flex: 0.5 }} >
              <Button
                  title="Add to cart"
                  onPress={()=>onAddToCart(item,amount)}
               />
            </View>
          </View>
        </View>
        );
    }

const styles = StyleSheet.create({
 	itemsText: {
		fontFamily: 'Montserrat-Medium',
		fontSize: 15,
	},
  amountText: {
    fontFamily: 'Montserrat-Medium',
		fontSize: 25,
    textAlign: 'center',

  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
     flex: 0.5
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },})

