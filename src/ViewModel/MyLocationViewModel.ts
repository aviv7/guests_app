import Communicate from '../Communication/Communicate';
import Geolocation from '../localization/Geolocation';
import {MyLocationModel} from '../Model/MyLocationModel';
import Location, {LocationService} from '../types';
import configuration from '../../configuration.json';
import {Corners} from '../localization/location';
import { PermissionsAndroid, Platform } from 'react-native';

const corners: Corners = {
	bottomRightGPS: configuration.corners['bottom-right-gps'],
	bottomLeftGPS: configuration.corners['bottom-left-gps'],
	topRightGPS: configuration.corners['top-right-gps'],
	topLeftGPS: configuration.corners['top-left-gps'],
};

export class MyLocationViewModel {
	private locationModel: MyLocationModel;
	private communicate: Communicate;
	private locationService: LocationService;
	private tracking: boolean;

	constructor(communication: Communicate) {
		this.locationModel = MyLocationModel.getInstance();
		this.locationService = new Geolocation(corners);
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
		this.locationService.getLocation(
			location => {
				if (!location) {
					// if location is within the map
					console.log("location not within map")
					this.locationModel.location = null;
				} 
				else if (this.isValidLocation(location)) {
					this.locationModel.location = location;
				} else {
					this.locationModel.location = null;
				}
			},
			error => {
				this.locationModel.location = null;
				console.warn('Could not get the user location', error);
			}
		)
	}

	private startTrackingLocation() {
		this.locationService.watchLocation(
			location => {
				if (!location) {
					// if location is within the map
					console.log("location not within map")
					this.locationModel.location = null;
				} 
				else if (this.isValidLocation(location)) {
					if(this.tracking)
					{
						this.communicate.updateGuestLocation(location);
					}
					this.locationModel.location = location;
				//	console.log("valid location in watch", location)
				} else {
					this.locationModel.location = null;
				}
			},
			error => {
				this.locationModel.location = null;
				console.warn('Could not get the user location', error);
			}
		);
	}
	public startTrackingLocationWhenApproved() {
		this.tracking = true;
		if (this.locationModel.locationApproved) {
			console.log("location approved")
			this.startTrackingLocation();
		}
	}


	// async function requestPermissions() {
	// 	if (Platform.OS === 'android') {
	// 		return	await PermissionsAndroid.request(
	// 			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	// 		)
	// 	}
	// }
	
	public askLocationApproval = () => {
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
					this.approveTrackingLocation();
					return Promise.resolve('approved using location')
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
	};



	getLocation(): Location | null {
		return this.locationModel.location;
	}
	getIsLocationApproved(){
		return this.locationModel.locationApproved;
	}

	getHasAskedLocationAtStart(){
		return this.locationModel.hasAskedLocationAtStart;
	}
	AskedLocationAtStart(){
		this.locationModel.hasAskedLocationAtStart = true;
	}
	
	private approveTrackingLocation() {
		this.locationModel.locationApproved = true;
	}

	private refuseTrackingLocation(){
		this.locationModel.locationApproved = false;
	}

	stopTracking() {
		this.tracking = false;
	}
}
