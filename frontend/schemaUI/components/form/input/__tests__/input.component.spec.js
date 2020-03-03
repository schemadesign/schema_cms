import React from 'react';
import { mount } from 'enzyme';

import { Input } from '../input.component';
import { defaultProps, withCustomStyles, withAutoWidth } from '../input.stories';

describe('Input: Component', () => {
  const component = props => <Input {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const wrapper = render({ withCustomStyles });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with auto width', () => {
    const wrapper = render({ withAutoWidth });
    expect(wrapper).toMatchSnapshot();
  });
});
