import NumberDisplay from './NumberDisplay';
import { GameState } from '@/App';

interface StatsDisplayProps {
	state: GameState;
}

export default function StatsDisplay({ state }: StatsDisplayProps) {
	return (
		<div className="grid grid-cols-3 gap-2 w-full">
			<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
				<div className="text-xs text-slate-400">Total Clicks</div>
				<div className="font-bold text-lg text-slate-200">
					<NumberDisplay value={state.clickCount} />
				</div>
			</div>

			<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
				<div className="text-xs text-slate-400">Gold</div>
				<div className="font-bold text-lg text-amber-400">
					<NumberDisplay value={state.gold} />
				</div>
			</div>

			<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
				<div className="text-xs text-slate-400">Click Power</div>
				<div className="font-bold text-lg text-blue-400">
					<NumberDisplay
						value={state.clickPower}
						tooltipText="Gold per click"
					/>
				</div>
			</div>

			<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
				<div className="text-xs text-slate-400">Auto-Clickers</div>
				<div className="font-bold text-lg text-green-400">
					<NumberDisplay
						value={state.autoClickers}
						tooltipText={`${
							state.autoClickers * state.clickPower
						} gold per second`}
					/>
				</div>
			</div>

			{state.criticalChance !== undefined && (
				<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
					<div className="text-xs text-slate-400">Crit Chance</div>
					<div className="font-bold text-lg text-fuchsia-400">
						{(state.criticalChance * 100).toFixed(1)}%
					</div>
				</div>
			)}

			{state.criticalMultiplier !== undefined && (
				<div className="bg-slate-800 rounded-md p-2 text-center border border-slate-700">
					<div className="text-xs text-slate-400">
						Crit Multiplier
					</div>
					<div className="font-bold text-lg text-yellow-300">
						×{state.criticalMultiplier.toFixed(1)}
					</div>
				</div>
			)}
		</div>
	);
}
