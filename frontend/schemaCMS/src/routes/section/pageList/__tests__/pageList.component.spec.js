import React from 'react';
import { act } from 'react-test-renderer';

import { PageList } from '../pageList.component';
import { defaultProps } from '../pageList.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    sectionId: 'sectionId',
  }),
}));

describe('PageList: Component', () => {
  const render = props => makeContextRenderer(<PageList {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch section', async () => {
    jest.spyOn(defaultProps, 'fetchSection');
    await render();
    expect(defaultProps.fetchSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
  });

  it('should go back to content', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/content');
  });

  it('should redirect to create page', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createPage' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId/create-page');
  });

  it('should redirect to create page on mobile', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createPageMobile' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId/create-page');
  });

  it('should redirect to page', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'page-1' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/page/1');
  });

  it('should remove page and redirect to content', async () => {
    jest.spyOn(defaultProps, 'removeSection');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'removeSection' }).props.onClick();
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmRemovalBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.removeSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/content');
  });
});
