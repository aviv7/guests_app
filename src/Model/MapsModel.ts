import {makeAutoObservable} from 'mobx';
import { MapIDO } from '../types';

export default class MapsModel {
	private _maps: MapIDO[];

	constructor() {
		this._maps = [];
		makeAutoObservable(this);
	}
	static instance?: MapsModel;
	static getInstance(): MapsModel {
		if (!this.instance) {
			this.instance = new MapsModel();
		}
		return this.instance;
	}

	get maps() :MapIDO[] {
		return this._maps;
	}

	set maps(maps: MapIDO[]) {
		this._maps = maps;
	}

	get defaultMap(): MapIDO | undefined {
		if (this._maps.length > 0) {
			return this._maps[0];
		}
	}
}
