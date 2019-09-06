import React from 'react';
import { shallow } from 'enzyme';

import { Source } from '../source.component';

describe('Source: Component', () => {
  const defaultProps = {
    values: {},
    onChange: Function.prototype,
    setFieldValue: Function.prototype,
  };

  const component = props => <Source {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
