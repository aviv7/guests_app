import {Corners, Location, MapIDO} from '../src/types';
import MapViewModel from '../src/ViewModel/MapViewModel';
import Geolocation from '../src/localization/Geolocation';
import Requests from '../src/Networking/requests';
import {flushPromises, makePromise as mockMakePromise} from '../src/PromiseUtils';



// jest.mock('../src/ViewModel/MapViewModel', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 		};
// 	});
// });
const map1Coreners: Corners = {
    topRightGPS:  {"longitude": 34.802516, "latitude": 31.26355},
	topLeftGPS: {"longitude": 34.800838, "latitude": 31.26355},
	bottomRightGPS: {"longitude": 34.802516, "latitude": 31.261649},
	bottomLeftGPS:  {"longitude": 34.800838, "latitude": 31.261649}
}
const mapImageUrl = "https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png"
const map1:MapIDO = {id:"map1ID",name:"Beit HaStudent",imageURL:mapImageUrl,corners:map1Coreners}
let mapsAtServer: MapIDO[] = [map1]
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

jest.mock('../src/localization/GeolocationAdapter', () => {
	return jest.fn().mockImplementation(() => {
		return {
		};
	});
});

describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
	});

	it('The class can be created successfully', async () => {
		const requests = new Requests();
        const mapViewModel = new MapViewModel(requests);
        mapViewModel.syncMaps();
        const geolocation = new Geolocation(mapViewModel);
        expect(geolocation).toBeTruthy();
	});
});

