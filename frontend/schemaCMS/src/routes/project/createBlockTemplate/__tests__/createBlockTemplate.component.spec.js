import React from 'react';
import { shallow } from 'enzyme';

import { CreateBlockTemplate } from '../createBlockTemplate.component';

describe('CreateBlockTemplate: Component', () => {
  const defaultProps = {};

  const component = props => <CreateBlockTemplate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
