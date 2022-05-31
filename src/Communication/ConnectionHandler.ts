import {DefaultEventsMap} from '@socket.io/component-emitter';
import {io, Socket} from 'socket.io-client';
import ConnectionModel from '../Model/ConnectionModel';
import Singleton from '../Singeltone';
import Notifications from './Notification';
import configuration from '../../configuration.json';

export default class ConnectionHandler extends Singleton {
	private socket: Socket;
	private connectionModel: ConnectionModel;
	private notifications: Notifications = new Notifications();

	constructor() {
		super();
		this.connectionModel = ConnectionModel.getInstance();
		this.socket = io(configuration['server-url'], {autoConnect: false});
	}

	public connect(token: string, onSuccess?: () => void, onError?:()=> void): void {
		if(this.socket.connected)
		{
			return onSuccess?.();
		}
		this.socket.auth = {token};
		this.socket.connect();
		let returnedResult = false;
		
		this.socket.on('connect', () => {
			// Connected successfully to the server
			if(!returnedResult)
			{
				onSuccess?.();
			}
			this.connectionModel.isReconnecting = false;
			returnedResult = true;
			console.info(
				'A socket connection has been created successfully with the server'
			);
		});
		this.socket.on('connect_error', error => {
			if (!returnedResult) {
				onError?.();
				returnedResult = true;
			}
			console.error('Could not connect to server', error.message);
		});
		this.socket.on('disconnect', reason => {
			this.connectionModel.isReconnecting = true;
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manually
				console.warn(
					'The socket connection to the server has been disconnected by the server, trying to reconnect...'
				);
				this.socket.connect();
			} else {
				// else the socket will automatically try to reconnect
				// Too see the reasons for a disconnect https://socket.io/docs/v4/client-api/#event-disconnect
				console.warn(
					'The socket connection to the server has been disconnected, trying to reconnect...',
					reason
				);
			}
		});

		this.socket = this.socket;

		this.registerEvents(this.socket);
	}

	private registerEvents(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
		for (const event in this.notifications.eventToCallback) {
			socket.on(event, params => {
				console.info(`Notification ${event}:`, params);
				this.notifications.eventToCallback[event](params);
			});
		}
	}

	public send(event: string, params: Record<string, unknown>): void {
		if (this.socket === undefined) {
			const errorMessage =
				'A message is sent to the server before a connection is being initialized';

			console.error(errorMessage);
			throw new Error(errorMessage);
		}
		if (this.socket.connected) {
			this.socket.emit(event, params);
			// console.info(`Message ${event}:`, params);
		} else {
			// The connection has disconnected from some reason that should have been specified at the "disconnect" event above
			console.warn(
				`Trying to send a message for the event ${event} but the there is no valid connection`
			);
		}
	}
}
