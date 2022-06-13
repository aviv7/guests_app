import Communicate from '../src/Communication/Communicate';
import Geolocation from '../src/localization/Geolocation';
import { MyLocationModel } from '../src/Model/MyLocationModel';
import { OrderModel } from '../src/Model/OrderModel';
import Requests from '../src/Networking/requests';
import {flushPromises, makePromise as mockMakePromise} from '../src/PromiseUtils';
import {Location} from '../src/types';
import MapViewModel from '../src/ViewModel/MapViewModel';
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

const requests = new Requests();
const mapViewModel = new MapViewModel(requests);
describe('Initialization tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Communicate as jest.Mock).mockClear();
	});

    it('The class can be created successfully', async () => {
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
		expect(locationViewModel).toBeTruthy();
	});
    
});
describe('watch location tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Communicate as jest.Mock).mockClear();
        (Geolocation as jest.Mock).mockClear();
	});
    
     it('startWatchingLocation updates location when user approved using location and location is valid', async () => {
		const orderModel = MyLocationModel.getInstance();
		orderModel.locationApproved = true;
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
	
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
        let currentLocation: Location = {x:0.5, y:0.5, mapID:'map'}
        successCallback2(currentLocation)
        await flushPromises();
        expect(JSON.stringify(locationViewModel.getLocation()) === JSON.stringify(currentLocation))
	});

	it('startWatchingLocation doesnt update location when user didnt approve using location and location is valid', async () => {
		const orderModel = MyLocationModel.getInstance();
		orderModel.locationApproved = false;
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
		
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
        let currentLocation: Location = {x:0.5, y:0.5, mapID:'map'}
        successCallback2(currentLocation)
        await flushPromises();
        expect(locationViewModel.getLocation() === null)
	});
    
});

describe('Tracking location tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Communicate as jest.Mock).mockClear();
        (Geolocation as jest.Mock).mockClear();
	});

    it('Location is not sent to server when not tracking', async () => {
		const orderModel = MyLocationModel.getInstance();
		orderModel.locationApproved = true;
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
		let currentLocation: Location = {x:0.5, y:0.5, mapID:'map'}
        successCallback2(currentLocation)
        await flushPromises();
        expect(communicate.updateGuestLocation).toHaveBeenCalledTimes(0)
	});

    it('Location is sent to server when tracking', async () => {
		const orderModel = MyLocationModel.getInstance();
		orderModel.locationApproved = true;
        const communicate = new Communicate();
		const locationViewModel = new MyLocationViewModel(communicate,mapViewModel);
        locationViewModel.locationNeedsToBeTracked();
        let successCallback2 = (location: Location) => location;
		mockWatchLocation.mockImplementation((successCallback, error) => successCallback2 = successCallback)
        locationViewModel.startWatchingLocation();
		let currentLocation: Location = {x:0.5, y:0.5, mapID:'map'}
        successCallback2(currentLocation)
        await flushPromises();
        expect(communicate.updateGuestLocation).toHaveBeenCalledTimes(1)
	});
    
});
