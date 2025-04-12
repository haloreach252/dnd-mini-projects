// formatNumber.ts
// Utility functions for formatting numbers in the clicker game

/**
 * Formats a number with commas as thousands separators
 * Example: 1234567 -> "1,234,567"
 */
export function formatWithCommas(value: number): string {
	return value.toLocaleString('en-US');
}

/**
 * Abbreviates large numbers with suffixes (K, M, B, T)
 * Examples:
 *   1000 -> "1K"
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

	// If the number is less than 1000, just return it as is
	if (value < 1000) {
		return value.toString();
	}

	// Calculate the abbreviation index (log base 1000)
	const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

	// Make sure we don't exceed our abbreviation array
	if (tier >= abbreviations.length) {
		// For extremely large numbers, use scientific notation
		return value.toExponential(2);
	}

	// Scale the number down based on the tier
	const scaled = value / Math.pow(1000, tier);

	// Format to 1 decimal place if there's a decimal component that's significant
	const formatted =
		scaled % 1 !== 0 && scaled < 100
			? scaled.toFixed(1)
			: Math.floor(scaled).toString();

	return `${formatted}${abbreviations[tier]}`;
}

/**
 * Formats a number in scientific notation for very large numbers
 * Example: 1234567890 -> "1.23e+9"
 */
export function formatScientific(value: number): string {
	if (value < 1e6) {
		// Only use scientific for very large numbers
		return formatWithCommas(value);
	}
	return value.toExponential(2);
}

/**
 * Smart formatter that chooses the best display format based on the size
 * For small numbers: plain number with commas
 * For medium numbers: compact with K, M, B suffixes
 * For huge numbers: scientific notation
 */
export function formatNumber(value: number): string {
	if (value < 1e3) {
		// Small numbers: just show the number
		return value.toString();
	} else if (value < 1e15) {
		// Medium numbers: use compact format with suffixes
		return formatCompact(value);
	} else {
		// Huge numbers: use scientific notation
		return formatScientific(value);
	}
}
