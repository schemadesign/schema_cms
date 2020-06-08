import React from 'react';

import { DataSourceStateList } from '../dataSourceStateList.component';
import { defaultProps, noStatesProps } from '../dataSourceStateList.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('DataSourceStateList: Component', () => {
  const render = props => makeContextRenderer(<DataSourceStateList {...defaultProps} {...props} />);

  it('should render correctly with loader', async () => {
    const wrapper = await render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchStates = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchStates,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no tags', async () => {
    const fetchStates = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      ...noStatesProps,
      fetchStates,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchStates on componentDidMount', async () => {
    const fetchStates = jest.spyOn(defaultProps, 'fetchStates');

    await render({
      fetchStates,
    });

    expect(fetchStates).toHaveBeenCalledTimes(1);
  });
});
