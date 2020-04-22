import { useDispatch, useSelector } from 'react-redux';
import { PreviewLinkRoutines, selectMetaTags } from '../../modules/previewLink';

export const useLinkPreview = () => {
  const dispatch = useDispatch();

  const metaTags = useSelector(selectMetaTags);
  const fetchLink = payload => dispatch(PreviewLinkRoutines.fetchLink(payload));

  return [metaTags, fetchLink];
};
