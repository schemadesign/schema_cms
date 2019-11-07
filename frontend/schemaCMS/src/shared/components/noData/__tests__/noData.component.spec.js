import React from 'react';
import { shallow } from 'enzyme';

import { NoData } from '../noData.component';

describe('NoData: Component', () => {
  const defaultProps = {};

  const component = props => <NoData {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
