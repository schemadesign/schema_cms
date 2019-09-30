import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { BackArrowButton, BackButton, NavigationContainer, NextButton, PlusButton } from '../navigation.component';
import messages from '../navigation.messages';

describe('Navigation: Component', () => {
  const defaultProps = {
    onClick: Function.prototype,
  };

  const navigationComponent = props => (
    <NavigationContainer {...defaultProps} {...props}>
      <NextButton />
    </NavigationContainer>
  );
  const nextButtonComponent = props => <NextButton {...defaultProps} {...props} />;
  const backButtonComponent = props => <BackButton {...defaultProps} {...props} />;
  const plusButtonComponent = props => <PlusButton {...defaultProps} {...props} />;
  const backArrowButtonComponent = props => <BackArrowButton {...defaultProps} {...props} />;

  const render = (component, props = {}) => shallow(component(props));

  it('should render NavigationContainer', () => {
    const wrapper = render(navigationComponent);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render NextButton', () => {
    const wrapper = render(nextButtonComponent);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render BackButton', () => {
    const wrapper = render(backButtonComponent);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render PlusButton', () => {
    const wrapper = render(plusButtonComponent);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render BackArrowButton', () => {
    const wrapper = render(backArrowButtonComponent);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render NextButton with custom children', () => {
    const children = <FormattedMessage {...messages.back} />;
    const wrapper = render(nextButtonComponent, { children });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render BackButton with custom children', () => {
    const children = <FormattedMessage {...messages.next} />;
    const wrapper = render(backButtonComponent, { children });
    global.expect(wrapper).toMatchSnapshot();
  });
});
