import {createContext} from 'react';
import Requests from './Networking/requests';
import {MyLocationViewModel} from './ViewModel/MyLocationViewModel';
import OrderViewModel from './ViewModel/OrderViewModel';
import ItemViewModel from './ViewModel/ItemViewModel';
import ConnectionViewModel from './ViewModel/ConnectionViewModel';
import MapViewModel from './ViewModel/MapViewModel';
import Communicate from './Communication/Communicate';

const requests = new Requests();
const authentication = new ConnectionViewModel(requests);
const orders = new OrderViewModel(requests);
const items = new ItemViewModel(requests);
const maps = new MapViewModel(requests);
const myLocationViewModel = new MyLocationViewModel(new Communicate());

export const ConnectionContext =
	createContext<ConnectionViewModel>(authentication);
export const OrdersContext = createContext<OrderViewModel>(orders);
export const itemsContext = createContext<ItemViewModel>(items);
export const MapsContext = createContext<MapViewModel>(maps);
export const MyLocationContext =
	createContext<MyLocationViewModel>(myLocationViewModel);
