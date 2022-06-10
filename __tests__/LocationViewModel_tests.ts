import {flushPromises, makePromise as mockMakePromise} from '../src/PromiseUtils';
import Requests from '../src/Networking/requests';
import { MyLocationViewModel } from '../src/ViewModel/MyLocationViewModel';
import MapViewModel from '../src/ViewModel/MapViewModel';
import { Corners, MapIDO } from '../src/types';
import Communicate from '../src/Communication/Communicate';

const map1ID = "map1ID"
const map2ID = "map2ID"
const corners: Corners = {
    bottomRightGPS: {"longitude": 34.802516, "latitude": 31.261649},
    bottomLeftGPS: {"longitude": 34.800838, "latitude": 31.261649},
    topRightGPS: {"longitude": 34.802516, "latitude": 31.26355},
   topLeftGPS: {"longitude": 34.800838, "latitude": 31.26355}
}

const mapsAtServer:MapIDO[] = [{id:map1ID, name: "defaultMAP",corners: corners, imageURL:"beit hastudent"},
                               {id:map2ID, name: "90'sBuildings",corners: corners, imageURL:"90's buildings"}];
const mockGetMaps = jest
	.fn()
	.mockImplementation(() => mockMakePromise(mapsAtServer));


jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getMaps: mockGetMaps,
            
		};
	});
});

const mockUpdateGuestLocation = jest.fn();
jest.mock('../src/Communication/Communicate', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateGuestLocation: mockUpdateGuestLocation,
		};
	});
});

describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
	});

	it('The class can be created successfully', async () => {
        const communicate = new Communicate();
        const mapViewModel = new MapViewModel(new Requests());
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
		expect(locationViewModel).toBeTruthy();
	});


});
