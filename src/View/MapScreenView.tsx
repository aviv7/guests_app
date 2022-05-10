import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import MapMarkersController from '../ViewController/MapMarkersController';


type MapScreenViewProps = {
	openBottomSheet: () => void;
	refBottomSheet: React.MutableRefObject<unknown>;
};
export default function MapScreenView(props: MapScreenViewProps): JSX.Element {
	return (
		<>
			<View style={styles.screen} testID='homeScreen'>
				<MapMarkersController style={styles.map} />
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	map: {
		height: '95%',
	},
	openDrawerButton: {
		flexGrow: 1,
		// height: 50,
		// bottom: 0,
		// position: 'relative',
	},
});
