import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { GameState } from '@/App';

type UpgradeSectionProps = {
	state: GameState;
	ws: WebSocket | null;
};

export default function UpgradeSection({ state, ws }: UpgradeSectionProps) {
	return (
		<Card className="w-full max-w-md text-center">
			<CardHeader>
				<CardTitle className="text-3xl">Upgrades</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{state.upgrades.map((upgrade) => (
					<Button
						key={upgrade.id}
						onClick={() =>
							ws?.send(
								JSON.stringify({
									type: 'purchase-upgrade',
									upgradeId: upgrade.id,
								})
							)
						}
						disabled={!upgrade.canBuy || state.gold < upgrade.cost}
						className="w-full"
					>
						{upgrade.name} (Lv. {upgrade.level}) – {upgrade.cost}{' '}
						Gold
						<div className="text-xs text-muted-foreground">
							{upgrade.description}
						</div>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
