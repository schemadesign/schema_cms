import React from 'react';
import { shallow } from 'enzyme';

import { Stepper } from '../stepper.component';

describe('Stepper: Component', () => {
  const defaultProps = {
    steps: 6,
    activeStep: 1,
    onStepChange: () => {},
  };

  const component = props => <Stepper {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

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

    expect(props.handleStep).toHaveBeenCalledWith(2);
  });
});
