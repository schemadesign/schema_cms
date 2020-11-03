import React from 'react';

import { CreatePageTemplate } from '../createPageTemplate.component';
import { defaultProps } from '../createPageTemplate.stories';
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

describe('CreatePageTemplate: Component', () => {
  const render = props => makeContextRenderer(<CreatePageTemplate {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch blocks', async () => {
    jest.spyOn(defaultProps, 'fetchBlockTemplates');
    await render();
    expect(defaultProps.fetchBlockTemplates).toHaveBeenCalledWith({ projectId: 'projectId', raw: true });
  });
});
