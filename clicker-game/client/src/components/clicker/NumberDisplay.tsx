import React from 'react';
import { formatNumber, formatWithCommas } from '../../lib/formatNumber';
import { Tooltip } from '@/components/ui/tooltip';
import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface NumberDisplayProps {
	value: number;
	compact?: boolean;
	className?: string;
	tooltipText?: string;
}

/**
 * Component to display numbers in a formatted way with optional tooltip showing the exact value
 */
export default function NumberDisplay({
	value,
	compact = true,
	className = '',
	tooltipText,
}: NumberDisplayProps) {
	const formattedValue = compact
		? formatNumber(value)
		: formatWithCommas(value);
	const tooltipValue = formatWithCommas(value);

	// If we don't need a tooltip, just render the formatted value
	if (!tooltipText && value < 1000) {
		return <span className={className}>{formattedValue}</span>;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className={`${className} cursor-help`}>
						{formattedValue}
					</span>
				</TooltipTrigger>
				<TooltipContent className="bg-slate-900 border-slate-700 text-slate-200">
					<div className="text-center">
						{tooltipText || 'Exact value'}: {tooltipValue}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
