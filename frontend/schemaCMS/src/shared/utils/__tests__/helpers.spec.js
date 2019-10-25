import { errorMessageParser, generateApiUrl } from '../helpers';

describe('Helpers', () => {
  describe('generateApiUrl', () => {
    it('should generate api url', () => {
      global.expect(generateApiUrl('slug')).toEqual('schemacms/api/slug');
    });

    it('should generate empty string', () => {
      global.expect(generateApiUrl()).toEqual('');
    });
  });

  describe('errorMessageParser', () => {
    it('should parse error messages', () => {
      const errors = [{ code: 'unique', name: 'name' }, { code: 'unique', name: 'data' }];
      const message = 'DataSource with this name already exist in project.';
      const messages = { nameUniqueError: { message } };
      const formatMessage = ({ message }) => message;
      const result = { name: message, data: 'Something went wrong.' };

      global.expect(errorMessageParser({ errors, messages, formatMessage })).toEqual(result);
    });
  });
});
