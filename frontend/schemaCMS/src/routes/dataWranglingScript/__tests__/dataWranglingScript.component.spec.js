import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingScript } from '../dataWranglingScript.component';
import { defaultProps } from '../dataWranglingScript.stories';

describe('View: Component', () => {
  const component = props => <DataWranglingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
