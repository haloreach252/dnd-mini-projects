import { type GameState } from '@/App';
import CheatCard from './CheatCard';

export type CheatSectionProps = {
	state: GameState;
	ws: WebSocket | null;
};

function CheatSection({ state, ws }: CheatSectionProps) {
	const handleUseCheat = (cheatId: string) => {
		ws?.send(
			JSON.stringify({
				type: 'use-cheat',
				cheatId: cheatId,
			})
		);
	};

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">
				Cheats
			</h3>
			<div className="grid grid-cols-1 gap-3">
				{state.cheats.map((cheat) => (
					<CheatCard
						key={cheat.id}
						id={cheat.id}
						name={cheat.name}
						description={cheat.description}
						onUse={handleUseCheat}
					/>
				))}
			</div>
		</div>
	);
}

export default CheatSection;
