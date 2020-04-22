import React from 'react';

import { CreatePage } from '../createPage.component';
import { defaultProps } from '../createPage.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
    replace: Function.prototype,
  }),
  useLocation: () => ({
    state: {
      page: {
        name: '',
        blocks: [],
        template: 0,
      },
    },
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
    jest.spyOn(defaultProps, 'fetchPageTemplates');
    jest.spyOn(defaultProps, 'fetchInternalConnections');
    await render();
    expect(defaultProps.fetchPageTemplates).toHaveBeenCalledWith({ projectId: 1 });
    expect(defaultProps.fetchInternalConnections).toHaveBeenCalledWith({ projectId: 1 });
  });

  it('should go back to section', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'cancelBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/section/sectionId');
  });
});
