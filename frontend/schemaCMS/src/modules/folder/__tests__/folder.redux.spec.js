import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as folderReducer, FolderRoutines } from '../folder.redux';

describe('Folder: redux', () => {
  const state = Immutable({
    folders: [],
    folder: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(folderReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(folderReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when FOLDER/FETCH_LIST action is received', () => {
    it('should set filters', () => {
      const folders = [{ data: 'data' }];

      const resultState = folderReducer(state, FolderRoutines.fetchList.success(folders));
      expect(resultState.folders).to.deep.equal(folders);
    });
  });

  describe('when FOLDER/FETCH_ONE action is received', () => {
    it('should set filters', () => {
      const folder = { data: 'data' };

      const resultState = folderReducer(state, FolderRoutines.fetchOne.success(folder));
      expect(resultState.folder).to.deep.equal(folder);
    });
  });
});
