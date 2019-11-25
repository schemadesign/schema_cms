import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDirectoryDomain, selectDirectories, selectDirectory } from '../directory.selectors';

describe('Directory: selectors', () => {
  const state = Immutable({
    directory: {
      directories: [{ data: 'data' }],
      directory: {
        name: 'A Directory',
      },
    },
  });

  describe('selectDirectoryDomain', () => {
    it('should select a domain', () => {
      expect(selectDirectoryDomain(state)).to.equal(state.directory);
    });
  });

  describe('selectDirectories', () => {
    it('should select directories', () => {
      expect(selectDirectories(state)).to.equal(state.directory.directories);
    });
  });

  describe('selectDirectory', () => {
    it('should select a directory', () => {
      expect(selectDirectory(state)).to.equal(state.directory.directory);
    });
  });
});
