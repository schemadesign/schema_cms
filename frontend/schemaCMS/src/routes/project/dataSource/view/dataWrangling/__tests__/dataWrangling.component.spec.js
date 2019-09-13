import React from 'react';
import { shallow } from 'enzyme';

import { DataWrangling } from '../dataWrangling.component';
import { defaultProps } from '../dataWrangling.stories';

describe('DataWrangling: Component', () => {
  const component = props => <DataWrangling {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
