import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';
import { defaultProps } from '../list.stories';

describe('List: Component', () => {
  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loading', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render({
      fetchProjectsList: jest.fn().mockReturnValue(Promise.resolve()),
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render without data', async () => {
    const wrapper = await render({
      fetchProjectsList: jest.fn().mockReturnValue(Promise.resolve()),
      list: [],
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error correctly', async () => {
    const wrapper = await render({
      fetchProjectsList: jest.fn().mockReturnValue(Promise.reject('Error')),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe('Error');
  });

  it('should call fetchProjectsList on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchProjectsList');

    await render();

    expect(defaultProps.fetchProjectsList).toHaveBeenCalled();
  });
});
