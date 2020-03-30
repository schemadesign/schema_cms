import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxComponent } from '../checkbox.component';
import { checkedProps, context, defaultProps } from '../checkbox.stories';
import CheckboxGroupContext from '../../checkboxGroup/checkboxGroup.context';

describe('RadioButton: Component', () => {
  const component = props => (
    <CheckboxGroupContext.Provider value={context}>
      <CheckboxComponent {...defaultProps} {...props}>
        radio
      </CheckboxComponent>
    </CheckboxGroupContext.Provider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render checked', () => {
    const wrapper = render(checkedProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
