import React from 'react';
import { shallow } from 'enzyme';

import { CsvIcon } from '../csvIcon.component';

describe('CsvIcon: Component', () => {
  const defaultProps = {};

  const component = props => <CsvIcon {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
