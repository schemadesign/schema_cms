import React from 'react';
import { shallow } from 'enzyme';

import { LoaderWrapperComponent as LoaderWrapper } from '../loaderWrapper.component';

describe('LoaderWrapper: Component', () => {
  const defaultProps = {};

  const component = props => <LoaderWrapper {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
