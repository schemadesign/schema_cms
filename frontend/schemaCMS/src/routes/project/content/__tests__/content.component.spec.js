import React from 'react';

import { Content } from '../content.component';
import { defaultProps } from '../content.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    projectId: 'projectId',
  }),
}));

describe('Content: Component', () => {
  const render = props => makeContextRenderer(<Content {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch sections', async () => {
    jest.spyOn(defaultProps, 'fetchSections');
    await render();

    expect(defaultProps.fetchSections).toHaveBeenCalledWith({ projectId: 'projectId' });
  });
});
