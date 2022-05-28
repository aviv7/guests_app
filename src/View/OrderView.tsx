import React, { useState } from 'react';
import {
	Alert,
	Button,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {ItemIDO, OrderID} from '../types';
import { Modal } from "../Components/Modal";
import { observer } from 'mobx-react';
import { OrderDetailsView } from './OrderDeatilsView';
import { RenderItem } from './ItemView';
import { ItemListView } from './ItemListView';

type OrderPageViewProps = {
  requestLocation: () => Promise<string>;
	SendOrderToServer: () => void;
	cancelOrder: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
  orderedItems: Record<string, number>;
  itemsToOrder: Record<string, number>;
  itemsMenu: ItemIDO[];
  onAddToCart: (item: ItemIDO, amount: number)=> void;
  orderPreparationTime: number;
  clearOrder:()=>void;
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
                  <View style={styles.modalGeneral}>
                    <Modal.Header title="Choose items - " />
                    <Modal.Body>
                        <SafeAreaView style={styles.modalBody}>
                          <ScrollView style={styles.scrollView}>
                              <ItemListView itemsMenu={props.itemsMenu} itemsToOrder={props.itemsToOrder} onAddToCart={props.onAddToCart} orderPreparationTime={props.orderPreparationTime}/>
                          </ScrollView>
                        </SafeAreaView>
                    </Modal.Body>
                    <Modal.Footer>
                      <View style={[styles.button, styles.modalFooter]}>
                        <Button title="submit order" onPress={() => {props.SendOrderToServer(); }} />
                        <View style={styles.space} />
                        <Button title="exit order" onPress={() => {props.clearOrder(); setVisible(false)}} />
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
    modalGeneral: {
      width: 300,
      height: 500,
      // alignItems: "center",
      // justifyContent: "center",
    },
    modalBody:{
      alignItems: "center",
      height:"70%",
    },
    modalFooter:{
      height:"100%"
    },
    scrollView: {
      backgroundColor: 'white',
      width: 300,
      marginHorizontal: 20,
    },
  });



  