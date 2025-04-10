// src/components/ChatRoom.jsx
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import MessageBubble from './MessageBubble';
import CommandAutocomplete from './CommandAutocomplete';

const COMMANDS = [
	{ name: '/me', description: 'Perform an action (e.g. /me waves)' },
	{ name: '/roll', description: 'Roll dice (e.g. /roll 1d20+5)' },
];

export default function ChatRoom({
	messages,
	typingUsers,
	input,
	onInputChange,
	onSend,
}) {
	const scrollRef = useRef(null);

	const [showAutocomplete, setShowAutocomplete] = useState(false);
	const [filteredCommands, setFilteredCommands] = useState([]);
	const [activeCommandIndex, setActiveCommandIndex] = useState(0);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const nearBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight < 100;

		if (nearBottom) {
			el.scrollTop = el.scrollHeight;
		}
	}, [messages]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		onInputChange(e); // still update parent state

		if (value.startsWith('/')) {
			const filtered = COMMANDS.filter((cmd) =>
				cmd.name.startsWith(value.split(' ')[0])
			);
			setFilteredCommands(filtered);
			setShowAutocomplete(filtered.length > 0);
		} else {
			setShowAutocomplete(false);
		}
	};

	return (
		<div className="bg-zinc-800 rounded-lg shadow-lg p-4 w-full max-w-2xl flex flex-col gap-4">
			<h1 className="text-2xl font-bold text-center">
				🧠 Real-Time Chat
			</h1>

			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto max-h-[600px] space-y-2 p-2 bg-zinc-900 rounded"
			>
				{messages.map((msg) => (
					<MessageBubble
						key={msg.id}
						username={msg.username}
						text={msg.text}
						color={msg.color}
						timestamp={msg.timestamp}
						type={msg.type}
					/>
				))}
			</div>

			{typingUsers.length > 0 && (
				<div className="italic text-zinc-400 text-sm">
					{typingUsers.join(', ')}{' '}
					{typingUsers.length === 1 ? 'is' : 'are'} typing...
				</div>
			)}

			<div className="flex gap-2">
				<TextareaAutosize
					minRows={1}
					maxRows={5}
					className="flex-1 px-4 py-2 rounded bg-zinc-700 resize-none focus:outline-none focus:ring focus:ring-blue-500"
					value={input}
					onChange={handleInputChange}
					onKeyDown={(e) => {
						if (showAutocomplete) {
							if (e.key === 'ArrowDown') {
								e.preventDefault();
								setActiveCommandIndex(
									(prev) =>
										(prev + 1) % filteredCommands.length
								);
							} else if (e.key === 'ArrowUp') {
								e.preventDefault();
								setActiveCommandIndex(
									(prev) =>
										(prev - 1 + filteredCommands.length) %
										filteredCommands.length
								);
							} else if (e.key === 'Enter') {
								if (filteredCommands.length > 0) {
									e.preventDefault();
									const selected =
										filteredCommands[activeCommandIndex];
									if (selected) {
										const currentWords = input.split(' ');
										currentWords[0] = selected.name;
										onInputChange({
											target: {
												value:
													currentWords.join(' ') +
													' ',
											},
										});
										setShowAutocomplete(false);
									}
								}
							}
						} else if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							onSend();
						}
					}}
					placeholder="Type a message... (Shift+Enter for newline)"
				/>
				<button
					onClick={onSend}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
				>
					Send
				</button>
			</div>

			{showAutocomplete && (
				<CommandAutocomplete
					commands={filteredCommands}
					activeIndex={activeCommandIndex}
					onSelect={(cmd) => {
						const currentWords = input.split(' ');
						currentWords[0] = cmd;
						onInputChange({
							target: { value: currentWords.join(' ') + ' ' },
						});
						setShowAutocomplete(false);
					}}
				/>
			)}
		</div>
	);
}
