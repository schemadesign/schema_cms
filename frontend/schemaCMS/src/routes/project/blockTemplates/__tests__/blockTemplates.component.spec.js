import React from 'react';

import { BlockTemplates } from '../blockTemplates.component';
import { defaultProps } from '../blockTemplates.stories';
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

describe('BlockTemplates: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplates {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should redirect to create page', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createTemplateBlock' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates/create');
  });

  it('should redirect to create page on mobile', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createTemplateBlockMobile' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates/create');
  });

  it('should go back', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates/create');
  });

  it('should redirect to block template', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'blockTemplateTitle-1' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/block-template/1');
  });
});
