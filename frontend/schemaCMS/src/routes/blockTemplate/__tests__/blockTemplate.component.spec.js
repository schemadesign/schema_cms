import React from 'react';

import { BlockTemplate } from '../blockTemplate.component';
import { defaultProps } from '../blockTemplate.stories';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    blockTemplateId: 'blockTemplateId',
  }),
}));

describe('BlockTemplate: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplate {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render called', async () => {
    jest.spyOn(defaultProps, 'fetchBlockTemplate');
    await render();
    expect(defaultProps.fetchBlockTemplate).toHaveBeenCalledWith({ blockTemplateId: 'blockTemplateId' });
  });

  it('should redirect to block templates', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates');
  });
});
