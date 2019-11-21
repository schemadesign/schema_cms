import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDirectoryDomain, selectDirectories } from '../directory.selectors';

describe('Directory: selectors', () => {
  const state = Immutable({
    directory: {
      directories: [{ data: 'data' }],
    },
  });

  describe('selectDirectoryDomain', () => {
    it('should select a domain', () => {
      expect(selectDirectoryDomain(state)).to.equal(state.directory);
    });
  });

  describe('selectDirectories', () => {
    it('should select a directories', () => {
      expect(selectDirectories(state)).to.equal(state.directory.directories);
    });
  });
});
