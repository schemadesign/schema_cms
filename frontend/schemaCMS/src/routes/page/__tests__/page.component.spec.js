import React from 'react';

import { Page } from '../page.component';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

const defaultProps = {
  fetchPage: Function.prototype,
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useRouteMatch: () => ({
    path: 'path',
  }),
  useParams: () => ({
    pageId: 'pageId',
  }),
}));

describe('Page: Component', () => {
  const render = props => makeContextRenderer(<Page {...defaultProps} {...props} />);

  it('should fetch page', async () => {
    jest.spyOn(defaultProps, 'fetchPage');
    await render();
    expect(defaultProps.fetchPage).toHaveBeenCalledWith({ pageId: 'pageId' });
  });
});
