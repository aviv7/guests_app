import React, {LegacyRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import MapMarkersController from '../ViewController/MapMarkersController';
import OrderController from '../ViewController/OrderController';
import WarningsController from '../ViewController/WarningsController';
//import NotificationIcon from './NotificationIcon';

type MapScreenViewProps = {
	openBottomSheet: () => void;
	refBottomSheet: LegacyRef<RBSheet> | undefined;
	onOrdersClose: () => void;
	username: string;
};
export default function MapScreenView(props: MapScreenViewProps): JSX.Element {
	return (
		<View style={styles.screen} testID='homeScreen'>
			<Text style={styles.usernameStyle}> {'Welcome Back ' + props.username + '!'}</Text>
				<View>
			 		<WarningsController />
				</View>

			<MapMarkersController style={styles.map} />
			<TouchableOpacity
				style={styles.openDrawerButton}
				onPress={props.openBottomSheet}>
				<View style={styles.textWithIcon}>
					<Text style={styles.openDrawerButtonText}>Your Order</Text>
				</View>
			</TouchableOpacity>
			<RBSheet
				ref={props.refBottomSheet}
			//	onClose={props.onOrdersClose}
				closeOnDragDown={true}
				closeOnPressMask={false}
				dragFromTopOnly={false}
				height={550}
				customStyles={{
					wrapper: {
						backgroundColor: 'transparent',
					},
					draggableIcon: {
						backgroundColor: '#000',
					},
					container: {
						backgroundColor: '#dfeef5',
					},
				}}>
				<OrderController />
			</RBSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		backgroundColor: '#99cbf2',
		borderBottomColor: '#99cbf290',
		borderBottomWidth: 1,
		padding: 10,
	},
	title: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
	},
	location: {
		fontFamily: 'Montserrat-SemiBold',
	},
	screen: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
	},
	map: {
		flexGrow: 1,
		zIndex: -1,
	},
	openDrawerButton: {
		borderTopColor: '#9fb7c9',
		borderTopWidth: 1,
		padding: 10,
		paddingBottom: 20,
		backgroundColor: '#99cbf2',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	openDrawerButtonText: {
		fontSize: 18,
		fontFamily: 'Montserrat-Medium',
	},
	textWithIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	usernameStyle:{
		fontSize: 18,
		fontFamily: 'Montserrat-Medium',
		textAlign: 'center',
		backgroundColor: '#99cbf2',

	},
});


