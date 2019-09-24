import React from 'react';
import { mount } from 'enzyme';

import { StepperComponent } from '../stepper.component';

describe('Stepper: Component', () => {
  const defaultProps = {
    steps: 6,
    activeStep: 1,
    onStepChange: () => {},
  };

  const component = props => <StepperComponent {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const props = {
      customStyles: {
        flexDirection: 'column',
      },
      customActiveDotStyles: {
        backgroundColor: 'red',
      },
      customDotStyles: {
        backgroundColor: 'blue',
        margin: '4px',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call onButtonClick prop on button click if component is provided', () => {
    const onStepChange = jest.fn();
    const props = { onStepChange };
    const wrapper = render(props);

    wrapper
      .find('span')
      .at(1)
      .simulate('click');

    expect(props.onStepChange).toHaveBeenCalledWith(2);
  });
});
