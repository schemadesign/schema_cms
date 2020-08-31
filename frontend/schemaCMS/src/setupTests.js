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
import dayjs from 'dayjs';
import ReactModal from 'react-modal';
import React from 'react';
import * as effects from 'redux-saga/effects';

Enzyme.configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(chaiJestDiff());
chai.config.includeStack = true;

nock.disableNetConnect();

MockDate.set('2019-12-01T01:00:00Z');

ReactModal.setAppElement = Function.prototype;
jest.doMock('react-modal', () => ReactModal);
jest.doMock('dayjs', () => dayjs);
jest.doMock('redux-saga/effects', () => ({
  ...effects,
  delay: () => {},
}));
jest.doMock('react-syntax-highlighter/dist/esm/styles/hljs', () => ({
  docco: {},
}));
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: node => node,
}));
jest.doMock('react-dnd-multi-backend/dist/esm/HTML5toTouch', () => ({}));

jest.mock('react-dnd', () => ({
  // eslint-disable-next-line react/prop-types
  DndProvider: ({ children }) => <span>{children}</span>,
  useDrop: () => [null, data => data],
  useDrag: () => [{ isDragging: false }, data => data, data => data],
}));

jest.mock('./shared/utils/reportError', () => ({
  __esModule: true,
  default: jest.fn(),
}));

window.scrollTo = jest.fn();

nock.disableNetConnect();

beforeEach(() => {
  if (!nock.isActive()) {
    nock.activate();
  }
});

const nockCleanup = () => {
  nock.cleanAll();
  nock.restore();
};

afterEach(() => {
  if (!nock.isDone()) {
    nockCleanup();
    throw new Error('Not all nock interceptors were used!');
  }
  nockCleanup();
});

process.env.REACT_APP_BASE_API_URL = 'http://localhost';
