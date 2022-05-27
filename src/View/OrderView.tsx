import React, { useState } from 'react';
import {
	Alert,
	Button,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {ItemIDO, OrderID} from '../types';
import { Modal } from "../Components/Modal";
import { observer } from 'mobx-react';
import { OrderDetailsView } from './OrderDeatilsView';
import { RenderItem } from './ItemView';

type OrderPageViewProps = {
  requestLocation: () => Promise<string>;
	SendOrderToServer: () => void;
	cancelOrder: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
  orderedItems: Record<string, number>;
  itemsMenu: ItemIDO[];
  onAddToCart: (item: ItemIDO, amount: number)=> void
};

export const OrderView = observer((props: OrderPageViewProps) => {
    const [visible, setVisible] = useState(false);


	if (props.hasActiveOrder) {
		return (
      <View>
        <Button
          title='Cancel Order'
          onPress={() => {
            props.cancelOrder(); 
          } } />
          <OrderDetailsView orderID={props.orderID} orderStatus={props.orderStatus} orderedItems={props.orderedItems} />
      </View>
		);
	}
	return (
        <View> 
            <Text> You currently have no active order </Text>
            <Button title="Create Order" onPress={() => 
                                                  props.requestLocation()
                                                  .then(() => setVisible(true))
                                                  .catch(() => Alert.alert("You must approve location for creating an order"))} />
            <View style={styles.separator} />
            <Modal isVisible={visible}>
            <Modal.Container>
                <View>
                <Modal.Header title="Choose items - " />
                <Modal.Body>
                   <View>
                      {/* {props.itemsMenu.map((item)=> <RenderItem key={item.id} item={item} onAddToCart={props.onAddToCart} />)} */}
                      {/* <Button title={'Order'} onPress={onOrder} disabled={items.length === 0}/>  */}
                  </View>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.button}>
                      <Button title="submit order" onPress={() => {props.SendOrderToServer(); }} />
                      <View style={styles.space} />
                      <Button title="exit order" onPress={() => {setVisible(false)}} />
                    </View>
                </Modal.Footer>
                </View>
            </Modal.Container>
            </Modal>
        </View>
	);
});



const styles = StyleSheet.create({
  space: {
    width: 20, // or whatever size you need
    height: 20,
  },
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
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });



  