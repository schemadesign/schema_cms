import React from 'react';
import { shallow } from 'enzyme';

import { EditState } from '../editState.component';
import { defaultProps } from '../editState.stories';

describe('EditState: Component', () => {
  const component = props => <EditState {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
