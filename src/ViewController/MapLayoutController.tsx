import React, {useContext, useState} from 'react';
import {Image, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

import { MapsContext } from '../contexts';
import { PointMarker } from '../map';
import MapView from '../View/MapView';

type MapLayoutProps = {
	style?: StyleProp<ViewStyle>;
	marker: PointMarker | null;
};

export default function MapLayoutController({style, marker}: MapLayoutProps) {
	const mapViewModel = useContext(MapsContext);
	const imageURL = mapViewModel.getMapDetails().imageURL;

	const [imageWidth, setImageWidth] = useState<number | undefined>();
	const [imageHeight, setImageHeight] = useState<number | undefined>();
	const [width, setWidth] = useState<number | undefined>();
	const [height, setHeight] = useState<number | undefined>();

	Image.getSize(imageURL, (width, height) => {
		setImageWidth(width);
		setImageHeight(height);
	});

	const onLayout = (event: LayoutChangeEvent) => {
		// TO FIX 
		// const {height, width} = event.nativeEvent.layout;
		setHeight(200);
		setWidth(200);
	};

	const props = {
		style,
		onLayout,
		imageWidth,
		imageHeight,
		width,
		height,
		marker,
		imageURL,
	};

	return <MapView {...props} />;
}
