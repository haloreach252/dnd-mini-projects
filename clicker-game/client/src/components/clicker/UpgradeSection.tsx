import { GameState } from '@/App';
import UpgradeCard from './UpgradeCard';

type UpgradeSectionProps = {
	state: GameState;
	ws: WebSocket | null;
};

export default function UpgradeSection({ state, ws }: UpgradeSectionProps) {
	const handlePurchase = (upgradeId: string) => {
		ws?.send(
			JSON.stringify({
				type: 'purchase-upgrade',
				upgradeId: upgradeId,
			})
		);
	};

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">
				Upgrades
			</h3>
			<div className="grid grid-cols-1 gap-3">
				{state.upgrades.map((upgrade) => (
					<UpgradeCard
						key={upgrade.id}
						id={upgrade.id}
						name={upgrade.name}
						description={upgrade.description}
						cost={upgrade.cost}
						level={upgrade.level}
						canBuy={upgrade.canBuy}
						gold={state.gold}
						onPurchase={handlePurchase}
					/>
				))}
			</div>
		</div>
	);
}
