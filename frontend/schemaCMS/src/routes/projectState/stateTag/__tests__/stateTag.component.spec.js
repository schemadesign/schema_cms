import React from 'react';
import { shallow } from 'enzyme';

import { StateTag } from '../stateTag.component';
import { defaultProps } from '../stateTag.stories';

describe('StateTag: Component', () => {
  const component = props => <StateTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
