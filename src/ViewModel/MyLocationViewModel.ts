import Communicate from '../Communication/Communicate';
import Geolocation from '../localization/Geolocation';
import {MyLocationModel} from '../Model/MyLocationModel';
import Location, {LocationService} from '../types';
import configuration from '../../configuration.json';
import {Corners} from '../localization/location';

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
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
		this.communicate = communication;
		this.tracking = false;
	}

	private isValidLocation(location: Location) {
        const isValidNumber = (n: number) => !isNaN(n) && isFinite(n);
        return isValidNumber(location.x) && isValidNumber(location.y);
    }

	public startTrackingLocation() {
		this.tracking = true;
        this.locationService.watchLocation(
            location => {
                if (this.isValidLocation(location)) {
                    this.communicate.updateGuestLocation(location);
                    this.locationModel.location = location;
                } else {
                    console.warn(
                        'An invalid location has been received from the location service',
                        location
                    );
                }
            },
            error => {
                console.warn('Could not get the user location', error);
            }
        );
    }

	
	getLocation(): Location | null {
		return this.locationModel.location;
	}
	
	approveTrackingLocation() {
		this.locationModel.locationApproved = true;
	}

	stopTracking() {
		this.tracking = false;
		this.locationService.stopWatching();
	}
}
