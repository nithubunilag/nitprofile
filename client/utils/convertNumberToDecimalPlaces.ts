export const convertNumberToDecimalPlaces = (x: number, decimalAmount: number = 2) => {
    return parseFloat(x.toFixed(decimalAmount))
}
