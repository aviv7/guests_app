import ConnectionHandler from '../Communication/ConnectionHandler';
import ConnectionModel from '../Model/ConnectionModel';
import Requests from '../Networking/requests';
import ItemViewModel from './ItemViewModel';
import MapViewModel from './MapViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connectionHandler: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;
	private maps: MapViewModel;

	constructor(requests: Requests, mapsViewModel: MapViewModel) {
		this.model = ConnectionModel.getInstance();
		this.requests = requests;
		this.connectionHandler = new ConnectionHandler();
		this.orders = new OrderViewModel(requests);
		this.items = new ItemViewModel(requests);
		this.maps = mapsViewModel;
	}

	login(username: string, password: string): Promise<string> {
		return this.requests.login(username, password).then(token => {
			this.model.token = token;
			return token;
		});
	}

	get connection(): ConnectionModel {
		return this.model;
	}

	public connect() {
		const promises = [
			this.maps.syncMaps(),
			this.orders.getOrderFromServer(),
			this.items.syncItems(),
			new Promise<void>((resolve, reject) => {
				if (this.model.token) {
					this.connectionHandler.connect(this.model.token, 
						() => {resolve();},
						() => {reject('Could not connect to server');}
					);
				} else {
					console.log('no token found');
					reject(
						'Tried to connect but an authorization token could not be found'
					);
				}
			}),
		];
		return Promise.all(promises);
	}

	getUsername(){
		return this.model.username;
	}

	setUsername(username: string){
		this.model.username = username;
	}
}
