import React from 'react';
import { mount } from 'enzyme';

import { withStyles } from '../withStyles.component';

describe('WithStyles: Component', () => {
  const props = {
    theme: {
      color: 'black',
    },
  };

  const component = props => <div {...props} />;

  const render = (props = {}) => mount(withStyles(component)(props));

  it('should render correctly', () => {
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
