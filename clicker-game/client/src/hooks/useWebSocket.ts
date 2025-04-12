import { useEffect, useState } from 'react';

export function useWebSocket(onMessage: (data: any, ws: WebSocket) => void) {
	const [connectionAttempts, setConnectionAttempts] = useState(0);

	useEffect(() => {
		// Determine WebSocket URL based on current environment
		const host =
			window.location.hostname === 'localhost'
				? 'localhost'
				: window.location.hostname;
		const wsProtocol =
			window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${wsProtocol}//${host}:3001`;

		console.log(`Connecting to WebSocket at ${wsUrl}`);
		const socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			console.log('WebSocket connection established');
			// Resume session if token exists
			const saved = localStorage.getItem('clicker-session');
			if (saved) {
				socket.send(
					JSON.stringify({ type: 'resume-session', token: saved })
				);
			}
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				onMessage(data, socket);
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
			// Try to reconnect a limited number of times
			if (connectionAttempts < 3) {
				setTimeout(() => {
					setConnectionAttempts((prev) => prev + 1);
				}, 2000);
			}
		};

		socket.onclose = (event) => {
			console.log(
				`WebSocket connection closed: ${event.code} ${event.reason}`
			);
		};

		return () => {
			console.log('Closing WebSocket connection');
			socket.close();
		};
	}, [connectionAttempts]);
}
