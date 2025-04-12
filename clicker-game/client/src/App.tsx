import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

import CheatSection from './components/clicker/CheatSection';
import UpgradeSection from './components/clicker/UpgradeSection';
import AuthDialog from './components/clicker/AuthDialog';
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
//import MilestoneSection from './components/clicker/MilestoneSection';
import StatsDisplay from './components/clicker/StatsDisplay';
import ClickEffect from './components/clicker/ClickEffect';

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
	criticalChance?: number;
	criticalMultiplier?: number;
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
	value: number;
	isCritical?: boolean;
};

function getComboBarColor(multiplier: number): string {
	if (multiplier >= 2) return 'bg-red-600';
	if (multiplier >= 1.5) return 'bg-yellow-400';
	if (multiplier >= 1.25) return 'bg-green-500';
	if (multiplier >= 1.1) return 'bg-blue-500';
	return 'bg-slate-500';
}

export default function App() {
	const [gameState, setGameState] = useState<GameState>(defaultGameState);
	const [messages, setMessages] = useState<Message[]>([]);
	const [actionLog, setActionLog] = useState<ActionMessage[]>([]);
	const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'disconnected'
	>('connecting');
	const [comboCount, setComboCount] = useState(0);
	const [comboMultiplier, setComboMultiplier] = useState(1);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const actionRef = useRef<HTMLDivElement | null>(null);

	const comboIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Start decaying comboCount
		comboIntervalRef.current = setInterval(() => {
			setComboCount((prev) => {
				if (prev > 0) {
					return prev - 1; // Decrease by 1 every interval
				}
				return 0;
			});
		}, 200); // Decays by 1 every 200ms (5 per second)

		return () => {
			if (comboIntervalRef.current)
				clearInterval(comboIntervalRef.current);
		};
	}, []);

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
				setActionLog((prev) => {
					const newLog = [...prev, data];
					if (newLog.length > 100) {
						newLog.splice(0, newLog.length - 100); // Keep only the last 100 messages
					}
					return newLog;
				});

				break;
			case 'click-result': {
				const goldEarned = Number(data.goldEarned) || 0;

				const effect = {
					id: Date.now(),
					x: lastClickRef.current?.x || 0,
					y: lastClickRef.current?.y || 0,
					value: goldEarned,
					isCritical: data.isCritical,
				};

				setComboMultiplier(Number(data.comboMultiplier) || 1);
				setClickEffects((prev) => [...prev, effect]);

				setTimeout(() => {
					setClickEffects((prev) =>
						prev.filter((fx) => fx.id !== effect.id)
					);
				}, 1000);
				break;
			}
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
			case 'story-message': {
				setMessages((prev) => [
					...prev,
					{ type: 'system', message: `📜 ${data.text}` },
				]);
				break;
			}
			default:
				// Handle auth-related messages
				handleAuthMessage(data);
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

	const lastClickRef = useRef<{ x: number; y: number } | null>(null);

	const handleClick = (e: React.MouseEvent) => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(
				JSON.stringify({
					type: 'click',
					comboCount,
				})
			);
			lastClickRef.current = { x: e.clientX, y: e.clientY };

			// Update combo
			setComboCount((prev) => {
				const newCount = prev + 1;
				return newCount;
			});
		} else {
			console.warn('WebSocket not connected');
		}
	};

	return (
		<div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden">
			{/* Left Column - Upgrades and Cheats */}
			<div className="w-80 border-r border-slate-700 flex flex-col bg-slate-900">
				<div className="p-3 border-b border-slate-700">
					<h2 className="text-xl font-bold text-center">Game Shop</h2>
				</div>
				<div className="flex-1 overflow-y-auto p-3 space-y-4">
					<UpgradeSection state={gameState} ws={ws} />
					<CheatSection state={gameState} ws={ws} />
				</div>
			</div>

			{/* Main Game Area */}
			<main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
				<div className="flex-1 flex flex-col items-center justify-center p-4">
					<Card className="w-full max-w-3xl text-center border-slate-700 bg-slate-900 shadow-lg">
						<CardHeader className="py-3">
							<CardTitle className="text-2xl text-slate-100">
								Miniverse Clicker <br />
								{username && (
									<span className="text-blue-400 ml-2">
										Welcome {username}
									</span>
								)}
							</CardTitle>
							<div
								className={`text-sm ${
									connectionStatus === 'connected'
										? 'text-green-400'
										: 'text-red-400'
								}`}
							>
								{connectionStatus === 'connected'
									? 'Connected'
									: connectionStatus === 'connecting'
									? 'Connecting...'
									: 'Disconnected'}
							</div>
						</CardHeader>
						<CardContent className="space-y-4 py-3">
							<StatsDisplay state={gameState} />

							<div className="w-full max-w-md mx-auto mb-2 relative">
								<div className="text-center text-xs text-fuchsia-300 font-bold mb-1">
									🔥 Combo x{comboMultiplier.toFixed(2)}
								</div>
								<div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-fuchsia-700 shadow-inner relative">
									<div
										className={`h-full transition-all duration-200 ${getComboBarColor(
											comboMultiplier
										)}`}
										style={{
											width: `${Math.min(
												comboCount,
												100
											)}%`, // 20 max → 100%
										}}
									/>

									{/* Tiers (tabs) */}
									{[20, 40, 70, 100].map((threshold) => (
										<div
											key={threshold}
											className="absolute top-0 bottom-0 w-0.5 bg-fuchsia-300 opacity-60"
											style={{
												left: `${threshold}%`,
											}}
										></div>
									))}

									{[20, 40, 70, 100].map(
										(threshold, index) => (
											<div
												key={`label-${threshold}`}
												className="absolute -top-4 text-[10px] text-fuchsia-400"
												style={{
													left: `${threshold}%`,
													transform:
														'translateX(-50%)',
												}}
											>
												x{[1.1, 1.25, 1.5, 2][index]}
											</div>
										)
									)}
								</div>
							</div>

							<div className="flex justify-center items-center w-full mt-3">
								<Button
									onClick={handleClick}
									className="h-64 w-64 py-5 bg-transparent hover:bg-blue-700/20 border-0 flex items-center justify-center"
									disabled={
										connectionStatus !== 'connected' ||
										!isLoggedIn
									}
								>
									<img
										src="/coin.png"
										alt="Coin"
										className="h-full w-full object-contain hover:scale-110 transition-transform duration-200"
									/>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Click effects */}
				{clickEffects.map((fx) => (
					<ClickEffect
						key={fx.id}
						id={fx.id}
						x={fx.x}
						y={fx.y}
						value={fx.value}
						isCritical={fx.isCritical}
					/>
				))}

				{/* System Messages */}
				<div
					ref={messagesRef}
					className="h-24 overflow-y-auto bg-slate-800 text-sm p-2 border-t border-slate-700"
				>
					<h3 className="font-bold mb-1 text-slate-300 text-xs uppercase">
						System Messages
					</h3>
					<div className="space-y-1">
						{messages.map((msg, i) => (
							<p
								key={i}
								className="text-slate-400 italic text-xs"
							>
								{msg.message}
							</p>
						))}
					</div>
				</div>
			</main>

			{/* Right Column - Game Log */}
			<div className="w-64 border-l border-slate-700 flex flex-col bg-slate-900">
				<div className="p-3 border-b border-slate-700">
					<h2 className="font-bold text-slate-200">📜 Game Log</h2>
				</div>
				<div
					ref={actionRef}
					className="flex-1 overflow-y-auto p-3 text-sm space-y-1"
				>
					{actionLog.map((entry, i) => (
						<p key={i} className="text-slate-400 text-xs">
							{entry.message}
						</p>
					))}
				</div>
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
