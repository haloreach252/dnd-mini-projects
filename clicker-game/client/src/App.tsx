import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import CheatSection from './components/clicker/CheatSection';
import UpgradeSection from './components/clicker/UpgradeSection';

type Message = {
	type: 'system';
	message: string;
};

type ActionMessage = {
	type: 'action';
	message: string;
};

type ClickEffect = {
	id: number;
	x: number;
	y: number;
	text: string;
};

export type GameState = {
	clickCount: number;
	gold: number;
	clickPower: number;
	autoClickers: number;
	upgrades: {
		id: string;
		name: string;
		description: string;
		cost: number;
		level: number;
		canBuy: boolean;
	}[];
	cheats: {
		id: string;
		name: string;
		description: string;
	}[];
};

const defaultGameState: GameState = {
	clickCount: 0,
	gold: 0,
	clickPower: 1,
	autoClickers: 0,
	upgrades: [],
	cheats: [],
};

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [password, setPassword] = useState('');
	const [authError, setAuthError] = useState('');

	const [ws, setWs] = useState<WebSocket | null>(null);
	const [username, setUsername] = useState('');
	const [input, setInput] = useState('');
	const [dialogOpen, setDialogOpen] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
	const [actionLog, setActionLog] = useState<ActionMessage[]>([]);
	const actionRef = useRef<HTMLDivElement | null>(null);

	const [gameState, setGameState] = useState<GameState>(defaultGameState);

	const messagesRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		const socket = new WebSocket('ws://69.162.253.187:3001');
		setWs(socket);

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'login-success') {
				setUsername(data.username);
				setIsLoggedIn(true);
				setDialogOpen(false);
				setAuthError('');
			}

			if (data.type === 'register-success') {
				setMode('login');
				setAuthError('Account created. You can now log in.');
			}

			if (
				data.type === 'login-failure' ||
				data.type === 'register-failure'
			) {
				setAuthError(data.reason || 'An error occurred');
			}

			if (data.type === 'init' || data.type === 'update') {
				setGameState(data.state);
			} else if (data.type === 'system') {
				setMessages((prev) => [
					...prev,
					{ type: 'system', message: data.message },
				]);
			} else if (data.type === 'action') {
				setActionLog((prev) => [...prev.slice(-49), data]); // cap at 50 entries
			}
		};

		return () => socket.close();
	}, []);

	useEffect(() => {
		if (actionRef.current) {
			actionRef.current.scrollTop = actionRef.current.scrollHeight;
		}
	}, [actionLog]);

	const handleClick = (e: React.MouseEvent) => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: 'click' }));

			// animation
			const rect = (e.target as HTMLElement).getBoundingClientRect();
			const effect = {
				id: Date.now(),
				x: rect.left + rect.width / 2,
				y: rect.top,
				text: `+${gameState.clickPower}`,
			};
			setClickEffects((prev) => [...prev, effect]);
			setTimeout(() => {
				setClickEffects((prev) =>
					prev.filter((fx) => fx.id !== effect.id)
				);
			}, 1000);
		}
	};

	return (
		<div className="flex">
			<main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 flex-1">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle className="text-3xl">
							🖱️ Real-Time Clicker <br />
							{username}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-lg">
							Total Clicks:{' '}
							<span className="font-bold">
								{gameState.clickCount}
							</span>
						</p>
						<p className="text-sm text-muted-foreground">
							Gold: {gameState.gold} | Click Power:{' '}
							{gameState.clickPower} | Auto-Clickers:{' '}
							{gameState.autoClickers}
						</p>

						<Button
							onClick={handleClick}
							className="w-full text-lg py-6"
						>
							Click Me!
						</Button>
					</CardContent>
				</Card>

				{clickEffects.map((fx) => (
					<motion.div
						key={fx.id}
						initial={{ opacity: 1, y: 0 }}
						animate={{ opacity: 0, y: -40 }}
						transition={{ duration: 1 }}
						className="pointer-events-none fixed text-white text-xl font-bold select-none"
						style={{ left: fx.x, top: fx.y }}
					>
						{fx.text}
					</motion.div>
				))}

				<UpgradeSection state={gameState} ws={ws} />

				<CheatSection state={gameState} ws={ws} />

				<div
					ref={messagesRef}
					className="w-full max-w-md h-32 overflow-auto bg-muted text-sm p-2 rounded"
				>
					{messages.map((msg, i) => (
						<p key={i} className="text-muted-foreground italic">
							{msg.message}
						</p>
					))}
				</div>
			</main>

			{/* Sidebar */}
			<div
				ref={actionRef}
				className="fixed right-0 top-0 h-screen w-72 bg-muted/20 border-l border-border p-4 overflow-y-auto text-sm space-y-2"
			>
				<h2 className="font-bold text-lg mb-2">📜 Game Log</h2>
				{actionLog.map((entry, i) => (
					<p key={i} className="text-muted-foreground">
						{entry.message}
					</p>
				))}
			</div>

			<Dialog open={!isLoggedIn} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{mode === 'login' ? 'Login' : 'Register'}
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<Input
							placeholder="Username"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						{authError && (
							<p className="text-sm text-red-500 text-center">
								{authError}
							</p>
						)}

						<Button
							onClick={() => {
								ws?.send(
									JSON.stringify({
										type:
											mode === 'login'
												? 'login-user'
												: 'register-user',
										username: input,
										password,
									})
								);
							}}
							disabled={!input.trim() || !password.trim()}
						>
							{mode === 'login' ? 'Login' : 'Register'}
						</Button>

						<button
							onClick={() =>
								setMode((prev) =>
									prev === 'login' ? 'register' : 'login'
								)
							}
							className="text-xs text-muted-foreground hover:underline"
						>
							{mode === 'login'
								? "Don't have an account? Register"
								: 'Already have an account? Login'}
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default App;
