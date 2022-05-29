import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {OrderID} from '../types';
import { observer } from 'mobx-react';

type OrderDetailsViewProps = {
	orderID: OrderID;
	orderStatus: string;
  orderedItems: Record<string, number>;
};

function create(orderedItems: Record<string, number>)
{
   
    return Object.keys(orderedItems)
    .map(name => {
        return (
              <Text key={name} style={styles.largeText}>{name} - {orderedItems[name]}{'\n'}</Text>
        )})
    
}
  
export const OrderDetailsView = observer((props: OrderDetailsViewProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {'\nOrder in progress ...\nOrder id'} = {props.orderID.substring(0,10)}{'\n'}              
            </Text>
            <Text style={styles.boldText}>
                {'Order status: '} {props.orderStatus} {'\n'}
            </Text>
            <Text style={styles.largeText}>
                {'Ordered items:\n'}  
            </Text>
            {create(props.orderedItems)}
            <ActivityIndicator size='large' color='#00ff00' />
        </View>
    );
});



const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    title: {
      color: 'darkgreen',
      fontSize: 20,
    },
    largeText: {
      fontSize: 20,
      lineHeight: 25,
    },
    boldText:{
      fontSize: 20,
      lineHeight: 20,
      fontWeight: "bold"
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
  });



  