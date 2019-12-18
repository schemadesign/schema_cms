import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectUserProfileDomain,
  selectIsFetched,
  selectIsAdmin,
  selectDataWranglingDetail,
  selectUserData,
  selectUserId,
} from '../userProfile.selectors';
import { ROLES } from '../userProfile.constants';

describe('UserProfile: selectors', () => {
  const state = Immutable({
    userProfile: {
      isFetched: false,
      isAdmin: true,
      user: { id: '1', role: ROLES.ADMIN },
      dataWranglingDetail: { data: 'data' },
    },
  });

  describe('selectUserProfileDomain', () => {
    it('should select a domain', () => {
      expect(selectUserProfileDomain(state)).to.equal(state.userProfile);
    });

    describe('selectIsFetched', () => {
      it('should select if user is fetched', () => {
        expect(selectIsFetched(state)).to.equal(state.userProfile.isFetched);
      });
    });

    describe('selectUserData', () => {
      it('should select user', () => {
        expect(selectUserData(state)).to.equal(state.userProfile.user);
      });
    });

    describe('selectDataWranglingDetail', () => {
      it('should select dataWranglingDetail', () => {
        expect(selectDataWranglingDetail(state)).to.equal(state.userProfile.dataWranglingDetail);
      });
    });

    describe('selectIsAdmin', () => {
      it('should select if user is admin', () => {
        expect(selectIsAdmin(state)).to.equal(state.userProfile.user.role === ROLES.ADMIN);
      });
    });

    describe('selectUserId', () => {
      it('should select user id', () => {
        expect(selectUserId(state)).to.equal(state.userProfile.user.id);
      });
    });
  });
});
