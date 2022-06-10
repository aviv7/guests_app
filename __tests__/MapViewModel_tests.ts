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

describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
	});

	it('The class can be created successfully', async () => {
        const mapViewModel = new MapViewModel(new Requests());
		expect(mapViewModel).toBeTruthy();
	});

	it('can retrive maps from server', async () => {
		const mapViewModel = new MapViewModel(new Requests());
        await mapViewModel.syncMaps();
        expect(mapViewModel.getMaps() !== null &&
			   mapViewModel.getMaps().length == mapsAtServer.length &&
			   mapViewModel.getMaps()[0].id == mapsAtServer[0].id).toBeTruthy();
	});

    it('the default map is the first map in the array', async () => {
		const mapViewModel = new MapViewModel(new Requests());
        mapViewModel.syncMaps();
        expect(mapViewModel.getDefaultMap()?.id == mapsAtServer[0].id).toBeTruthy();
	});
	it('can retrive map by id', async () => {
		const mapViewModel = new MapViewModel(new Requests());
        mapViewModel.syncMaps();
        expect(JSON.stringify(mapViewModel.getMapByID(map1ID)) === JSON.stringify (mapsAtServer[0])).toBeTruthy();
	});
	
});