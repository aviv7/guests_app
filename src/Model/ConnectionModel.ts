import {makeAutoObservable} from 'mobx';

export default class ConnectionModel {
	private _token: string | null;
	private _isReconnecting: boolean;
	private _username: string;

	private constructor() {
		this._token = null;
		this._isReconnecting = false;
		this._username = '';
		makeAutoObservable(this);
		
	}

	static instance?: ConnectionModel;
	static getInstance(): ConnectionModel {
		if (!this.instance) {
			this.instance = new ConnectionModel();
		}
		return this.instance;
	}

	set token(newToken:  string | null) {
		this._token = newToken;
	}

	get token(): string | null {
		return this._token;
	}

	set isReconnecting(value: boolean) {
		this._isReconnecting = value;
	}

	get isReconnecting() {
		return this._isReconnecting;
	}

	set username(username: string) {
		this._username = username;
	}

	get username(): string {
		return this._username;
	}
}
