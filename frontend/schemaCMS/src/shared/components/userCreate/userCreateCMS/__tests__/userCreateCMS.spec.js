import React from 'react';
import { shallow } from 'enzyme';

import { UserCreateCMS } from '../userCreateCMS.component';
import { userCreateCMSProps } from '../userCreateCMS.stories';

describe('UserCreateCMS: Component', () => {
  const component = props => <UserCreateCMS {...userCreateCMSProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
