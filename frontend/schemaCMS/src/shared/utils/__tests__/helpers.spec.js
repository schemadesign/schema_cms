import { errorMessageParser, generateApiUrl } from '../helpers';

describe('Helpers', () => {
  describe('generateApiUrl', () => {
    it('should generate api url', () => {
      expect(generateApiUrl('slug')).toEqual('schemacms/api/slug');
    });

    it('should generate empty string', () => {
      expect(generateApiUrl()).toEqual('');
    });
  });

  describe('errorMessageParser', () => {
    it('should parse error messages', () => {
      const errors = [{ code: 'unique', name: 'name' }, { code: 'unique', name: 'data' }];
      const message = 'DataSource with this name already exist in project.';
      const messages = { nameUniqueError: { message } };
      const formatMessage = ({ message }) => message;
      const result = { name: message, data: 'Something went wrong.' };

      expect(errorMessageParser({ errors, messages, formatMessage })).toEqual(result);
    });

    it('should return empty object if errors is not a array', () => {
      const errors = {};
      const message = 'DataSource with this name already exist in project.';
      const messages = { nameUniqueError: { message } };
      const formatMessage = ({ message }) => message;

      expect(errorMessageParser({ errors, messages, formatMessage })).toEqual({});
    });
  });
});
