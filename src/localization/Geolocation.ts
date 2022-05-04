import Location from '../types';
import GeolocationAdapter from './GeolocationAdapter';

import {ILocationService} from './ILocationService';
import {Corners, GPS} from './location';
import LocationMap from './Map';

export default class Geolocation implements ILocationService {
	private geolocationAdapter: GeolocationAdapter;
	private map: LocationMap;

	constructor(corners: Corners) {
		this.map = new LocationMap(corners);
		this.geolocationAdapter = new GeolocationAdapter();
	}

	private translateFunction(successCallback: (location: Location) => void) {
		return (location: GPS) => {
			const newLocation = this.map.translateGps(location);
			successCallback(newLocation);
		};
	}

	watchLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	) {
		this.geolocationAdapter.watchLocation(
			this.translateFunction(successCallback),
			errorCallback
		);
	}

	getLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	): void {
		this.geolocationAdapter.getLocation(
			this.translateFunction(successCallback),
			errorCallback
		);
	}

	stopWatching(): void {
		this.geolocationAdapter.stopWatching();
	}
}
