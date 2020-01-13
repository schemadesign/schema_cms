import React from 'react';
import { shallow } from 'enzyme';

import { NotAuthorized } from '../notAuthorized.component';
import { defaultProps } from '../notAuthorized.stories';

describe('NotAuthorized: Component', () => {
  const component = props => <NotAuthorized {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
