import React from 'react';
import { shallow } from 'enzyme';

import { RadioGroup } from '../radioGroup.component';
import { RadioBaseComponent } from '../../radioButton/radioBase/radioBase.component.js';

describe('RadioGroup: Component', () => {
  const defaultProps = {
    onChange: () => {},
    name: 'radio',
    value: null,
  };

  const component = props => (
    <RadioGroup {...defaultProps} {...props}>
      <RadioBaseComponent label="label 1" value="value 1" id="label 1">
        label 1
      </RadioBaseComponent>
      <RadioBaseComponent label="label 2" value="value 2" id="label 2">
        label 2
      </RadioBaseComponent>
    </RadioGroup>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const props = {
      customStyles: {
        background: 'blue',
      },
      customCheckedStyles: {
        opacity: 0.9,
      },
      customLabelStyles: {
        background: 'red',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
