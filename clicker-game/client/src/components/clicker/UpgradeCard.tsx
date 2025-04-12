import { Button } from '@/components/ui/button';
import NumberDisplay from './NumberDisplay';

type UpgradeCardProps = {
	id: string;
	name: string;
	description: string;
	cost: number;
	level: number;
	canBuy: boolean;
	gold: number;
	onPurchase: (id: string) => void;
};

export default function UpgradeCard({
	id,
	name,
	description,
	cost,
	level,
	canBuy,
	gold,
	onPurchase,
}: UpgradeCardProps) {
	const canAfford = gold >= cost;

	return (
		<div className="border border-slate-700 rounded-md overflow-hidden bg-slate-800">
			<div className="p-2">
				<div className="flex justify-between items-center">
					<h3 className="font-semibold text-base">{name}</h3>
					<div className="text-xs rounded-full bg-slate-700 px-2 py-1 text-slate-300">
						Lv. <NumberDisplay value={level} compact={false} />
					</div>
				</div>

				<p className="text-xs text-slate-400 mt-1 leading-tight">
					{description}
				</p>
			</div>

			<div className="bg-slate-700 px-2 py-1.5 flex justify-between items-center text-xs">
				<div className="font-medium text-slate-300">
					<NumberDisplay value={cost} className="text-amber-400" />{' '}
					Gold
				</div>

				<Button
					onClick={() => onPurchase(id)}
					disabled={!canBuy || !canAfford}
					size="sm"
					variant={canBuy && canAfford ? 'default' : 'outline'}
					className={`text-xs py-0.5 h-6 px-2 ${
						canBuy && canAfford
							? 'bg-blue-600 hover:bg-blue-700'
							: ''
					}`}
				>
					{!canBuy
						? 'Unavailable'
						: !canAfford
						? "Can't afford"
						: 'Purchase'}
				</Button>
			</div>
		</div>
	);
}
