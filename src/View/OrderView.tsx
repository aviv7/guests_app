/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState} from 'react';
import {
	Alert,
	Button,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {ItemIDO, OrderID} from '../types';
import {Modal} from '../Components/Modal';
import {observer} from 'mobx-react';
import {OrderDetailsView} from './OrderDeatilsView';
import {RenderItem} from './ItemView';
import {ItemListView} from './ItemListView';
import TapRating from 'react-native-ratings/dist/TapRating';

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
	onAddToCart: (item: ItemIDO, amount: number) => void;
	orderPreparationTime: number;
	clearOrder: () => void;
	submitReview: (openText: string, rating: number) => void;
	removeFinishedOrder: () => void;
};

export const OrderView = observer((props: OrderPageViewProps) => {
	function ratingCompleted(rating: number) {
		setRatingValue(rating);
	}
	const [ratingValue, setRatingValue] = useState(3);
	const [openText, setOpenText] = useState('');

	const [itemsModalVisible, setItemsModalVisible] = useState(false);
	const [reviewModalVisible, setReviewModalVisible] = useState(false);

	if (props.hasActiveOrder) {
		if (props.orderStatus === 'delivered') { 
			/* review page */
			return (
				<View style={styles.container}>
					<Text style={styles.title}>Your order has arrived!</Text>
					<Button
						title='Submit Review'
						onPress={() => setReviewModalVisible(true)}
					/>
					<View style={styles.separator} />
					<Modal isVisible={reviewModalVisible}>
						<Modal.Container>
							<View style={styles.reviewModal}>
								<Modal.Header title='Rate our service :)' />
								<Modal.Body>
									<TapRating
										count={5}
										reviews={['1', '2', '3', '4', '5']}
										showRating={true}
										size={40}
										onFinishRating={ratingCompleted}
									/>
									<TextInput
										style={styles.input}
										placeholder='Additional thoughts?..'
										onChangeText={feedback =>
											setOpenText(feedback)
										}
									/>
								</Modal.Body>
								<Modal.Footer>
									<View style={styles.button}>
										<Button
											title='Submit Review'
											onPress={() => {
												props.submitReview(
													openText,
													ratingValue
												);
												setReviewModalVisible(false);
											}}
										/>
										<View style={styles.space} />
										<Button
											title='Exit Review'
											onPress={() => {
												props.removeFinishedOrder();
												setReviewModalVisible(false);
											}}
										/>
									</View>
								</Modal.Footer>
							</View>
						</Modal.Container>
					</Modal>
				</View>
			);
		}
		/* there is an active order and its status isnt 'delivered' yet */
		return (
			<View>
				<Button
					title='Cancel Order'
					onPress={() => {
						props.cancelOrder();
					}}
				/>
				<OrderDetailsView
					orderID={props.orderID}
					orderStatus={props.orderStatus}
					orderedItems={props.orderedItems}
				/>
			</View>
		);
	}
	/* if there is no active order */
	return (
		<View>
			<Text style={styles.largeText}>
				{' '}
				You currently have no active order{' '}
			</Text>
			<Button
				title='Create Order'
				onPress={() =>
					props
						.requestLocation()
						.then(() => setItemsModalVisible(true))
						.catch(() =>
							Alert.alert('Create order failed', 
							'You must have valid location in order to create an order'))
				}
			/>
			<View style={styles.separator} />
			{/* Items Modal is the floating window for creating an order */}
			<Modal isVisible={itemsModalVisible}>
				<Modal.Container>
					<View style={styles.modalGeneral}>
						<Modal.Header title='Choose items to order ' />
						<Modal.Body>
							<SafeAreaView style={styles.modalBody}>
								<ScrollView style={styles.scrollView}>
									<ItemListView
										itemsMenu={props.itemsMenu}
										itemsToOrder={props.itemsToOrder}
										onAddToCart={props.onAddToCart}
										orderPreparationTime={
											props.orderPreparationTime
										}
									/>
								</ScrollView>
							</SafeAreaView>
						</Modal.Body>
						<Modal.Footer>
							<View style={[styles.button, styles.modalFooter]}>
								<Button
									title='Submit Order'
									onPress={() => {
										props.SendOrderToServer();
									}}/>
								<View style={styles.space} />
								<Button
									title='Exit Order'
									onPress={() => {
										props.clearOrder();
										setItemsModalVisible(false);
									}}
								/>
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
		width: 20, 
		height: 20,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	largeText: {
		fontSize: 20,
		lineHeight: 30,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	input: {
		paddingTop: 10,
		borderColor: 'grey',
		borderBottomWidth: 2,
	},
	button: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
	},
	reviewModal: {
		width: '100%',
		height: '90%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalGeneral: {
		width: 300,
		height: 580,
		// alignItems: "center",
		// justifyContent: "center",
	},
	modalBody: {
		alignItems: 'center',
		height: '70%',
	},
	modalFooter: {
		height: '100%',
	},
	scrollView: {
		backgroundColor: 'white',
		width: 300,
		marginHorizontal: 20,
	},
});
