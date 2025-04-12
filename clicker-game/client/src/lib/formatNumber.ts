/**
 * Formats a number with commas as thousands separators
 * Example: 1234567 -> "1,234,567"
 */
export function formatWithCommas(value: number): string {
	return Math.round(value).toLocaleString('en-US');
}

/**
 * Abbreviates large numbers with suffixes (K, M, B, T, etc.)
 * Examples:
 *   1500 -> "1.5K"
 *   1000000 -> "1M"
 */
export function formatCompact(value: number): string {
	const abbreviations = [
		'',
		'K',
		'M',
		'B',
		'T',
		'Qa',
		'Qi',
		'Sx',
		'Sp',
		'Oc',
		'No',
		'Dc',
	];

	if (value < 1000) {
		return Math.round(value).toString();
	}

	const tier = Math.floor(Math.log10(value) / 3);
	if (tier >= abbreviations.length) {
		return formatScientific(value);
	}

	const scaled = value / Math.pow(1000, tier);

	// Show 1 decimal if scaled < 100 and has a decimal part, else whole number
	const formatted =
		scaled < 100 && scaled % 1 !== 0
			? scaled.toFixed(1)
			: Math.round(scaled).toString();

	return `${formatted}${abbreviations[tier]}`;
}

/**
 * Formats a number in scientific notation for very large numbers
 * Example: 1234567890 -> "1.23e+9"
 */
export function formatScientific(value: number): string {
	return value.toExponential(2);
}

/**
 * Smart formatter based on size:
 * - Small: use commas
 * - Medium: abbreviate
 * - Huge: scientific
 */
export function formatNumber(value: number): string {
	if (value < 1e3) {
		return formatWithCommas(value);
	} else if (value < 1e15) {
		return formatCompact(value);
	} else {
		return formatScientific(value);
	}
}
