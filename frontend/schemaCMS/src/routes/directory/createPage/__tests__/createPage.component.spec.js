import React from 'react';
import { shallow } from 'enzyme';

import { CreatePage } from '../createPage.component';
import { defaultProps } from '../createPage.stories';

describe('CreatePage: Component', () => {
  const component = props => <CreatePage {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
