interface Calculation {
    gst: number,
    amountInclusive: number,
    amountExclusive: number
}

function round(value: number): number {
    return Number(Math.round(parseFloat(value + 'e' + 2)) + 'e-' + 2)
}

function getGst(value: number): number {
    return round(value * 3 / 23);
}

function addGst(value: number): number {
    return round(value * 1.15);
}

function subtractGst(value: number): number {
    return round(value - getGst(value));
}

function handle(input: number|string): Calculation {
    let value = input;

    if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^0-9.]/g, ''));
    }

    value = round(value);

    return {
        gst: getGst(value),
        amountInclusive: addGst(value),
        amountExclusive: subtractGst(value)
    }
}

export default handle;