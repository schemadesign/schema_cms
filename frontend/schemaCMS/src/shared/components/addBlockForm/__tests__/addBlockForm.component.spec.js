import React from 'react';
import { act } from 'react-test-renderer';

import { AddBlockForm } from '../addBlockForm.component';
import { defaultProps } from '../addBlockForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useLocation: () => ({
    state: {
      page: 'data',
    },
  }),
  useParams: () => ({
    pageId: 'pageId',
  }),
}));

describe('AddBlockForm: Component', () => {
  const render = props => makeContextRenderer(<AddBlockForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch block templates', async () => {
    jest.spyOn(defaultProps, 'fetchBlockTemplates');
    await render();
    expect(defaultProps.fetchBlockTemplates).toHaveBeenCalledWith({ projectId: 1 });
  });

  it('should go back to section', async () => {
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'backBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('backUrl', { page: 'data' });
  });

  it('should render a block template with added elements', async () => {
    const wrapper = await render();

    await act(async () => {
      await wrapper.root.findByProps({ id: 'blockTypeSelect' }).props.onSelect({ value: 0 });
    });

    expect(wrapper).toMatchSnapshot();
  });
});
