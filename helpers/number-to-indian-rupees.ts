/**
 * Converts a number to Indian Rupee word format.
 * Supports up to 99 Crores.
 */
export function numberToIndianRupees(num: number): string {
    if (num === 0) return "Zero Indian Rupees";

    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertChunk = (n: number): string => {
        if (n < 20) return a[n];
        const digit = n % 10;
        return b[Math.floor(n / 10)] + (digit !== 0 ? " " + a[digit] : "");
    };

    // Helper to format groups
    const format = (n: number): string => {
        if (n === 0) return "";

        let str = "";

        // Crores (1,00,00,000)
        if (Math.floor(n / 10000000) > 0) {
            str += format(Math.floor(n / 10000000)) + " Crore ";
            n %= 10000000;
        }

        // Lakhs (1,00,000)
        if (Math.floor(n / 100000) > 0) {
            str += convertChunk(Math.floor(n / 100000)) + " Lakh ";
            n %= 100000;
        }

        // Thousands (1,000)
        if (Math.floor(n / 1000) > 0) {
            str += convertChunk(Math.floor(n / 1000)) + " Thousand ";
            n %= 1000;
        }

        // Hundreds (100)
        if (Math.floor(n / 100) > 0) {
            str += a[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }

        // Tens and Ones
        if (n > 0) {
            if (str !== "") str += "and ";
            str += convertChunk(n);
        }

        return str.trim();
    };

    const result = format(Math.floor(num));
    return `${result} Indian Rupee${num === 1 ? "" : "s"}`.trim().toUpperCase();
}