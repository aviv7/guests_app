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
                {'\t' + item.name}
                {`\n\tprice - ${item.price}`}
                {`\n\tPreparation Time - ${item.preparationTime}`}
              </Text>
          </View>
          
          <View style={{ flex: 0.4 }}>
            <View style={styles.buttons}>
                <Button
                  title=" - "
                  color='turquoise'
                  onPress={() => {
                        if(amount > 0) 
                        {
                          const newAmount = amount - 1;
                          setAmount(newAmount)
                          onAddToCart(item,newAmount)
                        }
                    }}
                  disabled={amount <= 0 }
                />
                <Text style={styles.amountText}>{amount}</Text>
                <Button
                  color='turquoise'
                  title=" + "
                  onPress={() => {const newAmount = amount + 1;
                                  setAmount(newAmount);  
                                  onAddToCart(item,newAmount)}}
               />

            </View>
            <View style={styles.updateButtons} >
              {/* <Button
                  title="update"
                  onPress={()=>onAddToCart(item,amount)}
               /> */}
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
    //borderRadius: 30,
    padding: 5,
    flex: 0.5
  },
  updateButtons:{
    flex:0.5,
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },})

