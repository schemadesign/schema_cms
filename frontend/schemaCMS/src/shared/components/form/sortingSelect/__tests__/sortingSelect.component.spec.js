import React from 'react';
import { Icons } from 'schemaUI';
import { act } from 'react-test-renderer';
import Select from 'react-select';

import { SortingSelect } from '../sortingSelect.component';
import { defaultProps } from '../sortingSelect.stories';
import { makeContextRenderer } from '../../../../utils/testUtils';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useLocation: () => ({
    search: '?sortBy=name&sortDirection=ascending',
  }),
}));

const { CaretIcon } = Icons;

describe('SortingSelect: Component', () => {
  const render = props => makeContextRenderer(<SortingSelect {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should change sorting direction', async () => {
    jest.spyOn(defaultProps, 'updateFunction');
    const wrapper = await render();
    act(() => {
      wrapper.root.findByType(CaretIcon).props.onClick();
    });
    expect(defaultProps.updateFunction).toHaveBeenCalledWith();
    expect(mockPushHistory).toHaveBeenCalledWith('?sortBy=name&sortDirection=descending');
  });

  it('should clear sort by', async () => {
    jest.spyOn(defaultProps, 'updateFunction');
    const wrapper = await render();
    act(() => {
      wrapper.root.findByType(Select).props.onChange();
    });
    expect(defaultProps.updateFunction).toHaveBeenCalledWith();
    expect(mockPushHistory).toHaveBeenCalledWith('?');
  });

  it('should change sort by', async () => {
    jest.spyOn(defaultProps, 'updateFunction');
    const wrapper = await render();
    act(() => {
      wrapper.root.findByType(Select).props.onChange({ value: 'created', label: 'Created' });
    });
    expect(defaultProps.updateFunction).toHaveBeenCalledWith();
    expect(mockPushHistory).toHaveBeenCalledWith('?sortBy=created&sortDirection=ascending');
  });
});
