import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectFolderDomain, selectFolders, selectFolder } from '../folder.selectors';

describe('Folder: selectors', () => {
  const state = Immutable({
    folder: {
      folders: [{ data: 'data' }],
      folder: {
        name: 'A Folder',
      },
    },
  });

  describe('selectFolderDomain', () => {
    it('should select a domain', () => {
      expect(selectFolderDomain(state)).to.equal(state.folder);
    });
  });

  describe('selectFolders', () => {
    it('should select folders', () => {
      expect(selectFolders(state)).to.equal(state.folder.folders);
    });
  });

  describe('selectFolder', () => {
    it('should select a folder', () => {
      expect(selectFolder(state)).to.equal(state.folder.folder);
    });
  });
});
