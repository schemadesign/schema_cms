import React from 'react';
import { shallow } from 'enzyme';

import { Page } from '../page.component';

describe('Page: Component', () => {
  const defaultProps = {
    match: {
      path: 'path',
    },
  };

  const component = props => <Page {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
