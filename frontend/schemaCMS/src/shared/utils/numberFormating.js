import { is, identity, memoizeWith } from 'ramda';

const METRICS = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
];

const getRounding = memoizeWith(identity, (decimals = 1) => {
  let rounding = 1;
  let i = decimals - 1;

  for (i; i >= 0; i--) {
    rounding *= 10;
  }

  return rounding;
});

export const formatPrefixedNumber = (number, decimals = 1) => {
  if (!is(Number, number)) {
    return number;
  }

  const absNumer = Math.abs(number);
  let i = METRICS.length - 1;

  for (i; i >= 0; i--) {
    if (absNumer >= METRICS[i].value) {
      break;
    }
  }

  const { symbol, value } = METRICS[i] || METRICS[0];
  const rounding = getRounding(decimals);
  const roundedValue = Math.round((number / value) * rounding) / rounding;

  return `${roundedValue}${symbol}`;
};
