//import {observer} from '../../node_modules/mobx-react-lite';
import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ConnectionContext} from '../contexts';
import ConnectView from '../View/ConnectView';

type LoginControllerProps = {};

const ConnectController = observer((_props: LoginControllerProps) => {
	const connectionViewModel = useContext(ConnectionContext);

	const token = connectionViewModel.connection.token;
	const isLoggedIn = token !== null;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState('');

	const establishConnection = () => {
		setIsLoading(true);
		connectionViewModel.connection.isReconnecting = true;
		connectionViewModel
			.connect()
			.then(() =>{connectionViewModel.connection.isReconnecting = false; setIsConnected(true);})
			.catch(() => Alert.alert("Can't establish connection to server"))
			.finally(()=> {setIsLoading(false);});
	};

	const logIn = (password: string) => {
		return connectionViewModel.login(password);
	};

	const onSubmit = () => {
		logIn(password)
			.then(establishConnection)
			.catch(e => {
				const msg = e?.response?.data ?? "Can't login to server";
				Alert.alert(msg);
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<ConnectView
			loggedIn={isLoggedIn}
			isLoading={isLoading}
			isConnected={isConnected}
			password={password}
			onPasswordChange={setPassword}
			onSubmit={onSubmit}
			establishConnection={establishConnection}
			isReconnecting={connectionViewModel.connection.isReconnecting}
		/>
	);
});
export default ConnectController;
