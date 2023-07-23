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
