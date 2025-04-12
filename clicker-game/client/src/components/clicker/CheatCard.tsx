import { Button } from '@/components/ui/button';

type CheatCardProps = {
	id: string;
	name: string;
	description: string;
	onUse: (id: string) => void;
};

export default function CheatCard({
	id,
	name,
	description,
	onUse,
}: CheatCardProps) {
	return (
		<div className="border border-purple-800 rounded-md overflow-hidden bg-slate-800">
			<div className="p-2">
				<div className="flex items-center">
					<h3 className="font-semibold text-base text-purple-300">
						{name}
					</h3>
				</div>

				<p className="text-xs text-slate-400 mt-1 leading-tight">
					{description}
				</p>
			</div>

			<div className="bg-slate-700 px-2 py-1.5 flex justify-end text-xs">
				<Button
					onClick={() => onUse(id)}
					size="sm"
					className="bg-purple-700 hover:bg-purple-800 text-white text-xs py-0.5 h-6 px-2"
				>
					Activate
				</Button>
			</div>
		</div>
	);
}
