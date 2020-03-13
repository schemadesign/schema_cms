import React from 'react';
import { act } from 'react-test-renderer';

import { PageTemplate } from '../pageTemplate.component';
import { defaultProps } from '../pageTemplate.stories';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    pageTemplateId: 'pageTemplateId',
  }),
}));

describe('PageTemplate: Component', () => {
  const render = props => makeContextRenderer(<PageTemplate {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch page and pages', async () => {
    jest.spyOn(defaultProps, 'fetchPageTemplate');
    jest.spyOn(defaultProps, 'fetchBlockTemplates');
    await render();
    expect(defaultProps.fetchPageTemplate).toHaveBeenCalledWith({ pageTemplateId: 'pageTemplateId' });
    expect(defaultProps.fetchBlockTemplates).toHaveBeenCalledWith({ projectId: 'projectId' });
  });

  it('should redirect to page templates', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/page-templates');
  });

  it('should remove page and redirect to list', async () => {
    jest.spyOn(defaultProps, 'removePageTemplate');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'removePage' }).props.onClick();
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmRemovalBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.removePageTemplate).toHaveBeenCalledWith({ pageTemplateId: 'pageTemplateId' });
    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/page-templates');
  });
});
