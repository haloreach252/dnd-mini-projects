export default function CommandAutocomplete({
	commands,
	onSelect,
	activeIndex,
}) {
	return (
		<div className="absolute bottom-14 left-2 w-64 bg-zinc-800 border border-zinc-700 rounded shadow text-sm z-10">
			{commands.map((cmd, i) => (
				<div
					key={cmd.name}
					onClick={() => onSelect(cmd.name)}
					className={`px-4 py-2 cursor-pointer ${
						i === activeIndex
							? 'bg-blue-600 text-white'
							: 'hover:bg-zinc-700'
					}`}
				>
					<span className="font-semibold">{cmd.name}</span>
					<span className="ml-2 text-zinc-400">
						{cmd.description}
					</span>
				</div>
			))}
		</div>
	);
}
