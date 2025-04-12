import { motion } from 'framer-motion';
import { formatNumber } from '../../lib/formatNumber';

type ClickEffectProps = {
	id: number;
	x: number;
	y: number;
	value: number;
	isCritical?: boolean;
};

export default function ClickEffect({
	id,
	x,
	y,
	value,
	isCritical,
}: ClickEffectProps) {
	// Format the click value
	const formattedValue = `+${formatNumber(value)}`;

	return (
		<motion.div
			key={id}
			initial={{ opacity: 1, y: 0, scale: 1 }}
			animate={{ opacity: 0, y: -40, scale: isCritical ? 1.8 : 1.2 }}
			transition={{ duration: 1, ease: 'easeOut' }}
			className={`pointer-events-none fixed select-none text-xl font-bold ${
				isCritical ? 'text-fuchsia-400' : 'text-amber-400'
			}`}
			style={{
				left: x,
				top: y,
				textShadow: '0 0 3px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,0.8)',
			}}
		>
			{isCritical ? `💥${formattedValue}` : `${formattedValue}`}
		</motion.div>
	);
}
