import './Login.css';

import React, { useState } from 'react';
import Web3 from 'web3';

import { Auth } from '../types';

interface Props {
	onLoggedIn: (auth: Auth) => void;
}

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export const Login = ({ onLoggedIn }: Props): JSX.Element => {
	const [loading, setLoading] = useState(false); // Loading button state

	const handleAuthenticate = ({
		accountAddress,
		signature,
		nonce,
	}: {
		accountAddress: string;
		signature: string;
		nonce: number;
	}) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}auth/login`, {
			body: JSON.stringify({ accountAddress, signature, nonce }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => {
			return response.json();
		});

	const handleSignMessage = async ({
		accountAddress,
		nonce,
	}: {
		accountAddress: string;
		signature: string;
		nonce: number;
	}) => {
		try {
			const signature = await web3.eth.personal.sign(
				`I am signing my one-time nonce: ${nonce}`,
				accountAddress,
				'' // MetaMask will ignore the password argument here
			);
			console.log('#2 IN HANDLESIGNMESSAGE');
			return { accountAddress, signature, nonce };
		} catch (err) {
			throw new Error(
				'You need to sign the message to be able to log in.'
			);
		}
	};

	const handleSignup = (publicAddress: string) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
			body: JSON.stringify({ publicAddress }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());

	const handleClick = async () => {
		// Check if MetaMask is installed
		if (!(window as any).ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!web3) {
			try {
				// Request account access if needed
				await (window as any).ethereum.enable();

				// We don't know window.web3 version, so we use our own instance of Web3
				// with the injected provider given by MetaMask
				web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert('You need to allow MetaMask.');
				return;
			}
		}

		const coinbase = await web3.eth.getCoinbase();
		if (!coinbase) {
			window.alert('Please activate MetaMask first.');
			return;
		}

		const publicAddress = coinbase.toLowerCase();
		setLoading(true);

		// Look if user with current publicAddress is already present on backend
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}auth?accountAddress=${publicAddress}`
		)
			.then((response) => response.json())
			// If yes, retrieve it. If no, create it.
			.then((users) => {
				console.log(users);
				return users;
			})
			// Popup MetaMask confirmation modal to sign message
			.then(handleSignMessage)
			// Send signature to backend on the /auth route
			.then(handleAuthenticate)
			// Pass access_token back to parent component (to save it in localStorage)
			.then(onLoggedIn)
			.catch((err) => {
				window.alert(err);
				setLoading(false);
			});
	};

	return (
		<div>
			<p>
				Please select your login method.
				<br />
				For the purpose of this demo, only MetaMask login is
				implemented.
			</p>
			<button className="Login-button Login-mm" onClick={handleClick}>
				{loading ? 'Loading...' : 'Login with MetaMask'}
			</button>
			<button className="Login-button Login-fb" disabled>
				Login with Facebook
			</button>
			<button className="Login-button Login-email" disabled>
				Login with Email
			</button>
		</div>
	);
};
