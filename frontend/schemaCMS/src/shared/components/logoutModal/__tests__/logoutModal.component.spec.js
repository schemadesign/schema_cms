import React from 'react';
import { shallow } from 'enzyme';

import { LogoutModal } from '../logoutModal.component';

describe('LogoutModal: Component', () => {
  const defaultProps = {
    logoutModalOpen: true
    onConfirm: Function.prototype,
    onCancel: Function.prototype,
  };

  const component = props => <LogoutModal {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
