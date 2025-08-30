export default {
	hexToDecimal: async (hex) => {
		// Remove any leading "0x" if present
		hex = hex.replace(/^0x/, '');

		// Convert hex digits to uppercase
		hex = hex.toUpperCase();

		const hexDigits = '0123456789ABCDEF';
		let decimal = 0;

		for (let i = 0; i < hex.length; i++) {
			const digit = hex[i];
			const value = hexDigits.indexOf(digit);
			decimal += value * Math.pow(16, hex.length - i - 1);
		}
		
		await storeValue('scan_to_update', decimal, false);
		return decimal;
	}
}