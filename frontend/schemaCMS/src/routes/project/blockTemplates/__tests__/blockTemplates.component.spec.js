import React from 'react';
import { act } from 'react-test-renderer';

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

  it('should fetch block and blocks', async () => {
    jest.spyOn(defaultProps, 'fetchBlockTemplates');

    await render();

    expect(defaultProps.fetchBlockTemplates).toHaveBeenCalledWith({ projectId: 'projectId' });
  });

  it('should redirect to create block template', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createBlockTemplate' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/block-templates/create');
  });

  it('should redirect to create block template on mobile', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createBlockTemplateMobile' }).props.onClick();

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

  it('should call copy block template', async () => {
    jest.spyOn(defaultProps, 'copyBlockTemplate');
    const wrapper = await render();
    await act(async () => {
      await wrapper.root.findByProps({ id: 'blockTemplateCopyButton-1' }).props.onClick();
    });

    expect(defaultProps.copyBlockTemplate).toHaveBeenCalledWith({ projectId: 'projectId', blockTemplateId: 1 });
  });
});
