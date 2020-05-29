import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'schemaUI';

import { StateFilterList } from '../stateFilterList.component';
import { defaultProps } from '../stateFilterList.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

const { CheckboxGroup } = Form;
const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
}));

describe('StateFilterList: Component', () => {
  const render = props => makeContextRenderer(<StateFilterList {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should deselect filter', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByType(CheckboxGroup).props.onChange({ target: { value: '1', checked: false } });
    });

    await Promise.resolve();
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('activeFilters', []);
  });

  it('should select filter', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByType(CheckboxGroup).props.onChange({ target: { value: '2', checked: true } });
    });

    await Promise.resolve();
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('activeFilters', [1, 2]);
  });

  it('should redirect to filter if filter is not set', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByType(CheckboxGroup).props.onChange({ target: { value: '3', checked: true } });
    });

    await Promise.resolve();
    expect(mockPushHistory).toHaveBeenCalledWith('/state/filter/3', {
      backUrl: '/',
      state: {
        activeFilters: [1],
        filters: [{ filter: 1, values: ['George'] }, { filter: 2, values: ['Washington'] }],
      },
    });
  });

  it('should redirect to filter', async () => {
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'filterName-1' }).props.onClick();
    });

    await Promise.resolve();
    expect(mockPushHistory).toHaveBeenCalledWith('/state/filter/2', {
      backUrl: '/',
      state: {
        activeFilters: [1],
        filters: [{ filter: 1, values: ['George'] }, { filter: 2, values: ['Washington'] }],
      },
    });
  });
});
