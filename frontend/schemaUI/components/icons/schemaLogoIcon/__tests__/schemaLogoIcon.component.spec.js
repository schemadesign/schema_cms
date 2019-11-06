import React from 'react';
import { shallow } from 'enzyme';

import { SchemaLogoIconComponent } from '../schemaLogoIcon.component';

describe('SchemaLogoIcon: Component', () => {
  const defaultProps = {};

  const component = props => <SchemaLogoIconComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
