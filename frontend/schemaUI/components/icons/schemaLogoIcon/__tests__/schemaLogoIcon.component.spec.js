import React from 'react';
import { shallow } from 'enzyme';

import { SchemaLogoIcon } from '../schemaLogoIcon.component';

describe('SchemaLogoIcon: Component', () => {
  const defaultProps = {};

  const component = props => <SchemaLogoIcon {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
