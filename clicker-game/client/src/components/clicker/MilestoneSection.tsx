// MilestoneSection.tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { type GameState } from '@/App';

type MilestoneSectionProps = {
	state: GameState;
};

export default function MilestoneSection({ state }: MilestoneSectionProps) {
	return (
		<Card className="w-full max-w-md text-center">
			<CardHeader>
				<CardTitle className="text-3xl">Milestones</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{state.milestones?.length > 0 ? (
					<div className="grid grid-cols-2 gap-2">
						{state.milestones.map((milestone) => (
							<div
								key={milestone.id}
								className={`p-3 rounded border ${
									milestone.completed
										? 'bg-green-800 border-green-300'
										: 'bg-gray-800 border-gray-200'
								}`}
							>
								<div className="text-2xl">{milestone.icon}</div>
								<div className="font-bold">
									{milestone.name}
								</div>
								<div className="text-xs text-muted-foreground">
									{milestone.description}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No milestones yet</p>
				)}
			</CardContent>
		</Card>
	);
}
