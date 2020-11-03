import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { BackButton, BackLink, NavigationContainer, NextButton, PlusButton, PlusLink } from '../navigation.component';
import messages from '../navigation.messages';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('Navigation: Component', () => {
  const defaultButtonProps = {
    onClick: Function.prototype,
  };
  const defaultLinkProps = {
    to: 'toUrl',
  };

  const navigationComponent = props => (
    <NavigationContainer {...defaultButtonProps} {...props}>
      <NextButton />
    </NavigationContainer>
  );
  const nextButtonComponent = props => <NextButton {...defaultButtonProps} {...props} />;
  const backButtonComponent = props => <BackButton {...defaultButtonProps} {...props} />;
  const plusButtonComponent = props => <PlusButton {...defaultButtonProps} {...props} />;
  const backLinkComponent = props => <BackLink {...defaultLinkProps} {...props} />;
  const plusLinkComponent = props => <PlusLink {...defaultLinkProps} {...props} />;

  const render = (component, props = {}) => shallow(component(props));
  const renderFunction = (Component, props = {}) => makeContextRenderer(<Component {...props} />);

  it('should render NavigationContainer', () => {
    const wrapper = render(navigationComponent);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render NextButton', () => {
    const wrapper = render(nextButtonComponent);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render BackButton', () => {
    const wrapper = render(backButtonComponent);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render PlusButton', () => {
    const wrapper = render(plusButtonComponent);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render NextButton with custom children', () => {
    const children = <FormattedMessage {...messages.back} />;
    const wrapper = render(nextButtonComponent, { children });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render BackButton with custom children', () => {
    const children = <FormattedMessage {...messages.next} />;
    const wrapper = render(backButtonComponent, { children });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render PlusLink with custom children', async () => {
    const children = <FormattedMessage {...messages.next} />;
    const wrapper = await renderFunction(plusLinkComponent, { children });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render BackLink with custom children', async () => {
    const children = <FormattedMessage {...messages.next} />;
    const wrapper = await renderFunction(backLinkComponent, { children });
    expect(wrapper).toMatchSnapshot();
  });
});
