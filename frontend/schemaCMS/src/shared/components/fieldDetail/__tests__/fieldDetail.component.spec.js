import React from 'react';
import { shallow } from 'enzyme';

import { FieldDetail } from '../fieldDetail.component';
import { defaultProps } from '../fieldDetail.stories';

describe('FieldDetail: Component', () => {
  const component = props => <FieldDetail {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
