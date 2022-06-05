import {guestCommunication} from '../signatures';
import Location, {LocationCoordinates} from '../types';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate implements guestCommunication {
	private connectionHandler: ConnectionHandler;
	constructor() {
		this.connectionHandler = new ConnectionHandler();
	}

	updateGuestLocation(guestLocation: Location): void {
		this.connectionHandler.send('updateGuestLocation', {location: {...guestLocation, mapID: "Random Map ID"}});
	}
}
