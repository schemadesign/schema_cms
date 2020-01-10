import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';
import { defaultProps } from '../list.stories';

describe('List: Component', () => {
  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loading', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const props = {
      fetchProjectsList: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render without data', async () => {
    const props = {
      fetchProjectsList: jest.fn().mockReturnValue(Promise.resolve()),
      list: [],
    };
    const wrapper = render(props);
    await Promise.resolve();

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchProjectsList on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchProjectsList');

    await render();

    expect(defaultProps.fetchProjectsList).toHaveBeenCalled();
  });
});
