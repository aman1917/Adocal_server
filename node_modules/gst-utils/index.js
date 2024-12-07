function round(value) {
    return Number(Math.round(parseFloat(value + 'e' + 2)) + 'e-' + 2);
}
function getGst(value) {
    return round(value * 3 / 23);
}
function addGst(value) {
    return round(value * 1.15);
}
function subtractGst(value) {
    return round(value - getGst(value));
}
function handle(input) {
    let value = input;
    if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^0-9.]/g, ''));
    }
    value = round(value);
    return {
        gst: getGst(value),
        amountInclusive: addGst(value),
        amountExclusive: subtractGst(value)
    };
}
export default handle;
//# sourceMappingURL=index.js.map