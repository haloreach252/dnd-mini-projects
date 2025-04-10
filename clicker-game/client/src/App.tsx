import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Message = {
	type: 'system';
	message: string;
};

function App() {
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [username, setUsername] = useState('');
	const [input, setInput] = useState('');
	const [dialogOpen, setDialogOpen] = useState(true);
	const [count, setCount] = useState(0);
	const [messages, setMessages] = useState<Message[]>([]);

	const messagesRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		const socket = new WebSocket('ws://localhost:3001');
		setWs(socket);

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'init' || data.type === 'update') {
				setCount(data.count);
			} else if (data.type === 'system') {
				setMessages((prev) => [
					...prev,
					{ type: 'system', message: data.message },
				]);
			}
		};

		return () => socket.close();
	}, []);

	const registerUsername = () => {
		setUsername(input);
		setDialogOpen(false);
		ws?.send(JSON.stringify({ type: 'register', username: input }));
	};

	const handleClick = () => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: 'click' }));
		}
	};

	return (
		<>
			<main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 gap-6">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle className="text-3xl">
							🖱️ Real-Time Clicker
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-lg">
							Total Clicks:{' '}
							<span className="font-bold">{count}</span>
						</p>
						<Button
							onClick={handleClick}
							className="w-full text-lg py-6"
						>
							Click Me!
						</Button>
					</CardContent>
				</Card>

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

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter your username</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<Input
							placeholder="e.g., EldritchWanderer"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && input.trim())
									registerUsername();
							}}
						/>
						<Button
							onClick={registerUsername}
							disabled={!input.trim()}
						>
							Join
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default App;
