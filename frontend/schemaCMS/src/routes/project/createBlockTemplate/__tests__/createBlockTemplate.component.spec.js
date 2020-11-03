import React from 'react';

import { CreateBlockTemplate } from '../createBlockTemplate.component';
import { defaultProps } from '../createBlockTemplate.stories';
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

describe('CreateBlockTemplate: Component', () => {
  const render = props => makeContextRenderer(<CreateBlockTemplate {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
