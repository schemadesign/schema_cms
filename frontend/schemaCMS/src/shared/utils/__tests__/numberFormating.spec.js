import { formatPrefixedNumber } from '../numberFormating';

describe('PrefixedNumber', () => {
  it('should return proper metric prefixed number', () => {
    expect(formatPrefixedNumber(0)).toEqual('0');
    expect(formatPrefixedNumber(10)).toEqual('10');
    expect(formatPrefixedNumber(100)).toEqual('100');
    expect(formatPrefixedNumber(-100)).toEqual('-100');
    expect(formatPrefixedNumber(-100.3, 0)).toEqual('-100');
    expect(formatPrefixedNumber(560.3, 4)).toEqual('560.3');

    expect(formatPrefixedNumber(1234)).toEqual('1.2k');
    expect(formatPrefixedNumber(1234, 2)).toEqual('1.23k');

    expect(formatPrefixedNumber(1567000)).toEqual('1.6M');
    expect(formatPrefixedNumber(156700000.8)).toEqual('156.7M');
    expect(formatPrefixedNumber(-156700000)).toEqual('-156.7M');

    expect(formatPrefixedNumber(1e9)).toEqual('1G');
    expect(formatPrefixedNumber(1e12)).toEqual('1T');
  });

  it('should return original content if it is not a number', () => {
    expect(formatPrefixedNumber(null)).toEqual(null);
    expect(formatPrefixedNumber('test')).toEqual('test');
    expect(formatPrefixedNumber({})).toEqual({});
    expect(formatPrefixedNumber([1, 2])).toEqual([1, 2]);
  });
});
