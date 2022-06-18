import {Location} from '../types';

export interface ILocationService {
	getLocation(
		successCallback: (location: Location | null) => void,
		errorCallback: (error: string) => void
	): void;

	watchLocation(
		successCallback: (location: Location | null) => void,
		errorCallback: (error: string) => void
	): void;

	stopWatching(): void;
}
