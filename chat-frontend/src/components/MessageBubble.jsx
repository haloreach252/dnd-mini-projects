// src/components/MessageBubble.jsx
import { formatDistanceToNow } from 'date-fns';

export default function MessageBubble({
	username,
	text,
	color,
	timestamp,
	type,
}) {
	const timeAgo = formatDistanceToNow(new Date(timestamp), {
		addSuffix: true,
	});

	return (
		<div className="text-sm flex flex-col">
			<div
				className={`whitespace-pre-wrap ${
					type === 'system' ? 'italic text-zinc-400' : ''
				}`}
			>
				{type === 'system' ? (
					text
				) : (
					<>
						<span className="font-semibold" style={{ color }}>
							{username}:
						</span>{' '}
						{text}
					</>
				)}
			</div>
			<span className="text-xs text-zinc-400 pl-2">{timeAgo}</span>
		</div>
	);
}
