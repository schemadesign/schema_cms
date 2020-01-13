import React from 'react';
import { shallow } from 'enzyme';

import { Fields } from '../fields.component';
import { defaultProps } from '../fields.stories';

describe('Fields: Component', () => {
  const component = props => <Fields {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
