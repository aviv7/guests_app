import {Location, GPS} from '../types';
import MapViewModel from '../ViewModel/MapViewModel';
import GeolocationAdapter from './GeolocationAdapter';

import {ILocationService} from './ILocationService';
import LocationMap from './Map';
import {autorun} from 'mobx';

export default class Geolocation implements ILocationService {
	private geolocationAdapter: GeolocationAdapter;
	private maps: LocationMap[] = [];

	constructor(mapsViewModel: MapViewModel) {
		autorun(() => {
			this.maps = mapsViewModel
				.getMaps()
				.map(map => new LocationMap(map));
		});
		this.geolocationAdapter = new GeolocationAdapter();
	}

	private translateFunction(
		successCallback: (location: Location | null) => void
	) {
		return (location: GPS) => {
			for (const map of this.maps) {
				if (map.hasInside(location)) {
					const newLocation = map.translateGps(location);
					return successCallback(newLocation);
				}
			}
			return successCallback(null);
		};
	}

	/* OLD - working */
	// private translateFunction(successCallback: (location: Location) => void) {
	// 	return (location: GPS) => {
	// 		const newLocation = this.map.translateGps(location);
	// 		successCallback(newLocation);
	// 	};
	// }

	watchLocation(
		successCallback: (location: Location | null) => void,
		errorCallback: (error: string) => void
	) {
		this.geolocationAdapter.watchLocation(
			this.translateFunction(successCallback),
			errorCallback
		);
	}

	getLocation(
		successCallback: (location: Location | null) => void,
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
