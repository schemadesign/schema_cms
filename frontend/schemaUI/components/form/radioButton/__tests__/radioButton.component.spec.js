import React from 'react';
import { shallow } from 'enzyme';

import { RadioButtonComponent } from '../radioButton.component';
import RadioGroupContext from '../../radioGroup/radioGroup.context';

describe('RadioButtonComponent: Component', () => {
  const defaultProps = {
    value: 'value',
    label: 'name',
    id: 'id',
  };

  const context = {
    name: 'name',
    onChange: () => {},
    value: null,
    customLabelStyles: {
      background: 'blue',
    },
    customCheckedStyles: {
      opacity: 0.3,
    },
  };

  const component = props => (
    <RadioGroupContext.Provider value={context}>
      <RadioButtonComponent {...defaultProps} {...props}>
        radio
      </RadioButtonComponent>
    </RadioGroupContext.Provider>
  );

  const render = (props = {}) =>
    shallow(component(props))
      .dive()
      .dive();

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
