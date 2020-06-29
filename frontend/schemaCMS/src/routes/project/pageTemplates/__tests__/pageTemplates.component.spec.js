import React from 'react';

import { PageTemplates } from '../pageTemplates.component';
import { defaultProps } from '../pageTemplates.stories';
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

describe('PageTemplates: Component', () => {
  const render = props => makeContextRenderer(<PageTemplates {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch block and blocks', async () => {
    jest.spyOn(defaultProps, 'fetchPageTemplates');

    await render();

    expect(defaultProps.fetchPageTemplates).toHaveBeenCalledWith({ projectId: 'projectId' });
  });

  it('should redirect to create page template', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createPageTemplate' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/page-templates/create');
  });

  it('should redirect to create page template on mobile', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createPageTemplateMobile' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/page-templates/create');
  });

  it('should go back', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/templates');
  });

  it('should redirect to page template', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'pageTemplateTitle-1' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/page-template/1');
  });

  it('should call copy page template', async () => {
    jest.spyOn(defaultProps, 'copyPageTemplate');
    const wrapper = await render();
    await act(async () => {
      await wrapper.root.findByProps({ id: 'pageTemplateCopyButton-1' }).props.onClick();
    });

    expect(defaultProps.copyPageTemplate).toHaveBeenCalledWith({ projectId: 'projectId', pageTemplateId: 1 });
  });
});
