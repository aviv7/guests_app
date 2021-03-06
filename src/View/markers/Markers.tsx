import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { Marker } from '../../map';

const SIZE = 15;

const WaiterMarker: Marker = ({scale}) => {
	const styles = StyleSheet.create({
		point: {
			width: SIZE * scale,
			height: SIZE * scale,
			borderRadius: (SIZE * scale) / 2,
			backgroundColor: 'blue',
			position: 'absolute',

			borderColor: 'black',
			borderWidth: 2,
		},
		text: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			fontSize: 10
		},
	});

	return (
		<>
			<Text style={styles.text}>Waiter</Text>
			<View style={styles.point} />
		</>
	);
};



export const ActiveGuestMarker: Marker = ({scale}) => {
	const styles = StyleSheet.create({
		point: {
			width: SIZE * scale,
			height: SIZE * scale,
			borderRadius: (SIZE * scale) / 2,
			backgroundColor: 'green',
			position: 'absolute',

			borderColor: 'black',
			borderWidth: 2,
		},
		text: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			fontSize: 20,
		},
	});

	return (
		<>
			<Text style={styles.text}>You</Text>
			<View style={styles.point} />
		</>
	);
};

export const InActiveGuestMarker: Marker = ({scale}) => {
	const styles = StyleSheet.create({
		point: {
			width: SIZE * scale,
			height: SIZE * scale,
			borderRadius: (SIZE * scale) / 2,
			backgroundColor: 'grey',
			position: 'absolute',

			borderColor: 'black',
			borderWidth: 2,
		},
		text: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			fontSize: 15,
		},
	});

	return (
		<>
			<Text style={styles.text}>Location Off</Text>
			<View style={styles.point} />
		</>
	);
};


export default WaiterMarker;
