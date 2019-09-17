import React from 'react';
import { mount } from 'enzyme';

import { Source } from '../source.component';
import { defaultProps } from '../source.stories';

describe('Source: Component', () => {
  const component = props => <Source {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
