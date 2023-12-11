
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const FormatUtils = {
  fmtAmount: function (amount:number, currency:string) {
    if (currency === 'stx') {
      return formatter.format(amount).replace('$', '') // &#931;
    }
  },
  fmtNumber: function (amount:number|undefined) {
    if (amount === 0) return 0;
    if (amount) return new Intl.NumberFormat().format(amount);
  }
}
export default FormatUtils
