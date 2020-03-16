import React from 'react';

import { CreateSection } from '../createSection.component';
import { defaultProps } from '../createSection.stories';
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

describe('CreateSection: Component', () => {
  const render = props => makeContextRenderer(<CreateSection {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should go back', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/content');
  });
});
