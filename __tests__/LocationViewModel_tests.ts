import Communicate from '../src/Communication/Communicate';
import Geolocation from '../src/localization/Geolocation';
import {flushPromises, makePromise as mockMakePromise} from '../src/PromiseUtils';
import Location from '../src/types';
import { MyLocationViewModel } from '../src/ViewModel/MyLocationViewModel';



const mockUpdateGuestLocation = jest.fn();
jest.mock('../src/Communication/Communicate', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateGuestLocation: mockUpdateGuestLocation,
		};
	});
});

const mockWatchLocation = jest.fn();
jest.mock('../src/localization/Geolocation', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
		};
	});
});


describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Communicate as jest.Mock).mockClear();
	});

    it('The class can be created successfully', async () => {
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate);
		expect(locationViewModel).toBeTruthy();
	});
    
});

describe('Tracking location tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Communicate as jest.Mock).mockClear();
        (Geolocation as jest.Mock).mockClear();
	});
    
    it('startWatchingLocation updates location when location is valid', async () => {
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate);
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
        let currentLocation = new Location(0.5,0.5);
        successCallback2(currentLocation)
        await flushPromises();
        expect(JSON.stringify(locationViewModel.getLocation()) === JSON.stringify(currentLocation))
	});

    it('Location is not sent to server when not tracking', async () => {
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate);
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
        successCallback2(new Location(0.5,0.5))
        await flushPromises();
        expect(communicate.updateGuestLocation).toHaveBeenCalledTimes(0)
	});

    it('Location is sent to server when tracking', async () => {
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate);
        locationViewModel.locationNeedsToBeTracked();
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
        successCallback2(new Location(0.5,0.5))
        await flushPromises();
        expect(communicate.updateGuestLocation).toHaveBeenCalledTimes(1)
	});
    
});