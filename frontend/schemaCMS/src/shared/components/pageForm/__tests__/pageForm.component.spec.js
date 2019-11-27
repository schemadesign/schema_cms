import React from 'react';
import { shallow } from 'enzyme';

import { PageForm } from '../pageForm.component';
import { defaultProps } from '../pageForm.stories';

describe('PageForm: Component', () => {
  const component = props => <PageForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
