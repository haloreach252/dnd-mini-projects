import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
						<ReactMarkdown
							children={text}
							remarkPlugins={[remarkGfm]}
							components={{
								a: (props) => (
									<a
										{...props}
										className="text-blue-400 underline hover:text-blue-300"
										target="_blank"
										rel="noopener noreferrer"
									/>
								),
								code: ({ inline, children }) =>
									inline ? (
										<code className="bg-zinc-700 px-1 rounded text-yellow-300">
											{children}
										</code>
									) : (
										<pre className="bg-zinc-800 p-2 rounded overflow-x-auto">
											<code>{children}</code>
										</pre>
									),
							}}
						/>
					</>
				)}
			</div>
			<span className="text-xs text-zinc-400 pl-2">{timeAgo}</span>
		</div>
	);
}
