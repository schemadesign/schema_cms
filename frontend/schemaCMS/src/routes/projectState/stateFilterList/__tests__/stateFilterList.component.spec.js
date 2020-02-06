import React from 'react';
import { shallow } from 'enzyme';

import { StateFilterList } from '../stateFilterList.component';
import { defaultProps } from '../stateFilterList.stories';

describe('StateFilterList: Component', () => {
  const component = props => <StateFilterList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
