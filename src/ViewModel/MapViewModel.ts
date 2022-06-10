import configuration from '../../configuration.json';
import MapsModel from '../Model/MapsModel';
import Requests from '../Networking/requests';
import { MapIDO } from '../types';

export default class MapViewModel {
	private mapsModel: MapsModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.mapsModel = MapsModel.getInstance();
		this.requests = requests;
	}

	getMaps(): MapIDO[] {
		return this.mapsModel.maps;
	}

	getDefaultMap(): MapIDO | undefined {
		return this.mapsModel.defaultMap;
	}

	getMapByID(id: string): MapIDO | undefined {
		return this.mapsModel.maps.find(map => map.id === id);
	}

	syncMaps(): Promise<void> {
		return this.requests.getMaps().then(maps => {
			this.mapsModel.maps = maps;
		});
	}
	
	// getMapDetails(): MapDetails {
	// 	return {
	// 		id: '',
	// 		name: '',
	// 		imageURL: configuration['map-image-url'],
	// 	};
	// }
}
