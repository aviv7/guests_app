import {makeAutoObservable} from 'mobx';
import Location from '../types';

export class MyLocationModel {
	private _location: Location | null;
	private _locationApproved: boolean;

	public constructor() {
		makeAutoObservable(this);
		this._location = null;
		this._locationApproved = false;
	}

	get location() {
		return this._location;
	}

	set location(location: Location | null) {
		this._location = location;
	}

	
	get locationApproved() {
		return this._locationApproved;
	}

	set locationApproved(approved: boolean) {
		this._locationApproved = approved;
	}
}
