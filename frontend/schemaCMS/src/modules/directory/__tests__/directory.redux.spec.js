import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as directoryReducer, DirectoryRoutines } from '../directory.redux';

describe('Directory: redux', () => {
  const state = Immutable({
    directories: [],
    directory: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(directoryReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(directoryReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when FILTERS/FETCH_LIST action is received', () => {
    it('should set filters', () => {
      const directories = [{ data: 'data' }];

      const resultState = directoryReducer(state, DirectoryRoutines.fetchList.success(directories));
      expect(resultState.directories).to.deep.equal(directories);
    });
  });

  describe('when FILTERS/CREATE action is received', () => {
    it('should set filters', () => {
      const directory = { data: 'data' };

      const resultState = directoryReducer(state, DirectoryRoutines.create.success(directory));
      expect(resultState.directory).to.deep.equal(directory);
    });
  });
});
