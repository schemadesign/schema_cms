import React from 'react';
import { act } from 'react-test-renderer';

import { EditPage } from '../editPage.component';
import { defaultProps } from '../editPage.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    pageId: 'pageId',
  }),
}));

describe('EditPage: Component', () => {
  const render = props => makeContextRenderer(<EditPage {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch page templates and internal connections', async () => {
    jest.spyOn(defaultProps, 'fetchPageAdditionalData');
    await render();
    expect(defaultProps.fetchPageAdditionalData).toHaveBeenCalledWith({ projectId: 1 });
  });

  it('should go back to section', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId');
  });

  it('should publish the page', async () => {
    jest.spyOn(defaultProps, 'publishPage');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'publishPage' }).props.onClick();
    });
    await act(async () => {
      await wrapper.root.findByProps({ id: 'confirmPublishBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.publishPage).toHaveBeenCalledWith({ pageId: 'pageId' });
  });

  it('should remove page and redirect to content', async () => {
    jest.spyOn(defaultProps, 'removePage');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'removePage' }).props.onClick();
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmRemovalBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.removePage).toHaveBeenCalledWith({ pageId: 'pageId' });
    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId');
  });
});
