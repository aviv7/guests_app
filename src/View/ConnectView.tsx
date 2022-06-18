import React from 'react';
import {Button, StyleSheet, Text, TextInput} from 'react-native';
import MapScreenController from '../ViewController/MapScreenController';

type LoginViewProps = {
	loggedIn: boolean;
	isLoading: boolean;
	isConnected: boolean;
	username: string;
	password: string;
	onPasswordChange: (newPassword: string) => void;
	onUserNameChange: (newUsername: string) => void;
	onSubmit: () => void;
	establishConnection: () => void;
	isReconnecting: boolean;
};

export default function LoginView(props: LoginViewProps) {
	if (props.isConnected && props.loggedIn) {
		return (
			<>
				{props.isReconnecting && (
					<Text>Connection lost, trying to reconnect...</Text>
				)}
				<MapScreenController />
			</>
		);
	}
	if (props.loggedIn && !props.isConnected) {
		return (
			<>
				<Button
					title='Reconnect'
					onPress={props.establishConnection}
					disabled={props.isLoading}
				/>
				{props.isLoading && <Text>Establishing connection...</Text>}
			</>
		);
	}

	return (
		<>
			<TextInput
				style={styles.input}
				onChangeText={props.onUserNameChange}
				value={props.username}
				placeholder='Username'
			/>
			<TextInput
				style={styles.input}
				onChangeText={props.onPasswordChange}
				value={props.password}
				placeholder='Enter password'
				secureTextEntry
			/>
			<Button
				title='Log in'
				onPress={props.onSubmit}
				disabled={props.isLoading}
			/>
			{props.isLoading && <Text>Logging in...</Text>}
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
