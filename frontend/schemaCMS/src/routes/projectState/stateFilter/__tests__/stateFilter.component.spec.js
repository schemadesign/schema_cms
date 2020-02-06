import React from 'react';
import { shallow } from 'enzyme';

import { StateFilter } from '../stateFilter.component';

describe('StateFilter: Component', () => {
  const defaultProps = {};

  const component = props => <StateFilter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
