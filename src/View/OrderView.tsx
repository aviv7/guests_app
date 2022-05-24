import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Button,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {OrderID} from '../types';
import { Modal } from "../Components/Modal";
import { observer } from 'mobx-react';

type OrderPageViewProps = {
  requestLocation: () => Promise<string>;
	SendOrderToServer: () => void;
	cancelOrder: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
  orderItems: Object | null | undefined;
};

export const OrderView = observer((props: OrderPageViewProps) => {
    const [visible, setVisible] = useState(false);


	if (props.hasActiveOrder) {
		return (
			<View>
				<Text>
					{' Order in progress...\n order id'} = {props.orderID}{' '}
				</Text>
				<Text>
					{'Order status: '} {props.orderStatus}
				</Text>
        <Text>
					{'Order items: '} {props.orderItems?.toString()}
				</Text>
				<ActivityIndicator size='large' color='#00ff00' />

				<Button
					title='Cancel Order'
					onPress={() => {
						props.cancelOrder(); setVisible(false);
					}}
				/>
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
                <View style={styles.modal}>
                <Modal.Header title="Choose items - " />
                <Modal.Body>
                    <Text> items list .. </Text>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.button}>
                    <Button title="submit order" onPress={ () => {props.SendOrderToServer(); }} />
                    </View>
                </Modal.Footer>
                </View>
            </Modal.Container>
            </Modal>
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



  