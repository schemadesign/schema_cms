import React from 'react';
import { shallow } from 'enzyme';

import { BlockTemplates } from '../blockTemplates.component';

describe('BlockTemplates: Component', () => {
  const defaultProps = {};

  const component = props => <BlockTemplates {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
