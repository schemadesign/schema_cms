import React from 'react';
import { shallow } from 'enzyme';

import { Loading } from '../loading.component';

describe('Loading: Component', () => {
  const component = props => <Loading {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
