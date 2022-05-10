import React from 'react';
import {
	View,
	Image,
	StyleProp,
	ViewStyle,
	StyleSheet,
	GestureResponderHandlers,
} from 'react-native';
import { PointMarker } from '../map';

type MyZoomableImageProps = {
	imageWidth: number;
	imageHeight: number;
	imageURL: string;
	style?: StyleProp<ViewStyle>;
	pointOfInterest: PointMarker;
	zoom: number;
	top: number;
	left: number;
	panHandlers: GestureResponderHandlers;
};

export default function MyZoomableImage(props: MyZoomableImageProps) {
	const styles = StyleSheet.create({
		map: {
			width: props.imageWidth * props.zoom,
			height: props.imageHeight * props.zoom,
		},
		container: {
			position: 'absolute',
			top: props.top,
			left: props.left,
			zIndex: -1,
		},
		marker: {
			position: 'absolute',
			zIndex: 1,
		},
	});

	return (
		<View style={props.style} {...props.panHandlers}>
			<View style={styles.container}>	
				<View
					style={[
						styles.marker,
						{
							top:
								props.pointOfInterest.point.location.y *
								props.imageHeight *
								props.zoom,
							left:
								props.pointOfInterest.point.location.x *
								props.imageWidth *
								props.zoom,
						},
					]}>
					<props.pointOfInterest.marker name={props.pointOfInterest.point.name} scale={props.zoom} />
				</View>
				<Image
					style={styles.map}
					source={{
						uri: props.imageURL,
					}}
				/>
			</View>
		</View>
	);
}
