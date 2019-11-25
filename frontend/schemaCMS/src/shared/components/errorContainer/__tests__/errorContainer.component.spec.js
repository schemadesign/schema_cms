import React from 'react';
import { shallow } from 'enzyme';

import { ErrorContainer } from '../errorContainer.component';
import { pageErrorProps } from '../errorContainer.stories';

describe('ErrorContainer: Component', () => {
  const defaultProps = {};

  const component = props => <ErrorContainer {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render(pageErrorProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
