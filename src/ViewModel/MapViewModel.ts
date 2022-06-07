// import configuration from '../../configuration.json';

// type MapDetails = {
// 	id: string;
// 	name: string;
// 	imageURL: string;
// };
// export default class MapViewModel {
// 	getMapDetails(): MapDetails {
// 		return {
// 			id: '',
// 			name: '',
// 			imageURL: configuration['map-image-url'],
// 		};
// 	}
// }

import MapsModel from '../Model/MapsModel';
import Requests from '../networking/Requests';
import { MapIDO } from '../types';

export default class MapViewModel {
	private mapsModel: MapsModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.mapsModel = new MapsModel();
		this.requests = requests;
	}

	get maps(): MapIDO[] {
		return this.mapsModel.maps;
	}

	get defaultMap(): MapIDO | undefined {
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
}
