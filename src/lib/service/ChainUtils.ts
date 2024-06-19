
const precision = 1000000

const ChainUtils = {
  hexToAscii(str1:string) {
    if (str1.startsWith('0x')) str1 = str1.substring(2);
    const hex  = str1.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  },
  fromOnChainAmount: function (amountMicroStx: number, gftPrecision?: number|undefined) {
    try {
      if (amountMicroStx === 0) return 0;
      if (!gftPrecision) gftPrecision = 6;
      const val = (Math.round(amountMicroStx) / 1000000).toFixed(6)
      const parts = val.split('.');
      return '<span class="text-warning">' + parts[0] + '</span>.<span class="part1">' + parts[1] + '</span>'
    } catch {
      return 0
    }
  },
  toOnChainAmount: function (amount: number, gftPrecision?: number|undefined) {
    try {
      if (!gftPrecision) {
        //amount = Math.floor(amount * precision)
        //return amount; // Math.round(amount * precision) / precision
        return Math.round(amount * precision * precision) / precision
      } else {
        const newPrec = Math.pow(10, gftPrecision)
        amount = amount * newPrec
        return Math.round(amount * newPrec) / newPrec
      }
    } catch {
      return 0
    }
  },
  fromMicroAmount: function (amountMicroStx: number) {
    if (amountMicroStx === 0) return 0;
    try {
      if (amountMicroStx === 0) return 0
      const val = Math.round(amountMicroStx) / (precision)
      return val
    } catch {
      return 0
    }
  }
}
export default ChainUtils
