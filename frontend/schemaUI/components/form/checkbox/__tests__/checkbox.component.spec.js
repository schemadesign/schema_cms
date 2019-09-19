import React from 'react';
import { shallow } from 'enzyme';

import { Checkbox } from '../checkbox.component';
import { defaultProps, checkedProps, context } from '../checkbox.stories';
import CheckboxGroupContext from '../../checkboxGroup/checkboxGroup.context';

describe('RadioButton: Component', () => {
  const component = props => (
    <CheckboxGroupContext.Provider value={context}>
      <Checkbox {...defaultProps} {...props}>
        radio
      </Checkbox>
    </CheckboxGroupContext.Provider>
  );

  const render = (props = {}) =>
    shallow(component(props))
      .dive()
      .dive();

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render checked', () => {
    const wrapper = render(checkedProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
