export function getClassName(...str: (string | number | object)[]): string {
	return str
		.reduce((acc: string[], s: string | number | object) => {
			if (!s) return acc;

			const isAnString = typeof s === 'string';
			const isANumber = typeof s === 'number';
			const isAnObject = typeof s === 'object' && s !== null;

			if (isAnString || isANumber) {
				acc.push(s.toString());
			}

			if (isAnObject) {
				const [key, value] = Object.entries(s)[0];
				acc = acc.concat(value ? key : []);
			}

			return acc;
		}, [])
		.join(' ');
}

export function hexToRgb(
	color: string
): { r: number; g: number; b: number } | {} {
	const isHexColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
	if (!isHexColor.test(color)) return {};

	const hex = color.slice(1);
	// If the color is only 3 characters, expand it to 6 characters by doubling each character
	const expandedHex =
		hex.length === 3
			? hex
					.split('')
					.map((c) => c + c)
					.join('')
			: hex;

	const r = parseInt(expandedHex.slice(0, 2), 16);
	const g = parseInt(expandedHex.slice(2, 4), 16);
	const b = parseInt(expandedHex.slice(4), 16);

	return { r, g, b };
}
