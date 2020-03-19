import React from 'react';

import { CreatePage } from '../createPage.component';
import { defaultProps } from '../createPage.stories';
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

describe('CreatePage: Component', () => {
  const render = props => makeContextRenderer(<CreatePage {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch page templates and section', async () => {
    jest.spyOn(defaultProps, 'fetchSection');
    jest.spyOn(defaultProps, 'fetchPageTemplates');
    await render();
    expect(defaultProps.fetchSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
    expect(defaultProps.fetchPageTemplates).toHaveBeenCalledWith({ projectId: 'projectId' });
  });

  it('should go back to section', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId');
  });
});