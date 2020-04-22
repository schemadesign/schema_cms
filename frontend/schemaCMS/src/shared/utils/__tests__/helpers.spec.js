import { errorMessageParser, generateApiUrl, getPageUrlOptions, handleToggleMenu } from '../helpers';
import { internalConnections } from '../../../modules/sections/sections.mocks';

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
  describe('handleToggleMenu', () => {
    it('should add resize listener', () => {
      const that = { setState: Function.prototype, state: { isMenuOpen: false } };
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(that, 'setState');
      handleToggleMenu(that);
      expect(window.addEventListener).toBeCalledWith('resize', expect.any(Function));
      expect(that.setState).toBeCalledWith({ isMenuOpen: true });
    });
  });

  it('should remove resize listener', () => {
    const that = { setState: Function.prototype, state: { isMenuOpen: true } };
    jest.spyOn(window, 'removeEventListener');
    jest.spyOn(that, 'setState');
    handleToggleMenu(that);
    expect(window.removeEventListener).toBeCalledWith('resize', expect.any(Function));
    expect(that.setState).toBeCalledWith({ isMenuOpen: false });
  });

  it('should return page url options', () => {
    const data = {
      internalConnections,
      domain: 'http://domain.com',
      pageId: 4,
    };
    const pageUrlOptions = getPageUrlOptions(data);

    expect(pageUrlOptions).toEqual([
      { label: 'Blog', value: 'http://domain.com/blog' },
      { label: 'news   >   Article 2', value: 'http://domain.com/News/article-2' },
      { label: 'News', value: 'http://domain.com/news' },
    ]);
  });
});
