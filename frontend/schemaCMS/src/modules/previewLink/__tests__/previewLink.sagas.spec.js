import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchPreviewLink } from '../previewLink.sagas';
import { PreviewLinkRoutines } from '../previewLink.redux';
import { fetchResponse } from '../previewLink.mocks';

describe('PreviewLink: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchPreviewLink)
      .withState(defaultState)
      .put(PreviewLinkRoutines.noop.success())
      .dispatch(PreviewLinkRoutines.noop())
      .silentRun();
  });

  describe('when /FETCH_LINK action is fired', () => {
    it('should put fetchLink action', async () => {
      const url = 'https://thisisanurl.com';

      await expectSaga(watchPreviewLink)
        .withState(defaultState)
        .put(PreviewLinkRoutines.fetchLink.success(fetchResponse.metaTags))
        .dispatch(PreviewLinkRoutines.fetchLink(url))
        .silentRun();
    });
  });
});
