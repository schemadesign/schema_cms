import React from 'react';
import { shallow } from 'enzyme';

import { StateFilter } from '../stateFilter.component';
import { defaultProps } from '../stateFilter.stories';

describe('StateFilter: Component', () => {
  const component = props => <StateFilter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
