import React from 'react';
import { shallow } from 'enzyme';

import { PillButtons } from '../pillButtons.component';

describe('PillButtons: Component', () => {
  const defaultProps = {};

  const component = props => <PillButtons {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
