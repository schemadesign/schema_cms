import { filterAllowedAttributes } from '../helpers';

describe('Helpers', () => {
  describe('filterAllowedAttributes', () => {
    it('should return input allowed props', () => {
      const onChange = Function.prototype;
      const props = { unknown: 2, value: 2, onChange };
      expect(filterAllowedAttributes('input', props)).toEqual({ value: 2, onChange });
    });

    it('should return general allowed props', () => {
      const props = { unknown: 2, value: 2 };
      expect(filterAllowedAttributes('unknown', props)).toEqual({});
    });
  });
});
