import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

import CheatSection from './components/clicker/CheatSection';
import UpgradeSection from './components/clicker/UpgradeSection';
import AuthDialog from './components/clicker/AuthDialog';
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import MilestoneSection from './components/clicker/MilestoneSection';

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
	milestones?: {
		id: string;
		name: string;
		description: string;
		icon: string;
		completed: boolean;
	}[];
	goldMultiplier?: number;
};

const defaultGameState: GameState = {
	clickCount: 0,
	gold: 0,
	clickPower: 1,
	autoClickers: 0,
	upgrades: [],
	cheats: [],
	milestones: [],
	goldMultiplier: 1,
};

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

export default function App() {
	const [gameState, setGameState] = useState<GameState>(defaultGameState);
	const [messages, setMessages] = useState<Message[]>([]);
	const [actionLog, setActionLog] = useState<ActionMessage[]>([]);
	const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'disconnected'
	>('connecting');
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const actionRef = useRef<HTMLDivElement | null>(null);

	const {
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
		handleMessage: handleAuthMessage,
		logout,
	} = useAuth(ws);

	useWebSocket((data, socketInstance) => {
		if (socketInstance.readyState === WebSocket.OPEN) {
			setConnectionStatus('connected');
		} else {
			setConnectionStatus('disconnected');
		}

		// Handle different message types
		switch (data.type) {
			case 'init':
				console.log('Received initial state:', data.state);
				setGameState(data.state);
				break;
			case 'update':
				setGameState(data.state);
				break;
			case 'system':
				setMessages((prev) => [...prev, data]);
				break;
			case 'action':
				setActionLog((prev) => [...prev, data]);
				break;
			default:
				// Handle auth-related messages
				handleAuthMessage(data);
				break;
			case 'milestone-achieved':
				// Add a special animation or notification when milestone is achieved
				setMessages((prev) => [
					...prev,
					{
						type: 'system',
						message: `🏆 ${data.username} achieved milestone: ${data.milestone.name}! Reward: ${data.milestone.reward}`,
					},
				]);
				break;
		}

		setWs(socketInstance);
	});

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (actionRef.current) {
			actionRef.current.scrollTop = actionRef.current.scrollHeight;
		}
	}, [actionLog]);

	const handleClick = (e: React.MouseEvent) => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: 'click' }));

			const rect = (e.target as HTMLElement).getBoundingClientRect();
			const effect = {
				id: Date.now(),
				x: e.clientX,
				y: e.clientY,
				text: `+${gameState.clickPower}`,
			};
			setClickEffects((prev) => [...prev, effect]);
			setTimeout(() => {
				setClickEffects((prev) =>
					prev.filter((fx) => fx.id !== effect.id)
				);
			}, 1000);
		} else {
			console.warn('WebSocket not connected');
		}
	};

	return (
		<div className="flex">
			<main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 flex-1">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle className="text-3xl">
							🖱️ Real-Time Clicker <br />
							{username && <span>{username}</span>}
						</CardTitle>
						<div
							className={`text-sm ${
								connectionStatus === 'connected'
									? 'text-green-500'
									: 'text-red-500'
							}`}
						>
							{connectionStatus === 'connected'
								? 'Connected'
								: connectionStatus === 'connecting'
								? 'Connecting...'
								: 'Disconnected'}
						</div>
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
							disabled={
								connectionStatus !== 'connected' || !isLoggedIn
							}
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
				<MilestoneSection state={gameState} />
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

			{isLoggedIn && (
				<Button
					className="fixed bottom-4 left-4"
					variant="outline"
					size="sm"
					onClick={logout}
				>
					Logout
				</Button>
			)}

			<AuthDialog
				isOpen={!isLoggedIn}
				mode={mode}
				setMode={setMode}
				input={input}
				setInput={setInput}
				password={password}
				setPassword={setPassword}
				authError={authError}
				submit={submit}
			/>
		</div>
	);
}
