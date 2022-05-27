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
              <Text key={name}>{name} - {orderedItems[name]}{' '}</Text>
        )})
    
}
  
export const OrderDetailsView = observer((props: OrderDetailsViewProps) => {
    return (
        <View>
            <Text>
                {' Order in progress...\n order id'} = {props.orderID}{' '}
            </Text>
            <Text>
                {'Order status: '} {props.orderStatus}
            </Text>
            <Text>
                {'Order items: '}  
            </Text>
            <View>
                {create(props.orderedItems)}
            </View>
            <ActivityIndicator size='large' color='#00ff00' />
        </View>
    );
});



const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    text: {
      fontSize: 16,
      fontWeight: "400",
      textAlign: "center",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
    input: {
      paddingTop: 10,
      borderColor: "grey",
      borderBottomWidth: 2,
    },
    button: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
    },
    modal: {
      width: "100%",
      height: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
  });



  