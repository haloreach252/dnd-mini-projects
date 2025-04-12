import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { type GameState } from '@/App';

export type CheatSectionProps = {
	state: GameState;
	ws: WebSocket | null;
};

function CheatSection({ state, ws }: CheatSectionProps) {
	return (
		<Card className="w-full max-w-md text-center">
			<CardHeader>
				<CardTitle className="text-3xl">Cheats</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{state.cheats.map((cheat) => (
					<Button
						key={cheat.id}
						onClick={() => {
							ws?.send(
								JSON.stringify({
									type: 'use-cheat',
									cheatId: cheat.id,
								})
							);
						}}
						className="w-full"
					>
						{cheat.name}
						<div className="text-xs text-muted-foreground">
							{cheat.description}
						</div>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}

export default CheatSection;
