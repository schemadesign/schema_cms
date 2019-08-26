import React from 'react';
import { shallow } from 'enzyme';

import { RadioGroup } from '../radioGroup.component';
import { RadioButton } from '../../radioButton';

describe('RadioGroup: Component', () => {
  const defaultProps = {
    handleChange: () => {},
    name: 'radio',
    value: null,
  };

  const component = props => (
    <RadioGroup {...defaultProps} {...props}>
      <RadioButton label="label 1" value="value 1">
        label 1
      </RadioButton>
      <RadioButton label="label 2" value="value 2">
        label 2
      </RadioButton>
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
