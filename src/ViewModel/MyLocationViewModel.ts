import Communicate from '../Communication/Communicate';
import Geolocation from '../localization/Geolocation';
import {MyLocationModel} from '../Model/MyLocationModel';
import {Location, Corners, LocationService, MapIDO} from '../types';
import configuration from '../../configuration.json';
import {PermissionsAndroid, Platform} from 'react-native';
import MapViewModel from './MapViewModel';

// const corners: Corners = {
// 	bottomRightGPS: configuration.corners['bottom-right-gps'],
// 	bottomLeftGPS: configuration.corners['bottom-left-gps'],
// 	topRightGPS: configuration.corners['top-right-gps'],
// 	topLeftGPS: configuration.corners['top-left-gps'],
// };

export class MyLocationViewModel {
	private locationModel: MyLocationModel;
	private communicate: Communicate;
	private locationService: LocationService;
	private tracking: boolean;
	private mapViewModel: MapViewModel;

	constructor(communication: Communicate, mapViewModel: MapViewModel) {
		this.mapViewModel = mapViewModel;
		this.locationModel = MyLocationModel.getInstance();
		this.locationService = new Geolocation(mapViewModel);
		this.communicate = communication;
		this.tracking = false;
	}

	private isValidLocation(location: Location) {
		const isValidNumber = (n: number) => !isNaN(n) && isFinite(n);
		return isValidNumber(location.x) && isValidNumber(location.y);
	}

	// public startTrackingLocation() {
	// 	this.tracking = true;
	//     this.locationService.watchLocation(
	//         location => {
	//             if (this.isValidLocation(location)) {
	// 				if(this.tracking){
	// 					this.communicate.updateGuestLocation(location);
	// 					this.locationModel.location = location;
	// 				}
	//             } else {
	//                 console.warn(
	//                     'An invalid location has been received from the location service',
	//                     location
	//                 );
	//             }
	//         },
	//         error => {
	//             console.warn('Could not get the user location', error);
	//         }
	//     );
	// }

	public getLocationPoint() {
		if (this.locationModel.locationApproved) {
			this.locationService.getLocation(
				location => {
					if (!location) {
						// if location is within the map
						console.log('location not within map1');
						this.locationModel.location = null;
						this.locationModel.locationError =
							'Out of service bound';
					} else if (this.isValidLocation(location)) {
						this.locationModel.location = location;
						this.locationModel.locationError = undefined;
					} else {
						const error =
							'Unexpected error, received invalid location';
						this.locationModel.locationError = error;
						this.locationModel.location = null;
					}
				},
				error => {
					this.locationModel.location = null;
					console.warn('Could not get the user location', error);
					this.locationModel.locationError = error;
				}
			);
		} else {
			this.locationModel.locationError = 'Please approve using location';
			this.locationModel.location = null;
		}
	}

	public startWatchingLocation() {
		if (this.locationModel.locationApproved) {
			this.locationService.watchLocation(
				location => {
					if (!location) {
						console.log('location not within map2');
						this.locationModel.location = null;
						this.locationModel.locationError =
							'Out of service bound';
						console.log(
							'********',
							this.locationModel.locationError
						);
					} else if (this.isValidLocation(location)) {
						if (this.tracking) {
							this.communicate.updateGuestLocation(location);
						}
						this.locationModel.location = location;
						this.locationModel.locationError = undefined;
						console.log(
							'current map = ',
							this.mapViewModel.getMapByID(location.mapID)?.name
						);
						//	console.log("valid location in watch", location)
					} else {
						const error =
							'Unexpected error, received invalid location';
						this.locationModel.locationError = error;
						this.locationModel.location = null;
						console.log(
							'location error 2 = ',
							this.locationModel.locationError
						);
					}
				},
				error => {
					this.locationModel.location = null;
					console.warn('Could not get the user location', error);
					this.locationModel.locationError = error;
					console.log(
						'location error 1 = ',
						this.locationModel.locationError
					);
				}
			);
		} else {
			this.locationModel.locationError = 'Please approve using location';
			this.locationModel.location = null;
		}
	}
	public locationNeedsToBeTracked() {
		this.tracking = true;
	}

	public stopTrackingLocation() {
		this.tracking = false;
	}

	// async function requestPermissions() {
	// 	if (Platform.OS === 'android') {
	// 		return	await PermissionsAndroid.request(
	// 			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	// 		)
	// 	}
	// }

	public askLocationApproval(): Promise<string> {
		const approvingLocationRequest =
			Platform.OS === 'android'
				? PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: Promise.reject('IOS is not supported');

		return approvingLocationRequest
			.catch(() => {
				return Promise.reject(
					'Location needs to be approved for the waiter to watch your location'
				);
			})
			.then(value => {
				if (value === PermissionsAndroid.RESULTS.GRANTED) {
					this.approveUsingLocation();
					return Promise.resolve('approved using location');
				} else if (value === 'never_ask_again') {
					return Promise.reject(
						'Pls enable location permission in the Settings -> Apps -> guests_app'
					);
				} else {
					return Promise.reject(
						'Location needs to be approved for the waiter to watch your location'
					);
				}
			});
	}

	getLocation(): Location | null {
		return this.locationModel.location;
	}
	getIsLocationApproved() {
		return this.locationModel.locationApproved;
	}

	getHasAskedLocationAtStart() {
		return this.locationModel.hasAskedLocationAtStart;
	}
	AskedLocationAtStart() {
		this.locationModel.hasAskedLocationAtStart = true;
	}

	private approveUsingLocation() {
		this.locationModel.locationApproved = true;
	}

	private refuseTrackingLocation() {
		this.locationModel.locationApproved = false;
	}

	stopTracking() {
		this.tracking = false;
	}

	// get isCurrentLocationOutOfBound(): boolean {
	// 	return (
	// 		this.locationModel.location === null &&
	// 		this.locationModel.locationError === undefined
	// 	);
	// }

	getCurrentLocationError(): string | undefined {
		return this.locationModel.locationError;
	}

	get currentMap(): MapIDO | undefined {
		let location = this.getLocation();
		return location !== null
			? this.mapViewModel.getMapByID(location.mapID)
			: this.mapViewModel.getDefaultMap();
	}
}
