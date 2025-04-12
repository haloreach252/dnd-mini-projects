import { useState } from 'react';

export function useAuth(ws: WebSocket | null) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [authError, setAuthError] = useState('');
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [input, setInput] = useState('');
	const [password, setPassword] = useState('');

	const submit = () => {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;

		ws.send(
			JSON.stringify({
				type: mode === 'login' ? 'login-user' : 'register-user',
				username: input,
				password,
			})
		);
	};

	const handleMessage = (data: any) => {
		if (data.type === 'login-success') {
			localStorage.setItem('clicker-session', data.token);
			setUsername(data.username);
			setIsLoggedIn(true);
			setAuthError('');
		} else if (data.type === 'register-success') {
			setMode('login');
			setAuthError('Account created. You can now log in.');
		} else if (
			data.type === 'login-failure' ||
			data.type === 'register-failure'
		) {
			setAuthError(data.reason || 'An error occurred');
		}
	};

	const logout = () => {
		localStorage.removeItem('clicker-session');
		setIsLoggedIn(false);
		setUsername('');
		setInput('');
		setPassword('');
	};

	return {
		isLoggedIn,
		username,
		mode,
		setMode,
		input,
		setInput,
		password,
		setPassword,
		authError,
		submit,
		handleMessage,
		logout,
	};
}
