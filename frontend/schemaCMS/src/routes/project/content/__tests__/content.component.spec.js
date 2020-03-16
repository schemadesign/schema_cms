import React from 'react';

import { Content } from '../content.component';
import { defaultProps } from '../content.stories';
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

describe('Content: Component', () => {
  const render = props => makeContextRenderer(<Content {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should go back', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId');
  });

  it('should fetch sections', async () => {
    jest.spyOn(defaultProps, 'fetchSections');
    await render();

    expect(defaultProps.fetchSections).toHaveBeenCalledWith({ projectId: 'projectId' });
  });

  it('should go to create page', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'createSection' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/section/create');
  });

  it('should go to create page on mobile', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'creatSectionMobile' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/section/create');
  });
});
