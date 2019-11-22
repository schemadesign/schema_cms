import React from 'react';
import { shallow } from 'enzyme';

import { ResetPassword } from '../resetPassword.component';
import { defaultProps } from '../resetPassword.stories';
import { AUTH_METHODS } from '../../../modules/userProfile/userProfile.constants';

describe('ResetPassword: Component', () => {
  const component = props => <ResetPassword {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call resetPassword function on componentDidMount', () => {
    jest.spyOn(defaultProps, 'resetPassword');
    render();

    expect(defaultProps.resetPassword).toHaveBeenCalled();
  });

  it('should go to settings', () => {
    defaultProps.userData.authMethod = AUTH_METHODS.GMAIL;
    jest.spyOn(defaultProps.history, 'push');
    render(defaultProps);

    expect(defaultProps.history.push).toHaveBeenCalled();
  });
});
