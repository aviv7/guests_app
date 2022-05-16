import React, { useState } from 'react';
import {ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {OrderID, OrderStatus} from '../types';
import {observer} from 'mobx-react-lite';
import { Modal } from '../Components/Modal';
import TapRating from 'react-native-ratings/dist/TapRating';
import MapScreenController from '../ViewController/MapScreenController';
import { Col, Row, Grid } from "react-native-easy-grid";

type MainPageViewProps = {
	sendOrderToServer: () => void;
	cancelOrder: () => void;
	submitReview: (openText: string, rating:number) => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
	isLocationApproved: boolean;
};
//const OrdersListView = observer((props: OrdersViewProps) => {

export const MainPage = observer((props: MainPageViewProps) => {

	function ratingCompleted(rating: number) {
		setRatingValue(rating);
	}
	
	const [visible, setVisible] = useState(false);
	const [ratingValue, setRatingValue] = useState(1);
	const [openText, setOpenText] = useState('')


	if (props.hasActiveOrder) 
	{
		if(props.orderStatus == 'delivered')
		{
			return(
				<View style={styles.container}>
				<Text style={styles.title}>Your order has arrived!</Text>
				<Button title="Submit Review" onPress={ () => setVisible(true)} />
				<View style={styles.separator} />
					<Modal isVisible={visible}>
					<Modal.Container>
						<View style={styles.modal}>
						<Modal.Header title="Rate our service :)" />
						<Modal.Body>
						<TapRating
							count={5}
							reviews = {["1","2","3","4","5"]}
							showRating={true}
							size={40}
							onFinishRating={ratingCompleted}
							/>
							<TextInput 
							style={styles.input}
							placeholder="Additional thoughts?.."
							onChangeText={feedback => setOpenText(feedback)}
							/>
						</Modal.Body>
						<Modal.Footer>
							<View style={styles.button}>
							<Button title="סיים" onPress={() => {props.submitReview(openText,ratingValue); setVisible(false)}} />
							</View>
						</Modal.Footer>
						</View>
					</Modal.Container>
					</Modal>
				</View>);
		}
		return (
			<SafeAreaView style={styles.areaView}>
				<Grid>
					<Row size={10}>			
					<Text style={styles.text}>
						{'\t Order in progress...\n \t Order status:'} {props.orderStatus}
					</Text>
					</Row>
					<Row size={10}>
						<View style={styles.areaView}>
							<ActivityIndicator size='large' color='#00ff00' />
						</View>
					</Row>
					<Row size={10}>
						<View style={styles.button}> 
							{props.orderStatus === 'received' ? (
								<Button title='Cancel Order' onPress={props.cancelOrder}/>  
							) : (
								<Text style={styles.text}> {'\t * cannot cancel order after preparation'} </Text>
							)}
						</View>
					</Row>	
					<Row size={10}></Row>
					<Row size={70}>
					<MapScreenController/>
					</Row>
				</Grid>
			</SafeAreaView>
		);
	}
	else{
		return(
			<SafeAreaView style={styles.areaView}>		 
				<Button title='Order' onPress={props.sendOrderToServer} /> 
				<MapScreenController/>
			</SafeAreaView>
		);
	}
	
			
});



const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
	areaView:{
		justifyContent: 'center', //Centered vertically
		padding:10,
		alignItems: 'center', // Centered horizontally
		flex:1
	},
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
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
	  height:"100%"
    },
    modal: {
      width: "100%",
      height: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

