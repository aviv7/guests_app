import {makeAutoObservable} from 'mobx';
import {Location} from '../types';

export class MyLocationModel {
	private _location: Location | null;
	private _locationApproved: boolean;
	private _hasAskedLocationAtStart: boolean;
	private _locationError: string | undefined;

	private constructor() {
		this._location = null;
		this._locationApproved = false;
		this._hasAskedLocationAtStart = false;
		makeAutoObservable(this);
	}
	static instance?: MyLocationModel;
	static getInstance(): MyLocationModel {
		if (!this.instance) {
			this.instance = new MyLocationModel();
		}
		return this.instance;
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

	get hasAskedLocationAtStart() {
		return this._hasAskedLocationAtStart;
	}

	set hasAskedLocationAtStart(hasAsked: boolean) {
		this._hasAskedLocationAtStart = hasAsked;
	}

	set locationError(error: string | undefined) {
		this._locationError = error;
	}

	get locationError(): string | undefined {
		return this._locationError;
	}
}

export type LocationError = 'Out of bound' | 'Missing premission';
