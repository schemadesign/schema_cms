import React from 'react';
import { act } from 'react-test-renderer';

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

  it('should fetch block and blocks', async () => {
    jest.spyOn(defaultProps, 'fetchBlockTemplate');
    jest.spyOn(defaultProps, 'fetchBlockTemplates');
    await render();
    expect(defaultProps.fetchBlockTemplate).toHaveBeenCalledWith({ blockTemplateId: 'blockTemplateId' });
    expect(defaultProps.fetchBlockTemplates).toHaveBeenCalledWith({ projectId: 'projectId', raw: true });
  });

  it('should redirect to block templates', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates');
  });

  it('should remove block and redirect to list', async () => {
    jest.spyOn(defaultProps, 'removeBlockTemplate');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'removeBlock' }).props.onClick();
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmRemovalBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.removeBlockTemplate).toHaveBeenCalledWith({ blockTemplateId: 'blockTemplateId' });
    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates');
  });
});
