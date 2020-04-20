import { all, put, takeLatest } from 'redux-saga/effects';

import reportError from '../../shared/utils/reportError';
import { fetchResponse } from './previewLink.mocks';

import { PreviewLinkRoutines } from './previewLink.redux';

const mockRequest = () => fetchResponse;

function* fetchLink({ payload: { url } }) {
  try {
    const { metaTags } = yield mockRequest(`/link-preview/${url}`);

    yield put(PreviewLinkRoutines.fetchLink.success(metaTags));
  } catch (e) {
    reportError(e);
  }
}

export function* watchPreviewLink() {
  yield all([takeLatest(PreviewLinkRoutines.fetchLink.TRIGGER, fetchLink)]);
}
