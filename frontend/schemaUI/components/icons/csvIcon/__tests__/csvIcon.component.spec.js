import React from 'react';
import { shallow } from 'enzyme';

import { CsvIconComponent } from '../csvIcon.component';

describe('CsvIcon: Component', () => {
  const defaultProps = {};

  const component = props => <CsvIconComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
