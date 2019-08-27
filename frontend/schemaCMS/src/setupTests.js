import '@babel/polyfill';
import 'isomorphic-fetch';
import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import nock from 'nock';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import chaiJestDiff from 'chai-jest-diff';
import MockDate from 'mockdate';
import moment from 'moment-timezone';

Enzyme.configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(chaiJestDiff());
chai.config.includeStack = true;

nock.disableNetConnect();

MockDate.set('2019-12-01T01:00:00Z');

moment.tz.setDefault('Europe/Warsaw');
jest.doMock('moment', () => moment);

afterEach(() => {
  nock.cleanAll();
});

process.env.REACT_APP_BASE_API_URL = 'http://localhost';
